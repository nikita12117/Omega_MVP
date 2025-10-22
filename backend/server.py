from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
from enum import Enum
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage
import jwt
import bcrypt
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'omega-aurora-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 7

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'cUtsuv-8nirbe-tippop')
# Note: Password is hashed on-the-fly during login check for security

# Token pricing (based on average GPT-4.1 usage)
# Average tokens per agent generation: ~5000 tokens (clarify ~1500, optimize ~1500, final ~2000)
TOKENS_FOR_2_AGENTS = 10000   # 2 agents * 5000 tokens
TOKENS_FOR_7_AGENTS = 35000   # 7 agents * 5000 tokens
INITIAL_TOKENS = TOKENS_FOR_2_AGENTS  # New users get 2 free agents
TOKEN_LIMIT_MIN = -60000  # Max debt = ~12 agents (to prevent attacks)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Omega Agent Generator Models
class OmegaStage(str, Enum):
    clarify = "clarify"
    optimize = "optimize"
    final = "final"

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GenerateRequest(BaseModel):
    session_id: Optional[str] = None
    stage: OmegaStage
    pattern: Optional[str] = None  # CustomerSupport, LeadQualification, etc.
    messages: List[ChatMessage]
    user_input: str
    master_prompt: Optional[str] = None  # Custom system prompt for agent behavior

class GenerateResponse(BaseModel):
    stage: OmegaStage
    questions: Optional[List[str]] = None  # For clarify stage
    suggestions: Optional[List[str]] = None  # For optimize stage
    prompt_markdown: Optional[str] = None  # For final stage
    usage: Optional[dict] = None  # Token usage info

# Generated Prompt History Models
class AgentCharacteristics(BaseModel):
    general_function: str  # Obecná funkce
    specialization: str    # Specializace
    output: str           # Výstup

# User Authentication Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: Optional[str] = None  # Optional for demo accounts
    name: Optional[str] = None  # Optional for demo accounts
    picture: Optional[str] = None
    is_admin: bool = False
    is_banned: bool = False  # Admin can ban users
    # Demo account fields
    is_demo: bool = False  # True for QR-activated demo accounts
    demo_expires_at: Optional[datetime] = None  # 72h expiry for demo accounts
    demo_activation_token: Optional[str] = None  # The token used to activate this demo
    # Phone verification fields
    phone_number: Optional[str] = None  # Format: +420XXXXXXXXX
    phone_verified: bool = False  # True only after SMS verification
    phone_verification_code: Optional[str] = None  # 6-digit code for verification
    phone_verification_expires: Optional[datetime] = None
    # Google OAuth fields
    google_id: Optional[str] = None  # Google user ID for OAuth accounts
    # Referral program fields
    referral_code: Optional[str] = None  # Unique code for this user (e.g., "OMEGA-ABC123")
    referred_by: Optional[str] = None  # User ID who referred this user
    referral_count: int = 0  # Number of successfully referred users
    # Token balance
    omega_tokens_balance: int = INITIAL_TOKENS  # Initial balance for new users
    locked_price_99: Optional[float] = None  # Locked price for 99 CZK package
    locked_price_399: Optional[float] = None  # Locked price for 399 CZK package
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Kept for backward compat
    last_login_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # New field for admin analytics

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: int  # Positive for purchase, negative for usage
    balance_after: int
    transaction_type: Literal["initial", "purchase", "usage", "admin_grant"]
    description: str
    openai_tokens_used: Optional[int] = None  # For usage transactions
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Auth Request/Response Models
class AdminLoginRequest(BaseModel):
    username: str
    password: str

class SessionDataRequest(BaseModel):
    session_id: str

class AuthResponse(BaseModel):
    user: dict
    token: str
    omega_tokens_balance: int

class UserProfileResponse(BaseModel):
    id: str
    email: Optional[str]
    name: Optional[str]
    picture: Optional[str]
    is_admin: bool
    is_banned: bool
    is_demo: bool
    demo_expires_at: Optional[str]  # ISO format
    omega_tokens_balance: int
    locked_price_99: Optional[float]
    locked_price_399: Optional[float]
    # Phone verification
    phone_number: Optional[str]
    phone_verified: bool
    # Referral program
    referral_code: Optional[str]
    referral_count: int

# Phone Verification Models
class PhoneVerificationRequest(BaseModel):
    phone_number: str  # Format: +420XXXXXXXXX

class PhoneVerificationCodeRequest(BaseModel):
    phone_number: str
    verification_code: str

class ReferralStatsResponse(BaseModel):
    referral_code: str
    referral_count: int
    total_rewards_earned: int
    referral_link: str
    referred_users: List[dict]  # [{name, email, verified_at, reward_earned}]

class GeneratedPrompt(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Link to user who created this prompt
    name: str  # Auto-generated by GPT-4.1, user can edit
    description: AgentCharacteristics  # Auto-generated by GPT-4.1
    master_prompt: str  # The final generated prompt
    conversation_summary: Optional[str] = None  # Brief summary of conversation
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GeneratedPromptCreate(BaseModel):
    conversation_context: str  # Full conversation to generate name and description from
    master_prompt: str

class GeneratedPromptUpdate(BaseModel):
    name: str

class GeneratedPromptResponse(BaseModel):
    id: str
    name: str
    description: AgentCharacteristics
    master_prompt: str
    conversation_summary: Optional[str] = None
    created_at: datetime

# Demo Activation Token Models
class DemoActivationToken(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    token: str  # Short unique code (e.g., "OMEGA-2025-ABC")
    label: str  # Admin label (e.g., "Prague Conference 2025")
    created_by: str  # Admin user ID
    max_activations: Optional[int] = None  # null = unlimited
    activations_count: int = 0
    status: Literal["active", "disabled", "expired"] = "active"
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DemoActivationRequest(BaseModel):
    token: str
    ref: Optional[str] = None  # Referral code

class CreateQRTokenRequest(BaseModel):
    label: str
    max_activations: Optional[int] = None
    notes: Optional[str] = None

class UpdateQRTokenRequest(BaseModel):
    status: Literal["active", "disabled", "expired"]

# Feedback Models
class Feedback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    rating: int  # 1-5 stars
    comment: Optional[str] = None
    keywords: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FeedbackRequest(BaseModel):
    rating: int
    comment: Optional[str] = None
    keywords: Optional[List[str]] = None

# Platform Settings Model
class PlatformSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "global"  # Single settings document
    use_emergent_key: bool = True  # Use Emergent LLM key vs custom OpenAI key
    custom_openai_api_key: Optional[str] = None
    selected_model: str = "gpt-4.1"  # Default model
    price_99: float = 99.0  # Price for 10K tokens package
    price_399: float = 399.0  # Price for 35K tokens package
    default_master_prompt: Optional[str] = None  # Platform-wide default
    # GoPay Payment Gateway Settings
    gopay_enabled: bool = False
    gopay_goid: Optional[str] = None  # GoID from GoPay
    gopay_client_id: Optional[str] = None  # Client ID for OAuth
    gopay_client_secret: Optional[str] = None  # Client Secret for OAuth
    gopay_is_production: bool = False  # False = sandbox, True = production
    gopay_return_url: Optional[str] = None  # URL where customer returns after payment
    gopay_notification_url: Optional[str] = None  # URL for payment status notifications
    # Referral Program Settings
    referral_reward_tokens: int = 10000  # Tokens awarded for successful referral
    # SMS Settings
    sms_enabled: bool = False  # Enable real SMS (False = mock mode)
    sms_provider: str = "aws_sns"  # "aws_sns" or "smsmanager"
    # AWS SNS credentials
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "eu-central-1"  # Default EU region (Frankfurt)
    # SMSmanager.cz credentials
    smsmanager_api_key: Optional[str] = None
    smsmanager_gateway: Optional[str] = None  # Gateway number/name
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlatformSettingsUpdate(BaseModel):
    use_emergent_key: Optional[bool] = None
    custom_openai_api_key: Optional[str] = None
    selected_model: Optional[str] = None
    price_99: Optional[float] = None
    price_399: Optional[float] = None
    default_master_prompt: Optional[str] = None
    # GoPay settings
    gopay_enabled: Optional[bool] = None
    gopay_goid: Optional[str] = None
    gopay_client_id: Optional[str] = None
    gopay_client_secret: Optional[str] = None
    gopay_is_production: Optional[bool] = None
    gopay_return_url: Optional[str] = None
    gopay_notification_url: Optional[str] = None
    # Referral settings
    referral_reward_tokens: Optional[int] = None
    # SMS settings
    sms_enabled: Optional[bool] = None
    sms_provider: Optional[str] = None
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: Optional[str] = None
    smsmanager_api_key: Optional[str] = None
    smsmanager_gateway: Optional[str] = None

# Admin Models
class AdminOverviewResponse(BaseModel):
    total_revenue: float
    total_users: int
    active_users_24h: int
    active_users_7d: int
    avg_tokens_per_agent: float
    min_consumption: Optional[dict] = None  # {tokens, user_name, agent_name}
    max_consumption: Optional[dict] = None  # {tokens, user_name, agent_name}
    token_history: List[dict]  # [{day, tokens}]

class AdminUserListItem(BaseModel):
    id: str
    sequence_id: int  # Sequential ID based on registration order (admin is 1)
    name: str
    email: str
    is_banned: bool
    omega_tokens_balance: int
    agents_count: int
    total_tokens_consumed: int
    most_expensive_agent: str
    last_login_at: datetime

class AdminUserDetailResponse(BaseModel):
    id: str
    name: str
    email: str
    picture: Optional[str]
    is_banned: bool
    omega_tokens_balance: int
    agents_count: int
    total_tokens_consumed: int
    agents: List[GeneratedPromptResponse]
    created_at: datetime
    last_login_at: datetime

class TokenAdjustmentRequest(BaseModel):
    delta: int  # Can be positive or negative, but resulting balance >= 0

# GDPR Audit Log Model
class AuditLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action: str  # "access", "export", "delete", "update", "view"
    resource_type: str  # "user_profile", "transactions", "prompts", "settings"
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[dict] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# GDPR Export Response Model
class GDPRExportResponse(BaseModel):
    user_profile: dict
    generated_prompts: List[dict]
    token_transactions: List[dict]
    audit_logs: List[dict]
    export_date: str
    gdpr_notice: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health_check(request: Request):
    """Health check endpoint for debugging deployment issues"""
    return {
        "status": "healthy",
        "backend": "Omega Aurora Codex API",
        "version": "1.0.0",
        "origin": request.headers.get("origin"),
        "user_agent": request.headers.get("user-agent"),
        "cors_configured": True
    }

# Authentication Helper Functions
def create_jwt_token(user_id: str, email: Optional[str], is_admin: bool, is_demo: bool = False, demo_expires_at: Optional[datetime] = None) -> str:
    """Create JWT token for authenticated user"""
    payload = {
        "user_id": user_id,
        "email": email,
        "is_admin": is_admin,
        "is_demo": is_demo,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS)
    }
    if demo_expires_at:
        payload["demo_expires_at"] = demo_expires_at.isoformat()
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_user(request: Request) -> Optional[dict]:
    """Get current user from JWT token (cookie or header)"""
    # Try cookie first
    token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        return None
    
    payload = verify_jwt_token(token)
    if not payload:
        return None
    
    # Get user from database
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        return None
    
    return user

async def require_auth(request: Request) -> dict:
    """Require authentication, raise 401 if not authenticated"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_tokens(user: dict, required_tokens: int) -> bool:
    """Check if user has enough tokens (including debt limit)"""
    if user.get("is_admin"):
        return True  # Admin has unlimited tokens
    
    current_balance = user.get("omega_tokens_balance", 0)
    if current_balance - required_tokens < TOKEN_LIMIT_MIN:
        raise HTTPException(
            status_code=402, 
            detail=f"Insufficient Omega tokens. Current balance: {current_balance}, Required: {required_tokens}, Minimum allowed: {TOKEN_LIMIT_MIN}"
        )
    return True

async def deduct_tokens(user_id: str, tokens_used: int, description: str, openai_tokens: Optional[int] = None):
    """Deduct tokens from user balance and create transaction record"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        return
    
    new_balance = user["omega_tokens_balance"] - tokens_used
    
    # Update user balance
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"omega_tokens_balance": new_balance}}
    )
    
    # Create transaction record
    transaction = TokenTransaction(
        user_id=user_id,
        amount=-tokens_used,
        balance_after=new_balance,
        transaction_type="usage",
        description=description,
        openai_tokens_used=openai_tokens
    )
    
    doc = transaction.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.token_transactions.insert_one(doc)

