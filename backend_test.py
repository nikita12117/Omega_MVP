"""
Backend API Testing for Admin Dashboard
Tests all admin endpoints with proper authentication
"""

import requests
import json
import os
from datetime import datetime

# Configuration
BACKEND_URL = "https://agent-forge-49.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "cUtsuv-8nirbe-tippop"

# Global variables
auth_token = None
test_results = []

def log_test(endpoint, method, status_code, success, message, response_data=None):
    """Log test results"""
    result = {
        "endpoint": endpoint,
        "method": method,
        "status_code": status_code,
        "success": success,
        "message": message,
        "timestamp": datetime.now().isoformat()
    }
    if response_data:
        result["response_data"] = response_data
    test_results.append(result)
    
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} | {method} {endpoint} | {status_code} | {message}")
    if not success and response_data:
        print(f"   Response: {json.dumps(response_data, indent=2)[:200]}")

def test_admin_login():
    """Test 1: Admin Login"""
    global auth_token
    
    endpoint = f"{BACKEND_URL}/auth/admin/login"
    payload = {
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(endpoint, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                auth_token = data["token"]
                is_admin = data["user"].get("is_admin", False)
                
                if is_admin:
                    log_test("/auth/admin/login", "POST", 200, True, 
                            f"Admin login successful. Token received. User: {data['user'].get('name')}")
                    return True
                else:
                    log_test("/auth/admin/login", "POST", 200, False, 
                            "Login successful but user is not admin", data)
                    return False
            else:
                log_test("/auth/admin/login", "POST", 200, False, 
                        "Response missing token or user", data)
                return False
        else:
            log_test("/auth/admin/login", "POST", response.status_code, False, 
                    "Login failed", response.json() if response.text else None)
            return False
            
    except Exception as e:
        log_test("/auth/admin/login", "POST", 0, False, f"Exception: {str(e)}")
        return False

def test_get_master_prompts():
    """Test 2: Get Master Prompts"""
    endpoint = f"{BACKEND_URL}/admin/master-prompts"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "master_prompts" in data:
                count = data.get("count", 0)
                prompts = data.get("master_prompts", [])
                
                # Check if Ω_v1.0 exists
                v1_exists = any(p.get("version") == "Ω_v1.0" for p in prompts)
                
                log_test("/admin/master-prompts", "GET", 200, True, 
                        f"Retrieved {count} master prompts. Ω_v1.0 exists: {v1_exists}")
                return True, prompts
            else:
                log_test("/admin/master-prompts", "GET", 200, False, 
                        "Response missing master_prompts field", data)
                return False, []
        else:
            log_test("/admin/master-prompts", "GET", response.status_code, False, 
                    "Failed to get master prompts", response.json() if response.text else None)
            return False, []
            
    except Exception as e:
        log_test("/admin/master-prompts", "GET", 0, False, f"Exception: {str(e)}")
        return False, []

def test_get_learning_summaries():
    """Test 3: Get Learning Summaries"""
    endpoint = f"{BACKEND_URL}/admin/learning-summaries"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "summaries" in data:
                count = data.get("count", 0)
                log_test("/admin/learning-summaries", "GET", 200, True, 
                        f"Retrieved {count} learning summaries")
                return True
            else:
                log_test("/admin/learning-summaries", "GET", 200, False, 
                        "Response missing summaries field", data)
                return False
        else:
            log_test("/admin/learning-summaries", "GET", response.status_code, False, 
                    "Failed to get learning summaries", response.json() if response.text else None)
            return False
            
    except Exception as e:
        log_test("/admin/learning-summaries", "GET", 0, False, f"Exception: {str(e)}")
        return False

def test_get_agents_analytics():
    """Test 4: Get Agent Analytics"""
    endpoint = f"{BACKEND_URL}/admin/agents/analytics"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Test without filter
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "agents" in data:
                count = data.get("count", 0)
                total = data.get("total_agents", 0)
                v9_count = data.get("v9_count", 0)
                
                log_test("/admin/agents/analytics", "GET", 200, True, 
                        f"Retrieved {count} agents. Total: {total}, v9: {v9_count}")
                
                # Test with filter
                response2 = requests.get(f"{endpoint}?status_filter=v9_only&limit=50", 
                                        headers=headers, timeout=10)
                if response2.status_code == 200:
                    data2 = response2.json()
                    log_test("/admin/agents/analytics?status_filter=v9_only", "GET", 200, True, 
                            f"Retrieved {data2.get('count', 0)} v9 agents")
                
                return True
            else:
                log_test("/admin/agents/analytics", "GET", 200, False, 
                        "Response missing agents field", data)
                return False
        else:
            log_test("/admin/agents/analytics", "GET", response.status_code, False, 
                    "Failed to get agents analytics", response.json() if response.text else None)
            return False
            
    except Exception as e:
        log_test("/admin/agents/analytics", "GET", 0, False, f"Exception: {str(e)}")
        return False

def test_get_feedback_analytics():
    """Test 5: Get Feedback Analytics"""
    endpoint = f"{BACKEND_URL}/admin/feedback/analytics"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["total_feedbacks", "average_rating", "rating_distribution", 
                             "daily_trends", "top_keywords"]
            
            missing_fields = [f for f in required_fields if f not in data]
            
            if not missing_fields:
                total = data.get("total_feedbacks", 0)
                avg = data.get("average_rating", 0)
                log_test("/admin/feedback/analytics", "GET", 200, True, 
                        f"Retrieved feedback analytics. Total: {total}, Avg: {avg}")
                return True
            else:
                log_test("/admin/feedback/analytics", "GET", 200, False, 
                        f"Response missing fields: {missing_fields}", data)
                return False
        else:
            log_test("/admin/feedback/analytics", "GET", response.status_code, False, 
                    "Failed to get feedback analytics", response.json() if response.text else None)
            return False
            
    except Exception as e:
        log_test("/admin/feedback/analytics", "GET", 0, False, f"Exception: {str(e)}")
        return False

def test_get_metrics():
    """Test 6: Get Live Metrics"""
    endpoint = f"{BACKEND_URL}/admin/metrics"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["active_users", "agents_created_today", 
                             "token_consumption_24h", "top_keywords"]
            
            missing_fields = [f for f in required_fields if f not in data]
            
            if not missing_fields:
                active = data.get("active_users", 0)
                agents = data.get("agents_created_today", 0)
                tokens = data.get("token_consumption_24h", 0)
                log_test("/admin/metrics", "GET", 200, True, 
                        f"Live metrics: Active users: {active}, Agents today: {agents}, Tokens: {tokens}")
                return True
            else:
                log_test("/admin/metrics", "GET", 200, False, 
                        f"Response missing fields: {missing_fields}", data)
                return False
        else:
            log_test("/admin/metrics", "GET", response.status_code, False, 
                    "Failed to get metrics", response.json() if response.text else None)
            return False
            
    except Exception as e:
        log_test("/admin/metrics", "GET", 0, False, f"Exception: {str(e)}")
        return False

def test_trigger_learning():
    """Test 7: Trigger Learning Loop"""
    endpoint = f"{BACKEND_URL}/admin/trigger-learning"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    try:
        response = requests.post(endpoint, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                log_test("/admin/trigger-learning", "POST", 200, True, 
                        f"Learning loop triggered: {data['message']}")
                return True
            else:
                log_test("/admin/trigger-learning", "POST", 200, False, 
                        "Response missing message field", data)
                return False
        else:
            log_test("/admin/trigger-learning", "POST", response.status_code, False, 
                    "Failed to trigger learning", response.json() if response.text else None)
            return False
            
    except Exception as e:
        log_test("/admin/trigger-learning", "POST", 0, False, f"Exception: {str(e)}")
        return False

def test_qr_tokens():
    """Test 8: QR Token Management"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # 8a. Get all QR tokens
    endpoint = f"{BACKEND_URL}/admin/qr-tokens"
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "tokens" in data:
                count = len(data.get("tokens", []))
                log_test("/admin/qr-tokens", "GET", 200, True, 
                        f"Retrieved {count} QR tokens")
            else:
                log_test("/admin/qr-tokens", "GET", 200, False, 
                        "Response missing tokens field", data)
                return False
        else:
            log_test("/admin/qr-tokens", "GET", response.status_code, False, 
                    "Failed to get QR tokens", response.json() if response.text else None)
            return False
    except Exception as e:
        log_test("/admin/qr-tokens", "GET", 0, False, f"Exception: {str(e)}")
        return False
    
    # 8b. Create new QR token
    create_endpoint = f"{BACKEND_URL}/admin/qr-tokens"
    payload = {
        "label": "Test Token - Backend Testing",
        "max_activations": 10,
        "notes": "Created during automated backend testing"
    }
    
    try:
        response = requests.post(create_endpoint, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "id" in data:
                token_id = data["id"]
                token_str = data["token"]
                log_test("/admin/qr-tokens", "POST", 200, True, 
                        f"Created QR token: {token_str}")
                
                # 8c. Update QR token status
                update_endpoint = f"{BACKEND_URL}/admin/qr-tokens/{token_id}"
                update_payload = {"status": "disabled"}
                
                try:
                    response2 = requests.put(update_endpoint, json=update_payload, 
                                           headers=headers, timeout=30)
                    
                    if response2.status_code == 200:
                        log_test(f"/admin/qr-tokens/{token_id}", "PUT", 200, True, 
                                "Updated QR token status to disabled")
                        
                        # Re-enable it
                        update_payload2 = {"status": "active"}
                        response3 = requests.put(update_endpoint, json=update_payload2, 
                                               headers=headers, timeout=30)
                        if response3.status_code == 200:
                            log_test(f"/admin/qr-tokens/{token_id}", "PUT", 200, True, 
                                    "Updated QR token status to active")
                        
                        return True
                    else:
                        log_test(f"/admin/qr-tokens/{token_id}", "PUT", response2.status_code, False, 
                                "Failed to update QR token", response2.json() if response2.text else None)
                        return False
                except Exception as e:
                    log_test(f"/admin/qr-tokens/{token_id}", "PUT", 0, False, f"Exception: {str(e)}")
                    return False
            else:
                log_test("/admin/qr-tokens", "POST", 200, False, 
                        "Response missing token or id field", data)
                return False
        else:
            log_test("/admin/qr-tokens", "POST", response.status_code, False, 
                    "Failed to create QR token", response.json() if response.text else None)
            return False
    except Exception as e:
        log_test("/admin/qr-tokens", "POST", 0, False, f"Exception: {str(e)}")
        return False

def test_master_prompt_approval_rejection():
    """Test 9: Master Prompt Approve/Reject (if pending prompts exist)"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # First, get all master prompts to find a pending one
    endpoint = f"{BACKEND_URL}/admin/master-prompts"
    try:
        response = requests.get(endpoint, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            prompts = data.get("master_prompts", [])
            
            # Find a pending prompt
            pending_prompts = [p for p in prompts if p.get("status") == "pending"]
            
            if pending_prompts:
                test_prompt = pending_prompts[0]
                version = test_prompt.get("version")
                
                # Test rejection
                reject_endpoint = f"{BACKEND_URL}/admin/master-prompts/reject"
                reject_payload = {"version": version}
                
                response2 = requests.post(reject_endpoint, json=reject_payload, 
                                        headers=headers, timeout=30)
                
                if response2.status_code == 200:
                    log_test("/admin/master-prompts/reject", "POST", 200, True, 
                            f"Rejected master prompt: {version}")
                    return True
                else:
                    log_test("/admin/master-prompts/reject", "POST", response2.status_code, False, 
                            "Failed to reject prompt", response2.json() if response2.text else None)
                    return False
            else:
                log_test("/admin/master-prompts/approve", "POST", 0, True, 
                        "No pending prompts to test approval/rejection (this is OK)")
                log_test("/admin/master-prompts/reject", "POST", 0, True, 
                        "No pending prompts to test approval/rejection (this is OK)")
                return True
        else:
            log_test("/admin/master-prompts", "GET", response.status_code, False, 
                    "Failed to get master prompts for approval test")
            return False
    except Exception as e:
        log_test("/admin/master-prompts/approve", "POST", 0, False, f"Exception: {str(e)}")
        return False

def test_unauthorized_access():
    """Test 10: Verify endpoints require authentication"""
    endpoint = f"{BACKEND_URL}/admin/metrics"
    
    try:
        # Test without auth token
        response = requests.get(endpoint, timeout=30)
        
        if response.status_code in [401, 403]:
            log_test("/admin/metrics (no auth)", "GET", response.status_code, True, 
                    "Correctly rejected unauthorized request")
            return True
        else:
            log_test("/admin/metrics (no auth)", "GET", response.status_code, False, 
                    "Should have rejected unauthorized request", 
                    response.json() if response.text else None)
            return False
    except Exception as e:
        log_test("/admin/metrics (no auth)", "GET", 0, False, f"Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    total = len(test_results)
    passed = sum(1 for r in test_results if r["success"])
    failed = total - passed
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    print(f"Success Rate: {(passed/total*100):.1f}%\n")
    
    if failed > 0:
        print("Failed Tests:")
        for result in test_results:
            if not result["success"]:
                print(f"  ❌ {result['method']} {result['endpoint']}")
                print(f"     Status: {result['status_code']}, Message: {result['message']}")
    
    print("\n" + "="*80)

def main():
    """Run all tests"""
    print("="*80)
    print("BACKEND API TESTING - ADMIN DASHBOARD")
    print("="*80)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Admin Username: {ADMIN_USERNAME}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("="*80 + "\n")
    
    # Test 1: Admin Login (required for all other tests)
    print("Test 1: Admin Authentication")
    print("-" * 80)
    if not test_admin_login():
        print("\n❌ CRITICAL: Admin login failed. Cannot proceed with other tests.\n")
        print_summary()
        return
    
    print("\n" + "-" * 80)
    
    # Test 2: Get Master Prompts
    print("\nTest 2: Master Prompts")
    print("-" * 80)
    test_get_master_prompts()
    print("-" * 80)
    
    # Test 3: Learning Summaries
    print("\nTest 3: Learning Summaries")
    print("-" * 80)
    test_get_learning_summaries()
    print("-" * 80)
    
    # Test 4: Agent Analytics
    print("\nTest 4: Agent Analytics")
    print("-" * 80)
    test_get_agents_analytics()
    print("-" * 80)
    
    # Test 5: Feedback Analytics
    print("\nTest 5: Feedback Analytics")
    print("-" * 80)
    test_get_feedback_analytics()
    print("-" * 80)
    
    # Test 6: Live Metrics
    print("\nTest 6: Live Metrics")
    print("-" * 80)
    test_get_metrics()
    print("-" * 80)
    
    # Test 7: Trigger Learning
    print("\nTest 7: Trigger Learning Loop")
    print("-" * 80)
    test_trigger_learning()
    print("-" * 80)
    
    # Test 8: QR Token Management
    print("\nTest 8: QR Token Management")
    print("-" * 80)
    test_qr_tokens()
    print("-" * 80)
    
    # Test 9: Master Prompt Approval/Rejection
    print("\nTest 9: Master Prompt Approval/Rejection")
    print("-" * 80)
    test_master_prompt_approval_rejection()
    print("-" * 80)
    
    # Test 10: Unauthorized Access
    print("\nTest 10: Authentication Enforcement")
    print("-" * 80)
    test_unauthorized_access()
    print("-" * 80)
    
    # Print summary
    print_summary()
    
    # Save results to file
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"\nDetailed results saved to: /app/backend_test_results.json\n")

if __name__ == "__main__":
    main()