# Authentication Endpoints
@api_router.post("/auth/admin/login", response_model=AuthResponse)
async def admin_login(credentials: AdminLoginRequest, response: Response):
    """Admin login with username and password"""
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check password against environment variable
    if credentials.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if admin user exists, create if not
    admin_user = await db.users.find_one({"email": "admin@omegacodex.local"}, {"_id": 0})
    
    if not admin_user:
        admin = User(
            email="admin@omegacodex.local",
            name="Admin",
            is_admin=True,
            is_banned=False,
            omega_tokens_balance=999999999  # Unlimited for admin
        )
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['last_login'] = doc['last_login'].isoformat()
        doc['last_login_at'] = doc['last_login_at'].isoformat()
        await db.users.insert_one(doc)
        admin_user = admin.model_dump()
    else:
        # Update last login
        now_iso = datetime.now(timezone.utc).isoformat()
        await db.users.update_one(
            {"email": "admin@omegacodex.local"},
            {"$set": {"last_login": now_iso, "last_login_at": now_iso}}
        )
    
    # Create JWT token
    token = create_jwt_token(admin_user["id"], admin_user["email"], True)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=JWT_EXPIRATION_DAYS * 24 * 60 * 60,
        path="/"
    )
    
    return AuthResponse(
        user={
            "id": admin_user["id"],
            "email": admin_user["email"],
            "name": admin_user["name"],
            "picture": admin_user.get("picture"),
            "is_admin": True
        },
        token=token,
        omega_tokens_balance=admin_user["omega_tokens_balance"]
    )

@api_router.post("/auth/google/session")
async def process_google_session(session_data: SessionDataRequest, response: Response):
    """
    Process Emergent Auth session_id. 
    Creates shadow account immediately - user can explore app but generator is locked.
    Phone verification unlocks generator and finalizes registration.
    """
    try:
        # Call Emergent Auth API
        auth_api_url = os.environ.get('EMERGENT_AUTH_API_URL', 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data')
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                auth_api_url,
                headers={"X-Session-ID": session_data.session_id},
                timeout=10.0
            )
            auth_response.raise_for_status()
            user_data = auth_response.json()
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
        
        if existing_user:
            # Existing user - check ban status
            if existing_user.get("is_banned", False):
                raise HTTPException(status_code=403, detail="Váš účet byl zablokován administrátorem")
            
            # Update last login
            now_iso = datetime.now(timezone.utc).isoformat()
            await db.users.update_one(
                {"email": user_data["email"]},
                {"$set": {"last_login": now_iso, "last_login_at": now_iso}}
            )
            user_doc = existing_user
        else:
            # NEW USER: Create shadow account immediately
            # Generate unique referral code
            referral_code = generate_referral_code()
            while await db.users.find_one({"referral_code": referral_code}):
                referral_code = generate_referral_code()
            
            # Check for referral code (from URL or stored session)
            referred_by_code = None
            # TODO: Get from URL params or session storage
            
            referred_by_user_id = None
            if referred_by_code:
                referrer = await db.users.find_one({"referral_code": referred_by_code}, {"_id": 0})
                if referrer:
                    referred_by_user_id = referrer["id"]
            
            # Create shadow account (phone_verified=False)
            new_user = User(
                email=user_data["email"],
                name=user_data["name"],
                picture=user_data.get("picture"),
                is_admin=False,
                is_banned=False,
                phone_number=None,
                phone_verified=False,  # SHADOW ACCOUNT - not fully registered
                referral_code=referral_code,
                referred_by=referred_by_user_id,  # Track referrer from start
                referral_count=0,
                omega_tokens_balance=INITIAL_TOKENS
            )
            
            doc = new_user.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            doc['last_login'] = doc['last_login'].isoformat()
            doc['last_login_at'] = doc['last_login_at'].isoformat()
            if doc.get('phone_verification_expires'):
                doc['phone_verification_expires'] = doc['phone_verification_expires'].isoformat()
            
            await db.users.insert_one(doc)
            user_doc = new_user.model_dump()
            
            # Create initial token transaction (pending verification)
            transaction = TokenTransaction(
                user_id=user_doc["id"],
                amount=INITIAL_TOKENS,
                balance_after=INITIAL_TOKENS,
                transaction_type="initial",
                description="Initial token grant (pending phone verification)"
            )
            trans_doc = transaction.model_dump()
            trans_doc['created_at'] = trans_doc['created_at'].isoformat()
            await db.token_transactions.insert_one(trans_doc)
        
        # Create JWT token for shadow account too
        token = create_jwt_token(user_doc["id"], user_doc["email"], user_doc.get("is_admin", False))
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=JWT_EXPIRATION_DAYS * 24 * 60 * 60,
            path="/"
        )
        
        return {
            "status": "success",
            "user": {
                "id": user_doc["id"],
                "email": user_doc["email"],
                "name": user_doc["name"],
                "picture": user_doc.get("picture"),
                "is_admin": user_doc.get("is_admin", False),
                "phone_verified": user_doc.get("phone_verified", False)
            },
            "token": token,
            "omega_tokens_balance": user_doc["omega_tokens_balance"]
        }
        
    except httpx.HTTPError as e:
        logger.error(f"Error calling Emergent Auth API: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid session ID")
    except Exception as e:
        logger.error(f"Error processing session: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/auth/me", response_model=UserProfileResponse)
async def get_current_user_profile(request: Request):
    """Get current authenticated user profile"""
    user = await require_auth(request)
    
    # Log GDPR audit trail
    await log_audit(
        user_id=user["id"],
        action="access",
        resource_type="user_profile",
        request=request,
        resource_id=user["id"]
    )
    
    demo_expires_iso = None
    if user.get("demo_expires_at"):
        if isinstance(user["demo_expires_at"], str):
            demo_expires_iso = user["demo_expires_at"]
        else:
            demo_expires_iso = user["demo_expires_at"].isoformat()
    
    return UserProfileResponse(
        id=user["id"],
        email=user.get("email"),
        name=user.get("name"),
        picture=user.get("picture"),
        is_admin=user.get("is_admin", False),
        is_banned=user.get("is_banned", False),
        is_demo=user.get("is_demo", False),
        demo_expires_at=demo_expires_iso,
        omega_tokens_balance=user["omega_tokens_balance"],
        locked_price_99=user.get("locked_price_99"),
        locked_price_399=user.get("locked_price_399"),
        phone_number=user.get("phone_number"),
        phone_verified=user.get("phone_verified", False),
        referral_code=user.get("referral_code"),
        referral_count=user.get("referral_count", 0)
    )

@api_router.post("/auth/logout")
async def logout(response: Response):
    """Logout user by clearing session cookie"""
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# Demo Account Endpoints
@api_router.post("/demo/activate", response_model=AuthResponse)
async def activate_demo_account(activation: DemoActivationRequest, request: Request, response: Response):
    """
    Activate demo account with QR token.
    Creates anonymous demo account with 100k tokens, 72h expiry.
    """
    # Find activation token
    token_doc = await db.demo_activation_tokens.find_one({"token": activation.token}, {"_id": 0})
    
    if not token_doc:
        raise HTTPException(status_code=404, detail="Invalid activation token")
    
    if token_doc["status"] != "active":
        raise HTTPException(status_code=400, detail=f"Token is {token_doc['status']}")
    
    # Check max activations
    if token_doc.get("max_activations") is not None:
        if token_doc["activations_count"] >= token_doc["max_activations"]:
            raise HTTPException(status_code=400, detail="Maximum activations reached for this token")
    
    # Create demo user
    demo_expires_at = datetime.now(timezone.utc) + timedelta(hours=72)
    
    demo_user = User(
        email=None,
        name=f"Demo User {str(uuid.uuid4())[:8]}",
        is_demo=True,
        demo_expires_at=demo_expires_at,
        demo_activation_token=activation.token,
        phone_verified=False,
        omega_tokens_balance=100000,  # 100k tokens for demo
        referral_code=None,  # Demo accounts don't get referral codes initially
        referred_by=activation.ref if activation.ref else None
    )
    
    doc = demo_user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['last_login'] = doc['last_login'].isoformat()
    doc['last_login_at'] = doc['last_login_at'].isoformat()
    doc['demo_expires_at'] = doc['demo_expires_at'].isoformat()
    
    await db.users.insert_one(doc)
    
    # Create initial token transaction
    transaction = TokenTransaction(
        user_id=demo_user.id,
        amount=100000,
        balance_after=100000,
        transaction_type="initial",
        description="Demo account activation (72h, 100k tokens)"
    )
    trans_doc = transaction.model_dump()
    trans_doc['created_at'] = trans_doc['created_at'].isoformat()
    await db.token_transactions.insert_one(trans_doc)
    
    # Increment activation count
    await db.demo_activation_tokens.update_one(
        {"token": activation.token},
        {"$inc": {"activations_count": 1}}
    )
    
    # Log audit trail
    client_ip = request.client.host if request.client else "unknown"
    await db.audit_logs.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": demo_user.id,
        "action": "demo_activation",
        "resource_type": "demo_account",
        "resource_id": demo_user.id,
        "ip_address": client_ip,
        "user_agent": request.headers.get("user-agent", "unknown"),
        "metadata": {
            "token": activation.token,
            "ref": activation.ref
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    # Create JWT token
    token = create_jwt_token(demo_user.id, None, False, True, demo_expires_at)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=72 * 60 * 60,  # 72 hours
        path="/"
    )
    
    return AuthResponse(
        user={
            "id": demo_user.id,
            "email": None,
            "name": demo_user.name,
            "picture": None,
            "is_admin": False,
            "is_demo": True,
            "demo_expires_at": demo_expires_at.isoformat()
        },
        token=token,
        omega_tokens_balance=100000
    )

@api_router.post("/feedback")
async def submit_feedback(feedback_req: FeedbackRequest, request: Request):
    """Submit feedback (demo or full account users)"""
    user = await require_auth(request)
    
    feedback = Feedback(
        user_id=user["id"],
        rating=feedback_req.rating,
        comment=feedback_req.comment,
        keywords=feedback_req.keywords
    )
    
    doc = feedback.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.feedback.insert_one(doc)
    
    # Log audit trail
    await log_audit(
        user_id=user["id"],
        action="submit",
        resource_type="feedback",
        request=request,
        resource_id=feedback.id,
        metadata={"rating": feedback_req.rating}
    )
    
    return {"success": True, "message": "Feedback submitted successfully"}

@api_router.post("/auth/google/upgrade")
async def upgrade_demo_to_google(session_data: SessionDataRequest, request: Request, response: Response):
    """
    Upgrade demo account to full Google OAuth account.
    Preserves tokens_balance and generated prompts history.
    """
    user = await require_auth(request)
    
    if not user.get("is_demo"):
        raise HTTPException(status_code=400, detail="Only demo accounts can be upgraded")
    
    # Call Emergent Auth API
    auth_api_url = os.environ.get('EMERGENT_AUTH_API_URL', 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data')
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            auth_api_url,
            headers={"X-Session-ID": session_data.session_id},
            timeout=10.0
        )
        auth_response.raise_for_status()
        google_data = auth_response.json()
    
    # Check if email already exists (excluding current demo account)
    existing = await db.users.find_one({
        "email": google_data["email"],
        "id": {"$ne": user["id"]}
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=400, detail="This email is already associated with another account")
    
    # Generate referral code for newly upgraded account
    referral_code = f"OMEGA-{str(uuid.uuid4())[:6].upper()}"
    
    # Update demo account to full account
    update_data = {
        "is_demo": False,
        "demo_expires_at": None,
        "email": google_data["email"],
        "name": google_data.get("name", user.get("name")),
        "picture": google_data.get("picture"),
        "google_id": google_data.get("sub"),
        "referral_code": referral_code,
        "last_login": datetime.now(timezone.utc).isoformat(),
        "last_login_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    
    # Log audit trail
    await log_audit(
        user_id=user["id"],
        action="upgrade",
        resource_type="account",
        request=request,
        resource_id=user["id"],
        metadata={
            "from": "demo",
            "to": "google_oauth",
            "email": google_data["email"]
        }
    )
    
    # Create new JWT token (non-demo)
    token = create_jwt_token(updated_user["id"], updated_user["email"], False, False, None)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=JWT_EXPIRATION_DAYS * 24 * 60 * 60,
        path="/"
    )
    
    return AuthResponse(
        user={
            "id": updated_user["id"],
            "email": updated_user["email"],
            "name": updated_user["name"],
            "picture": updated_user.get("picture"),
            "is_admin": False,
            "is_demo": False
        },
        token=token,
        omega_tokens_balance=updated_user["omega_tokens_balance"]
    )

# Admin QR Token Management
@api_router.post("/admin/qr-tokens")
async def create_qr_token(token_req: CreateQRTokenRequest, request: Request):
    """Admin: Create new QR activation token"""
    user = await require_auth(request)
    
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Generate unique token
    token_str = f"OMEGA-{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
    
    qr_token = DemoActivationToken(
        token=token_str,
        label=token_req.label,
        created_by=user["id"],
        max_activations=token_req.max_activations,
        notes=token_req.notes,
        activations_count=0,
        status="active"
    )
    
    doc = qr_token.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.demo_activation_tokens.insert_one(doc)
    
    # Log audit trail
    await log_audit(
        user_id=user["id"],
        action="create",
        resource_type="qr_token",
        request=request,
        resource_id=qr_token.id,
        metadata={"token": token_str, "label": token_req.label}
    )
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://omega-aurora.info')
    activation_link = f"{frontend_url}/demo/activate/{token_str}"
    
    return {
        "id": qr_token.id,
        "token": token_str,
        "label": token_req.label,
        "activation_link": activation_link,
        "qr_code_url": f"/api/admin/qr-tokens/{qr_token.id}/export",
        "max_activations": token_req.max_activations,
        "activations_count": 0,
        "status": "active",
        "created_at": doc['created_at']
    }

@api_router.get("/admin/qr-tokens")
async def list_qr_tokens(request: Request):
    """Admin: List all QR activation tokens"""
    user = await require_auth(request)
    
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    tokens = await db.demo_activation_tokens.find({}, {"_id": 0}).sort("created_at", -1).to_list(length=1000)
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://omega-aurora.info')
    
    for token in tokens:
        token["activation_link"] = f"{frontend_url}/demo/activate/{token['token']}"
        token["qr_code_url"] = f"/api/admin/qr-tokens/{token['id']}/export"
    
    return {"tokens": tokens}

@api_router.put("/admin/qr-tokens/{token_id}")
async def update_qr_token(token_id: str, update_req: UpdateQRTokenRequest, request: Request):
    """Admin: Update QR token status (enable/disable)"""
    user = await require_auth(request)
    
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.demo_activation_tokens.update_one(
        {"id": token_id},
        {"$set": {"status": update_req.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Token not found")
    
    # Log audit trail
    await log_audit(
        user_id=user["id"],
        action="update",
        resource_type="qr_token",
        request=request,
        resource_id=token_id,
        metadata={"status": update_req.status}
    )
    
    return {"success": True, "message": f"Token status updated to {update_req.status}"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Omega Agent Generator Endpoint
@api_router.post("/generate", response_model=GenerateResponse)
async def generate_omega_prompt(request: GenerateRequest, http_request: Request):
    """
    Generate Omega prompts through three stages:
    1. clarify: Ask clarifying questions about business use case
    2. optimize: Provide optimization suggestions and pattern recommendations
    3. final: Assemble complete Omega prompt in markdown format
    
    Requires authentication. Deducts Omega tokens based on OpenAI API usage.
    """
    # Require authentication
    user = await require_auth(http_request)
    
    # Check demo expiry
    if user.get("is_demo"):
        if user.get("demo_expires_at"):
            expiry_time = user["demo_expires_at"]
            if isinstance(expiry_time, str):
                expiry_time = datetime.fromisoformat(expiry_time)
            
            if datetime.now(timezone.utc) >= expiry_time:
                raise HTTPException(
                    status_code=401, 
                    detail="demo_expired",
                    headers={"X-Error-Type": "demo_expired"}
                )
    
    # Check phone verification for non-demo, non-admin users
    if not user.get("is_demo") and not user.get("is_admin"):
        if not user.get("phone_verified", False):
            raise HTTPException(
                status_code=403, 
                detail="phone_verification_required",
                headers={"X-Error-Type": "phone_verification_required"}
            )
    
    # Check if user is banned
    if user.get("is_banned", False):
        raise HTTPException(status_code=403, detail="Váš účet byl zablokován administrátorem")
    
    try:
        # Validate input length
        if len(request.user_input) > 4000:
            raise HTTPException(status_code=400, detail="Input too long (max 4000 characters)")
        
        if len(request.messages) > 20:
            raise HTTPException(status_code=400, detail="Too many messages (max 20)")
        
        # Estimate tokens needed (rough estimate before API call)
        estimated_tokens = 2000  # Average per stage
        await require_tokens(user, estimated_tokens)
        
        # Create chat instance with appropriate model and temperature
        session_id = request.session_id or str(uuid.uuid4())
        
        # Stage-specific configurations
        temperatures = {
            OmegaStage.clarify: 0.2,
            OmegaStage.optimize: 0.3,
            OmegaStage.final: 0.4
        }
        
        # Build conversation history
        conversation = []
        for msg in request.messages[-10:]:  # Last 10 messages for context
            conversation.append(f"{msg.role}: {msg.content}")
        
        conversation_context = "\n".join(conversation) if conversation else "No previous conversation"
        
        # Stage 1: Clarify - Ask clarifying questions
        if request.stage == OmegaStage.clarify:
            system_message = request.master_prompt or """You are a business analyst helping to understand a use case for AI prompt engineering. 
            
Your task: Ask 3-6 clarifying questions to deeply understand:
- The business context and goals
- Target audience and use cases
- Key constraints and requirements
- Success metrics and expected outcomes
- Technical environment and integration needs

Return ONLY a JSON array of questions, no other text. Format: ["Question 1?", "Question 2?", "Question 3?"]"""
            
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4.1")
            
            user_message = UserMessage(
                text=f"Business Use Case: {request.user_input}\n\nConversation Context:\n{conversation_context}"
            )
            
            try:
                # Add timeout
                response = await asyncio.wait_for(
                    chat.send_message(user_message),
                    timeout=30.0
                )
                
                # Parse questions from response
                import json
                import re
                
                # Try to extract JSON array from response
                response_text = response.strip()
                
                # Look for JSON array pattern
                json_match = re.search(r'\[[\s\S]*\]', response_text)
                if json_match:
                    questions_json = json_match.group(0)
                    questions = json.loads(questions_json)
                else:
                    # Fallback: split by newlines and filter
                    lines = [line.strip() for line in response_text.split('\n') if line.strip()]
                    questions = [line for line in lines if line.endswith('?')][:6]
                
                # Deduct tokens based on response length (approximate OpenAI token count)
                tokens_used = len(response_text) // 4  # Rough estimate: 1 token ≈ 4 characters
                await deduct_tokens(
                    user["id"], 
                    tokens_used, 
                    f"Clarify stage - Session {session_id}",
                    tokens_used
                )
                
                return GenerateResponse(
                    stage=OmegaStage.clarify,
                    questions=questions,
                    usage={"tokens": tokens_used}
                )
                
            except asyncio.TimeoutError:
                raise HTTPException(status_code=504, detail="Request timeout - please try again")
        
        # Stage 2: Optimize - Provide suggestions and pattern recommendations
        elif request.stage == OmegaStage.optimize:
            system_message = request.master_prompt or """You are an AI prompt engineering expert specializing in the Omega framework.

Based on the business context and clarifying answers provided, analyze and suggest:
1. 3-5 specific optimizations for prompt structure
2. Recommended pattern (CustomerSupport, LeadQualification, ContentPlanning, or MarketResearch)
3. Key considerations for implementation

Return ONLY a JSON array of suggestion strings, no other text. Format: ["Suggestion 1", "Suggestion 2", "Pattern: CustomerSupport"]"""
            
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4.1")
            
            user_message = UserMessage(
                text=f"Business Use Case: {request.user_input}\n\nConversation Context:\n{conversation_context}\n\nProvide optimization suggestions and pattern recommendation."
            )
            
            try:
                response = await asyncio.wait_for(
                    chat.send_message(user_message),
                    timeout=30.0
                )
                
                # Parse suggestions from response
                import json
                import re
                
                response_text = response.strip()
                
                # Look for JSON array pattern
                json_match = re.search(r'\[[\s\S]*\]', response_text)
                if json_match:
                    suggestions_json = json_match.group(0)
                    suggestions = json.loads(suggestions_json)
                else:
                    # Fallback: split by newlines
                    lines = [line.strip() for line in response_text.split('\n') if line.strip()]
                    suggestions = [line.lstrip('- •*').strip() for line in lines if line][:5]
                
                # Deduct tokens
                tokens_used = len(response_text) // 4
                await deduct_tokens(
                    user["id"], 
                    tokens_used, 
                    f"Optimize stage - Session {session_id}",
                    tokens_used
                )
                
                return GenerateResponse(
                    stage=OmegaStage.optimize,
                    suggestions=suggestions,
                    usage={"tokens": tokens_used}
                )
                
            except asyncio.TimeoutError:
                raise HTTPException(status_code=504, detail="Request timeout - please try again")
        
        # Stage 3: Final - Assemble complete Omega prompt
        elif request.stage == OmegaStage.final:
            system_message = request.master_prompt or """You are an Omega prompt architect. Assemble a complete, production-ready prompt using the Ω framework.

Structure your response as a well-formatted markdown document with these sections:

# Omega Prompt: [Use Case Title]

## 1. Context & Purpose
Define the core objective and business context.

## 2. Role & Persona
Specify the AI's role, expertise, and communication style.

## 3. Constraints & Rules
List what the AI must do, must not do, and guardrails.

## 4. Output Format
Describe the expected structure and format of responses.

## 5. Evaluation Checklist
Provide criteria to assess prompt effectiveness.

## 6. Example Interaction
Show a sample input-output pair.

Make it comprehensive, actionable, and ready to use."""
            
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4.1")
            
            pattern_context = f"\nRecommended Pattern: {request.pattern}" if request.pattern else ""
            
            user_message = UserMessage(
                text=f"Business Use Case: {request.user_input}{pattern_context}\n\nConversation Context:\n{conversation_context}\n\nGenerate the complete Omega prompt in markdown format."
            )
            
            try:
                response = await asyncio.wait_for(
                    chat.send_message(user_message),
                    timeout=40.0
                )
                
                # Deduct tokens
                tokens_used = len(response) // 4
                await deduct_tokens(
                    user["id"], 
                    tokens_used, 
                    f"Final stage - Session {session_id}",
                    tokens_used
                )
                
                return GenerateResponse(
                    stage=OmegaStage.final,
                    prompt_markdown=response,
                    usage={"tokens": tokens_used}
                )
                
            except asyncio.TimeoutError:
                raise HTTPException(status_code=504, detail="Request timeout - please try again")
        
        else:
            raise HTTPException(status_code=400, detail=f"Invalid stage: {request.stage}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in /api/generate: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Generated Prompt History Endpoints
@api_router.post("/prompts", response_model=GeneratedPromptResponse)
async def create_generated_prompt(request: GeneratedPromptCreate, http_request: Request):
    """
    Create a new generated prompt entry with auto-generated name and description.
    Uses GPT-4.1 to generate both the name and the 3-part description.
    Requires authentication.
    """
    # Require authentication to get user_id
    user = await require_auth(http_request)
    
    try:
        # Generate agent name using GPT-4.1
        name_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="You are an AI that generates concise, professional agent names (2-4 words max). Respond with ONLY the name, no explanation."
        ).with_model("openai", "gpt-4.1")
        
        name_message = UserMessage(
            text=f"Based on this conversation context, generate a short agent name:\n\n{request.conversation_context[:1000]}"
        )
        
        agent_name = await asyncio.wait_for(
            name_chat.send_message(name_message),
            timeout=15.0
        )
        agent_name = agent_name.strip().strip('"').strip("'")
        
        # Generate agent description (3 characteristics) using GPT-4.1
        desc_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="""Generate a 3-part agent description in JSON format with these exact keys:
- "general_function": One sentence describing the main purpose (Czech: Obecná funkce)
- "specialization": One sentence describing specific expertise (Czech: Specializace)  
- "output": One sentence describing what the agent produces (Czech: Výstup)

Respond with ONLY valid JSON, no markdown formatting."""
        ).with_model("openai", "gpt-4.1")
        
        desc_message = UserMessage(
            text=f"Based on this conversation and master prompt, generate the 3-part description:\n\nConversation:\n{request.conversation_context[:800]}\n\nMaster Prompt:\n{request.master_prompt[:500]}"
        )
        
        description_json = await asyncio.wait_for(
            desc_chat.send_message(desc_message),
            timeout=20.0
        )
        
        # Parse JSON response
        import json
        description_json = description_json.strip()
        if description_json.startswith("```json"):
            description_json = description_json.split("```json")[1].split("```")[0].strip()
        elif description_json.startswith("```"):
            description_json = description_json.split("```")[1].split("```")[0].strip()
            
        description_data = json.loads(description_json)
        
        # Create prompt object
        prompt = GeneratedPrompt(
            user_id=user["id"],  # Link prompt to authenticated user
            name=agent_name,
            description=AgentCharacteristics(**description_data),
            master_prompt=request.master_prompt,
            conversation_summary=request.conversation_context[:200] + "..." if len(request.conversation_context) > 200 else request.conversation_context
        )
        
        # Save to MongoDB
        doc = prompt.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['description'] = {
            'general_function': doc['description'].general_function,
            'specialization': doc['description'].specialization,
            'output': doc['description'].output
        }
        
        await db.generated_prompts.insert_one(doc)
        
        return GeneratedPromptResponse(
            id=prompt.id,
            name=prompt.name,
            description=prompt.description,
            master_prompt=prompt.master_prompt,
            conversation_summary=prompt.conversation_summary,
            created_at=prompt.created_at
        )
        
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Timeout generating prompt metadata")
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {str(e)}, response: {description_json}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        logger.error(f"Error creating prompt: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/prompts", response_model=List[GeneratedPromptResponse])
async def get_generated_prompts():
    """
    Get all generated prompts, sorted by creation date (newest first).
    """
    try:
        prompts = await db.generated_prompts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        
        # Convert ISO string timestamps back to datetime objects
        for prompt in prompts:
            if isinstance(prompt['created_at'], str):
                prompt['created_at'] = datetime.fromisoformat(prompt['created_at'])
            
            # Convert description dict to AgentCharacteristics
            if isinstance(prompt['description'], dict):
                prompt['description'] = AgentCharacteristics(**prompt['description'])
        
        return prompts
        
    except Exception as e:
        logger.error(f"Error fetching prompts: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/prompts/{prompt_id}", response_model=GeneratedPromptResponse)
async def get_generated_prompt(prompt_id: str):
    """
    Get a single generated prompt by ID.
    """
    try:
        prompt = await db.generated_prompts.find_one({"id": prompt_id}, {"_id": 0})
        
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        
        # Convert ISO string timestamp back to datetime
        if isinstance(prompt['created_at'], str):
            prompt['created_at'] = datetime.fromisoformat(prompt['created_at'])
        
        # Convert description dict to AgentCharacteristics
        if isinstance(prompt['description'], dict):
            prompt['description'] = AgentCharacteristics(**prompt['description'])
        
        return prompt
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching prompt: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.patch("/prompts/{prompt_id}", response_model=GeneratedPromptResponse)
async def update_generated_prompt(prompt_id: str, update: GeneratedPromptUpdate):
    """
    Update the name of a generated prompt.
    """
    try:
        result = await db.generated_prompts.update_one(
            {"id": prompt_id},
            {"$set": {"name": update.name}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Prompt not found")
        
        # Fetch and return updated prompt
        prompt = await db.generated_prompts.find_one({"id": prompt_id}, {"_id": 0})
        
        # Convert ISO string timestamp back to datetime
        if isinstance(prompt['created_at'], str):
            prompt['created_at'] = datetime.fromisoformat(prompt['created_at'])
        
        # Convert description dict to AgentCharacteristics
        if isinstance(prompt['description'], dict):
            prompt['description'] = AgentCharacteristics(**prompt['description'])
        
        return prompt
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating prompt: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# Admin Helper Functions
async def require_admin(request: Request) -> dict:
    """Require admin authentication, raise 403 if not admin"""
    user = await require_auth(request)
    if not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# GDPR Audit Logging Function
async def log_audit(
    user_id: str,
    action: str,
    resource_type: str,
    request: Request,
    resource_id: Optional[str] = None,
    details: Optional[dict] = None
):
    """Log GDPR-relevant actions for audit trail"""
    try:
        audit_entry = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details=details
        )
        
        doc = audit_entry.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.audit_logs.insert_one(doc)
        
        logger.info(f"Audit log: user={user_id}, action={action}, resource={resource_type}")
    except Exception as e:
        logger.error(f"Failed to log audit entry: {str(e)}", exc_info=True)
        # Don't fail the request if audit logging fails

# Phone Verification & Referral Helper Functions
def generate_referral_code() -> str:
    """Generate unique referral code (e.g., OMEGA-ABC123)"""
    import random
    import string
    chars = string.ascii_uppercase + string.digits
    code = ''.join(random.choice(chars) for _ in range(6))
    return f"OMEGA-{code}"

def generate_phone_verification_code() -> str:
    """Generate 6-digit verification code"""
    import random
    return str(random.randint(100000, 999999))

async def send_sms_verification(phone_number: str, code: str) -> bool:
    """
    Send SMS verification code via configured provider.
    Supports: AWS SNS, SMSmanager.cz
    Falls back to MOCK mode if SMS not enabled.
    """
    try:
        # Get SMS settings
        settings = await db.settings.find_one({"id": "global"}, {"_id": 0})
        
        if not settings or not settings.get("sms_enabled", False):
            # MOCK mode
            logger.info(f"[MOCK SMS] Sending verification code {code} to {phone_number}")
            return True
        
        # Get provider
        provider = settings.get("sms_provider", "aws_sns")
        
        if provider == "aws_sns":
            return await send_sms_aws_sns(phone_number, code, settings)
        elif provider == "smsmanager":
            return await send_sms_smsmanager(phone_number, code, settings)
        else:
            logger.error(f"Unknown SMS provider: {provider}")
            return False
            
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}", exc_info=True)
        return False

async def send_sms_aws_sns(phone_number: str, code: str, settings: dict) -> bool:
    """Send SMS via AWS SNS"""
    aws_access_key = settings.get("aws_access_key_id")
    aws_secret_key = settings.get("aws_secret_access_key")
    aws_region = settings.get("aws_region", "eu-central-1")
    
    if not aws_access_key or not aws_secret_key:
        logger.error("AWS SNS selected but credentials not configured")
        return False
    
    try:
        import boto3
    except ImportError:
        logger.error("boto3 not installed. Run: pip install boto3")
        return False
    
    try:
        # Create SNS client
        sns_client = boto3.client(
            'sns',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=aws_region
        )
        
        # Send SMS
        message = f"Váš ověřovací kód pro Omega-Aurora Codex je: {code}\n\nKód je platný 10 minut."
        
        response = sns_client.publish(
            PhoneNumber=phone_number,
            Message=message,
            MessageAttributes={
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'OmegaCodex'
                },
                'AWS.SNS.SMS.SMSType': {
                    'DataType': 'String',
                    'StringValue': 'Transactional'
                }
            }
        )
        
        logger.info(f"[AWS SNS] SMS sent to {phone_number}, MessageId: {response.get('MessageId')}")
        return True
        
    except Exception as e:
        logger.error(f"AWS SNS error: {str(e)}", exc_info=True)
        return False

async def send_sms_smsmanager(phone_number: str, code: str, settings: dict) -> bool:
    """Send SMS via SMSmanager.cz"""
    api_key = settings.get("smsmanager_api_key")
    gateway = settings.get("smsmanager_gateway")
    
    if not api_key:
        logger.error("SMSmanager.cz selected but API key not configured")
        return False
    
    try:
        # SMSmanager.cz API endpoint
        url = "https://http-api.smsmanager.cz/Send"
        
        # Prepare message
        message = f"Váš ověřovací kód pro Omega-Aurora Codex je: {code}\n\nKód je platný 10 minut."
        
        # Remove +420 prefix for SMSmanager (expects 9 digits)
        recipient = phone_number.replace("+420", "")
        
        # Prepare request
        params = {
            "apikey": api_key,
            "message": message,
            "recipients": recipient,
            "gateway": gateway if gateway else None
        }
        
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        # Send request
        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=params, timeout=10.0)
            response.raise_for_status()
            
        logger.info(f"[SMSmanager.cz] SMS sent to {phone_number}, Response: {response.text}")
        return True
        
    except Exception as e:
        logger.error(f"SMSmanager.cz error: {str(e)}", exc_info=True)
        return False

def validate_czech_phone(phone_number: str) -> bool:
    """Validate Czech phone number format (+420XXXXXXXXX)"""
    import re
    # Czech numbers: +420 followed by 9 digits
    pattern = r'^\+420[1-9][0-9]{8}$'
    return bool(re.match(pattern, phone_number))

# Admin Endpoints
@api_router.get("/admin/overview", response_model=AdminOverviewResponse)
async def get_admin_overview(request: Request):
    """
    Get admin dashboard overview with analytics and metrics.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        # Get all users
        users = await db.users.find({}, {"_id": 0}).to_list(10000)
        total_users = len(users)
        
        # Calculate revenue (estimate based on locked prices)
        total_revenue = sum(
            (user.get("locked_price_99", 0) or 0) + 
            (user.get("locked_price_399", 0) or 0) 
            for user in users
        )
        
        # Activity metrics
        now = datetime.now(timezone.utc)
        active_24h = sum(
            1 for user in users 
            if user.get("last_login_at") and 
            datetime.fromisoformat(user["last_login_at"]) >= now - timedelta(hours=24)
        )
        active_7d = sum(
            1 for user in users 
            if user.get("last_login_at") and 
            datetime.fromisoformat(user["last_login_at"]) >= now - timedelta(days=7)
        )
        
        # Token consumption analytics
        transactions = await db.token_transactions.find(
            {"transaction_type": "usage"},
            {"_id": 0}
        ).to_list(10000)
        
        # Calculate avg tokens per agent
        usage_transactions = [t for t in transactions if t.get("openai_tokens_used")]
        avg_tokens_per_agent = (
            sum(t["openai_tokens_used"] for t in usage_transactions) / len(usage_transactions)
            if usage_transactions else 0
        )
        
        # Find min/max consumption
        min_consumption = None
        max_consumption = None
        if usage_transactions:
            min_trans = min(usage_transactions, key=lambda t: t["openai_tokens_used"])
            max_trans = max(usage_transactions, key=lambda t: t["openai_tokens_used"])
            
            # Get user names
            min_user = await db.users.find_one({"id": min_trans["user_id"]}, {"_id": 0, "name": 1, "email": 1})
            max_user = await db.users.find_one({"id": max_trans["user_id"]}, {"_id": 0, "name": 1, "email": 1})
            
            min_consumption = {
                "tokens": min_trans["openai_tokens_used"],
                "user_name": min_user["name"] if min_user else "Unknown",
                "user_email": min_user["email"] if min_user else "Unknown",
                "agent_name": min_trans.get("description", "N/A")
            }
            max_consumption = {
                "tokens": max_trans["openai_tokens_used"],
                "user_name": max_user["name"] if max_user else "Unknown",
                "user_email": max_user["email"] if max_user else "Unknown",
                "agent_name": max_trans.get("description", "N/A")
            }
        
        # Token history by day (last 30 days)
        from collections import defaultdict
        token_by_day = defaultdict(int)
        for trans in usage_transactions:
            if trans.get("created_at"):
                day = datetime.fromisoformat(trans["created_at"]).date().isoformat()
                token_by_day[day] += trans["openai_tokens_used"]
        
        # Convert to sorted list
        token_history = [
            {"day": day, "tokens": tokens}
            for day, tokens in sorted(token_by_day.items())[-30:]
        ]
        
        return AdminOverviewResponse(
            total_revenue=total_revenue,
            total_users=total_users,
            active_users_24h=active_24h,
            active_users_7d=active_7d,
            avg_tokens_per_agent=round(avg_tokens_per_agent, 2),
            min_consumption=min_consumption,
            max_consumption=max_consumption,
            token_history=token_history
        )
        
    except Exception as e:
        logger.error(f"Error getting admin overview: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/admin/users")
async def get_admin_users(
    request: Request,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_dir: Optional[str] = "desc"
):
    """
    Get list of all users with computed metrics for admin management.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        # Get all users
        query = {}
        if search:
            query = {
                "$or": [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"email": {"$regex": search, "$options": "i"}}
                ]
            }
        
        users = await db.users.find(query, {"_id": 0}).to_list(10000)
        
        # Sort by created_at to assign sequence IDs
        users_sorted_by_registration = sorted(
            users, 
            key=lambda x: datetime.fromisoformat(x["created_at"]) if isinstance(x["created_at"], str) else x["created_at"]
        )
        
        # Assign sequence IDs (admin is always 1, then 2, 3, 4...)
        sequence_map = {}
        next_non_admin_id = 2
        
        # First pass: assign 1 to admin
        for user in users_sorted_by_registration:
            if user.get("is_admin"):
                sequence_map[user["id"]] = 1
        
        # Second pass: assign sequential IDs to non-admins
        for user in users_sorted_by_registration:
            if not user.get("is_admin"):
                sequence_map[user["id"]] = next_non_admin_id
                next_non_admin_id += 1
        
        # Compute metrics for each user
        result = []
        for user in users:
            # Count agents
            agents_count = await db.generated_prompts.count_documents({"user_id": user["id"]})
            
            # Get token consumption
            transactions = await db.token_transactions.find(
                {"user_id": user["id"], "transaction_type": "usage"},
                {"_id": 0}
            ).to_list(1000)
            
            total_tokens_consumed = sum(
                abs(t["amount"]) for t in transactions
            )
            
            # Find most expensive agent
            most_expensive_agent = "N/A"
            if transactions:
                max_trans = max(
                    (t for t in transactions if t.get("openai_tokens_used")),
                    key=lambda t: t["openai_tokens_used"],
                    default=None
                )
                if max_trans:
                    most_expensive_agent = f"{max_trans['openai_tokens_used']} tokens"
            
            result.append({
                "id": user["id"],
                "sequence_id": sequence_map.get(user["id"], 0),
                "name": user["name"],
                "email": user["email"],
                "is_banned": user.get("is_banned", False),
                "omega_tokens_balance": user["omega_tokens_balance"],
                "agents_count": agents_count,
                "total_tokens_consumed": total_tokens_consumed,
                "most_expensive_agent": most_expensive_agent,
                "last_login_at": user.get("last_login_at", user.get("last_login"))
            })
        
        # Sort results
        reverse = sort_dir == "desc"
        result.sort(key=lambda x: x.get(sort_by, ""), reverse=reverse)
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting admin users: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/admin/users/{user_id}")
async def get_admin_user_detail(user_id: str, request: Request):
    """
    Get detailed user information including generated agents.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's agents
        prompts = await db.generated_prompts.find(
            {"user_id": user_id},
            {"_id": 0}
        ).to_list(1000)
        
        # Convert prompts
        agents = []
        for prompt in prompts:
            if isinstance(prompt['created_at'], str):
                prompt['created_at'] = datetime.fromisoformat(prompt['created_at'])
            if isinstance(prompt['description'], dict):
                prompt['description'] = AgentCharacteristics(**prompt['description'])
            agents.append(GeneratedPromptResponse(**prompt))
        
        # Count agents and tokens
        agents_count = len(agents)
        transactions = await db.token_transactions.find(
            {"user_id": user_id, "transaction_type": "usage"},
            {"_id": 0}
        ).to_list(1000)
        total_tokens_consumed = sum(abs(t["amount"]) for t in transactions)
        
        return AdminUserDetailResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            picture=user.get("picture"),
            is_banned=user.get("is_banned", False),
            omega_tokens_balance=user["omega_tokens_balance"],
            agents_count=agents_count,
            total_tokens_consumed=total_tokens_consumed,
            agents=agents,
            created_at=datetime.fromisoformat(user["created_at"]) if isinstance(user["created_at"], str) else user["created_at"],
            last_login_at=datetime.fromisoformat(user.get("last_login_at", user.get("last_login"))) if isinstance(user.get("last_login_at", user.get("last_login")), str) else user.get("last_login_at", user.get("last_login"))
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user detail: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.patch("/admin/users/{user_id}/ban")
async def ban_user(user_id: str, request: Request):
    """
    Ban a user from the platform.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_banned": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User banned successfully", "user_id": user_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error banning user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.patch("/admin/users/{user_id}/unban")
async def unban_user(user_id: str, request: Request):
    """
    Unban a user from the platform.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_banned": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User unbanned successfully", "user_id": user_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error unbanning user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.post("/admin/users/{user_id}/tokens/adjust")
async def adjust_user_tokens(user_id: str, adjustment: TokenAdjustmentRequest, request: Request):
    """
    Manually adjust a user's token balance (admin grant).
    Balance cannot go below 0.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        new_balance = user["omega_tokens_balance"] + adjustment.delta
        
        # Check non-negative constraint
        if new_balance < 0:
            raise HTTPException(status_code=400, detail="Token balance cannot be negative")
        
        # Update user balance
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"omega_tokens_balance": new_balance}}
        )
        
        # Create transaction record
        transaction = TokenTransaction(
            user_id=user_id,
            amount=adjustment.delta,
            balance_after=new_balance,
            transaction_type="admin_grant",
            description=f"Admin manual adjustment: {'+' if adjustment.delta > 0 else ''}{adjustment.delta} tokens"
        )
        
        doc = transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.token_transactions.insert_one(doc)
        
        return {
            "message": "Token balance adjusted successfully",
            "user_id": user_id,
            "delta": adjustment.delta,
            "new_balance": new_balance
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adjusting tokens: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/admin/settings")
async def get_platform_settings(request: Request):
    """
    Get platform-wide settings.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        settings = await db.settings.find_one({"id": "global"}, {"_id": 0})
        
        if not settings:
            # Create default settings if not exists
            default_settings = PlatformSettings()
            doc = default_settings.model_dump()
            doc['updated_at'] = doc['updated_at'].isoformat()
            await db.settings.insert_one(doc)
            return default_settings
        
        return settings
        
    except Exception as e:
        logger.error(f"Error getting settings: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.put("/admin/settings")
async def update_platform_settings(settings_update: PlatformSettingsUpdate, request: Request):
    """
    Update platform-wide settings.
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        # Get current settings or create default
        current_settings = await db.settings.find_one({"id": "global"}, {"_id": 0})
        
        if not current_settings:
            current_settings = PlatformSettings().model_dump()
            current_settings['updated_at'] = current_settings['updated_at'].isoformat()
            await db.settings.insert_one(current_settings)
        
        # Update only provided fields
        update_data = {
            k: v for k, v in settings_update.model_dump(exclude_unset=True).items()
            if v is not None
        }
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        await db.settings.update_one(
            {"id": "global"},
            {"$set": update_data}
        )
        
        # Return updated settings
        updated = await db.settings.find_one({"id": "global"}, {"_id": 0})
        return updated
        
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Phone Verification & Referral Endpoints
@api_router.post("/phone/request-verification")
async def request_phone_verification(phone_request: PhoneVerificationRequest):
    """
    Request phone verification code (Step 1).
    Sends SMS with 6-digit code to Czech phone number.
    """
    try:
        # Validate Czech phone format
        if not validate_czech_phone(phone_request.phone_number):
            raise HTTPException(
                status_code=400, 
                detail="Neplatné telefonní číslo. Použijte formát: +420XXXXXXXXX"
            )
        
        # Check if phone number is already registered
        existing_user = await db.users.find_one({"phone_number": phone_request.phone_number}, {"_id": 0})
        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Toto telefonní číslo je již registrováno"
            )
        
        # Generate verification code
        verification_code = generate_phone_verification_code()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        
        # Store verification code in temp collection
        await db.phone_verifications.update_one(
            {"phone_number": phone_request.phone_number},
            {"$set": {
                "phone_number": phone_request.phone_number,
                "verification_code": verification_code,
                "expires_at": expires_at.isoformat(),
                "attempts": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        # Send SMS (MOCK for MVP)
        await send_sms_verification(phone_request.phone_number, verification_code)
        
        logger.info(f"Verification code sent to {phone_request.phone_number}: {verification_code}")
        
        return {
            "message": "Ověřovací kód byl odeslán na váš telefon",
            "expires_in_minutes": 10,
            "mock_code": verification_code if os.environ.get('ENV') != 'production' else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error requesting verification: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/phone/verify")
async def verify_phone_number(verify_request: PhoneVerificationCodeRequest, request: Request):
    """
    Verify phone number with code (Step 2).
    FINALIZES shadow account registration - unlocks generator and processes referral reward.
    """
    user = await require_auth(request)  # User must be logged in (shadow account)
    user_id = user["id"]
    
    try:
        # Get verification record
        verification = await db.phone_verifications.find_one(
            {"phone_number": verify_request.phone_number},
            {"_id": 0}
        )
        
        if not verification:
            raise HTTPException(status_code=404, detail="Ověřovací kód nebyl nalezen")
        
        # Check expiration
        expires_at = datetime.fromisoformat(verification["expires_at"])
        if datetime.now(timezone.utc) > expires_at:
            await db.phone_verifications.delete_one({"phone_number": verify_request.phone_number})
            raise HTTPException(status_code=410, detail="Ověřovací kód vypršel")
        
        # Check attempts
        if verification.get("attempts", 0) >= 3:
            await db.phone_verifications.delete_one({"phone_number": verify_request.phone_number})
            raise HTTPException(status_code=429, detail="Příliš mnoho pokusů")
        
        # Verify code
        if verification["verification_code"] != verify_request.verification_code:
            await db.phone_verifications.update_one(
                {"phone_number": verify_request.phone_number},
                {"$inc": {"attempts": 1}}
            )
            raise HTTPException(status_code=401, detail="Neplatný ověřovací kód")
        
        # Code is valid - FINALIZE REGISTRATION
        # Update user: set phone_verified=true
        await db.users.update_one(
            {"id": user_id},
            {"$set": {
                "phone_number": verify_request.phone_number,
                "phone_verified": True
            }}
        )
        
        # Get updated user
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        
        # Process referral reward if user was referred
        if user_doc.get("referred_by"):
            referred_by_user_id = user_doc["referred_by"]
            
            # Check if referrer is phone verified
            referrer = await db.users.find_one({"id": referred_by_user_id}, {"_id": 0})
            if referrer and referrer.get("phone_verified", False):
                # Get reward amount from settings
                settings = await db.settings.find_one({"id": "global"}, {"_id": 0})
                reward_tokens = settings.get("referral_reward_tokens", 10000) if settings else 10000
                
                # Update referrer stats and balance
                await db.users.update_one(
                    {"id": referred_by_user_id},
                    {
                        "$inc": {
                            "referral_count": 1,
                            "omega_tokens_balance": reward_tokens
                        }
                    }
                )
                
                # Create reward transaction
                referrer_new_balance = (await db.users.find_one({"id": referred_by_user_id}))["omega_tokens_balance"]
                reward_transaction = TokenTransaction(
                    user_id=referred_by_user_id,
                    amount=reward_tokens,
                    balance_after=referrer_new_balance,
                    transaction_type="admin_grant",
                    description=f"Referral reward: {user_doc['name']} ({user_doc['email']})"
                )
                reward_doc = reward_transaction.model_dump()
                reward_doc['created_at'] = reward_doc['created_at'].isoformat()
                await db.token_transactions.insert_one(reward_doc)
                
                logger.info(f"Referral reward processed: {reward_tokens} tokens to {referred_by_user_id}")
        
        # Cleanup
        await db.phone_verifications.delete_one({"phone_number": verify_request.phone_number})
        
        return {
            "status": "success",
            "message": "Telefon byl úspěšně ověřen. Generator je nyní odemčen!",
            "user": {
                "id": user_doc["id"],
                "email": user_doc["email"],
                "name": user_doc["name"],
                "picture": user_doc.get("picture"),
                "is_admin": user_doc.get("is_admin", False),
                "phone_verified": True,
                "referral_code": user_doc.get("referral_code")
            },
            "omega_tokens_balance": user_doc["omega_tokens_balance"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying phone: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/referral/stats", response_model=ReferralStatsResponse)
async def get_referral_stats(request: Request):
    """
    Get referral program statistics for authenticated user.
    Shows referral code, count, rewards, and referred users list.
    """
    user = await require_auth(request)
    
    if not user.get("phone_verified", False):
        raise HTTPException(
            status_code=403,
            detail="Pouze ověření uživatelé mohou přistupovat k referral programu"
        )
    
    try:
        # Get referred users
        referred_users = await db.users.find(
            {"referred_by": user["id"]},
            {"_id": 0, "name": 1, "email": 1, "created_at": 1}
        ).to_list(1000)
        
        # Get reward amount from settings
        settings = await db.settings.find_one({"id": "global"}, {"_id": 0})
        reward_per_referral = settings.get("referral_reward_tokens", 10000) if settings else 10000
        
        # Calculate rewards
        referred_users_list = []
        for ref_user in referred_users:
            referred_users_list.append({
                "name": ref_user["name"],
                "email": ref_user["email"],
                "verified_at": ref_user["created_at"],
                "reward_earned": reward_per_referral
            })
        
        total_rewards = user.get("referral_count", 0) * reward_per_referral
        
        # Generate referral link
        base_url = os.environ.get("FRONTEND_URL", "https://quantum-codex-1.preview.emergentagent.com")
        referral_link = f"{base_url}/login?ref={user['referral_code']}"
        
        return ReferralStatsResponse(
            referral_code=user["referral_code"],
            referral_count=user.get("referral_count", 0),
            total_rewards_earned=total_rewards,
            referral_link=referral_link,
            referred_users=referred_users_list
        )
        
    except Exception as e:
        logger.error(f"Error getting referral stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

# GDPR Endpoints
@api_router.get("/gdpr/export")
async def export_user_data(request: Request):
    """
    Export all user personal data (GDPR Art. 15 - Right to Access).
    Returns complete data package in JSON format.
    Requires authentication.
    """
    user = await require_auth(request)
    user_id = user["id"]
    
    try:
        # Log audit trail
        await log_audit(
            user_id=user_id,
            action="export",
            resource_type="all_data",
            request=request,
            details={"export_type": "full"}
        )
        
        # Gather all user data
        # 1. User profile
        user_profile = {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "is_admin": user.get("is_admin", False),
            "omega_tokens_balance": user["omega_tokens_balance"],
            "created_at": user["created_at"],
            "last_login_at": user.get("last_login_at")
        }
        
        # 2. Generated prompts
        prompts = await db.generated_prompts.find(
            {"user_id": user_id},
            {"_id": 0}
        ).to_list(1000)
        
        # 3. Token transactions
        transactions = await db.token_transactions.find(
            {"user_id": user_id},
            {"_id": 0}
        ).to_list(10000)
        
        # 4. Audit logs
        audit_logs = await db.audit_logs.find(
            {"user_id": user_id},
            {"_id": 0}
        ).to_list(10000)
        
        # Prepare export package
        export_data = {
            "user_profile": user_profile,
            "generated_prompts": prompts,
            "token_transactions": transactions,
            "audit_logs": audit_logs,
            "export_date": datetime.now(timezone.utc).isoformat(),
            "gdpr_notice": "This export contains all personal data processed by Omega-Aurora Codex platform. You have the right to rectify, delete, or restrict processing of this data under GDPR Articles 16-18."
        }
        
        # Return as downloadable JSON
        from fastapi.responses import JSONResponse
        
        return JSONResponse(
            content=export_data,
            headers={
                "Content-Disposition": f"attachment; filename=omega-codex-data-{user_id[:8]}-{datetime.now().strftime('%Y%m%d')}.json"
            }
        )
        
    except Exception as e:
        logger.error(f"Error exporting user data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.delete("/gdpr/delete")
async def delete_user_account(request: Request):
    """
    Delete user account and all associated data (GDPR Art. 17 - Right to Erasure).
    Preserves accounting records as required by law (7 years retention).
    Requires authentication.
    """
    user = await require_auth(request)
    user_id = user["id"]
    
    # Prevent admin from deleting themselves via this endpoint
    if user.get("is_admin", False):
        raise HTTPException(
            status_code=403, 
            detail="Admin accounts cannot be deleted via this endpoint. Contact system administrator."
        )
    
    try:
        # Log audit trail BEFORE deletion
        await log_audit(
            user_id=user_id,
            action="delete",
            resource_type="account",
            request=request,
            details={"reason": "user_request_gdpr_art17"}
        )
        
        # Delete user data with exceptions for legal retention
        # 1. Delete user profile
        await db.users.delete_one({"id": user_id})
        
        # 2. Delete generated prompts
        await db.generated_prompts.delete_many({"user_id": user_id})
        
        # 3. Anonymize token transactions (keep for accounting, but remove PII)
        # Note: We keep transaction records with anonymized user_id for 7 years per accounting law
        await db.token_transactions.update_many(
            {"user_id": user_id},
            {"$set": {
                "user_id": f"DELETED-{uuid.uuid4()}",
                "description": "User account deleted - GDPR Art. 17"
            }}
        )
        
        # 4. Anonymize audit logs older than 30 days, delete recent ones
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        
        # Delete recent audit logs
        await db.audit_logs.delete_many({
            "user_id": user_id,
            "timestamp": {"$gte": thirty_days_ago.isoformat()}
        })
        
        # Anonymize old audit logs (keep for security monitoring)
        await db.audit_logs.update_many(
            {
                "user_id": user_id,
                "timestamp": {"$lt": thirty_days_ago.isoformat()}
            },
            {"$set": {"user_id": f"ANONYMIZED-{uuid.uuid4()}"}}
        )
        
        logger.info(f"User account deleted successfully: {user_id}")
        
        return {
            "message": "Your account and personal data have been deleted successfully.",
            "legal_notice": "Some anonymized records may be retained for legal compliance (accounting: 7 years).",
            "gdpr_reference": "Art. 17 GDPR - Right to Erasure"
        }
        
    except Exception as e:
        logger.error(f"Error deleting user account: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.post("/gdpr/anonymize-old-data")
async def anonymize_old_data(request: Request):
    """
    Admin endpoint to run data retention and anonymization policies.
    - Anonymize transactions older than 7 years (after accounting retention)
    - Delete audit logs older than 1 year
    - Anonymize prompts older than 2 years from inactive accounts
    Requires admin authentication.
    """
    await require_admin(request)
    
    try:
        now = datetime.now(timezone.utc)
        
        # 1. Delete audit logs older than 1 year
        one_year_ago = now - timedelta(days=365)
        audit_result = await db.audit_logs.delete_many({
            "timestamp": {"$lt": one_year_ago.isoformat()}
        })
        
        # 2. Anonymize transactions older than 7 years
        seven_years_ago = now - timedelta(days=365 * 7)
        transaction_result = await db.token_transactions.update_many(
            {
                "created_at": {"$lt": seven_years_ago.isoformat()},
                "user_id": {"$not": {"$regex": "^(DELETED|ANONYMIZED)-"}}
            },
            {"$set": {
                "user_id": lambda: f"ANONYMIZED-{uuid.uuid4()}",
                "description": "Anonymized after retention period"
            }}
        )
        
        # 3. Find inactive users (no login in 2+ years)
        two_years_ago = now - timedelta(days=365 * 2)
        inactive_users = await db.users.find({
            "last_login_at": {"$lt": two_years_ago.isoformat()},
            "is_admin": False
        }, {"_id": 0, "id": 1}).to_list(1000)
        
        inactive_user_ids = [u["id"] for u in inactive_users]
        
        # Anonymize prompts from inactive users
        prompt_result = await db.generated_prompts.update_many(
            {"user_id": {"$in": inactive_user_ids}},
            {"$set": {
                "user_id": lambda: f"INACTIVE-{uuid.uuid4()}",
                "conversation_summary": "Anonymized - user inactive"
            }}
        )
        
        logger.info(f"Data anonymization completed: {audit_result.deleted_count} audit logs, "
                   f"{transaction_result.modified_count} transactions, {prompt_result.modified_count} prompts")
        
        return {
            "message": "Data retention policies applied successfully",
            "deleted_audit_logs": audit_result.deleted_count,
            "anonymized_transactions": transaction_result.modified_count,
            "anonymized_prompts": prompt_result.modified_count,
            "inactive_users_found": len(inactive_user_ids)
        }
        
    except Exception as e:
        logger.error(f"Error anonymizing old data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()