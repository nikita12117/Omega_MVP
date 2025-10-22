"""
Ω-KOMPRESNÍ ROVNICE - Learning Loop Scheduler

Nightly process that runs at 4:20 AM CET to:
1. Collect last 24h of conversation data
2. Summarize patterns and themes
3. Extract key learnings
4. Propose new Master Prompt version
5. Store results for admin review
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

from openai_service import (
    summarize_conversations,
    extract_patterns,
    propose_master_prompt_update,
    generate_embeddings,
    cluster_embeddings,
    generate_daily_insight
)

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


async def collect_last_24h_data() -> Dict:
    """
    Collect all relevant data from the last 24 hours.
    
    Returns:
        Dictionary with agents, conversation_events, and feedbacks
    """
    try:
        yesterday = datetime.now(timezone.utc) - timedelta(hours=24)
        
        # Collect agents created in last 24h
        agents_cursor = db.agents.find({
            "created_at": {"$gte": yesterday}
        })
        agents = await agents_cursor.to_list(length=1000)
        
        # Collect conversation events
        events_cursor = db.conversation_events.find({
            "created_at": {"$gte": yesterday}
        })
        events = await events_cursor.to_list(length=5000)
        
        # Collect feedbacks
        feedbacks_cursor = db.feedbacks.find({
            "created_at": {"$gte": yesterday}
        })
        feedbacks = await feedbacks_cursor.to_list(length=1000)
        
        logger.info(f"Collected data: {len(agents)} agents, {len(events)} events, {len(feedbacks)} feedbacks")
        
        return {
            "agents": agents,
            "conversation_events": events,
            "feedbacks": feedbacks
        }
        
    except Exception as e:
        logger.error(f"Error collecting 24h data: {str(e)}")
        return {"agents": [], "conversation_events": [], "feedbacks": []}


async def process_learning_loop():
    """
    Main learning loop process.
    Runs all steps: collect → summarize → extract → propose → store.
    """
    try:
        logger.info("🧠 Starting Ω-KOMPRESNÍ ROVNICE Learning Loop...")
        
        # Step 1: Collect data
        logger.info("Step 1: Collecting last 24h data...")
        data = await collect_last_24h_data()
        
        if not data["agents"] and not data["conversation_events"]:
            logger.info("No data to process. Skipping learning loop.")
            return
        
        # Step 2: Prepare event summaries with agent context
        logger.info("Step 2: Preparing event summaries...")
        enriched_events = []
        agent_map = {agent["id"]: agent for agent in data["agents"]}
        
        for event in data["conversation_events"]:
            agent_id = event.get("agent_id")
            agent = agent_map.get(agent_id, {})
            enriched_events.append({
                "agent_description": agent.get("description", "Unknown"),
                "feedback_rating": event.get("feedback_rating"),
                "messages": event.get("messages", [])
            })
        
        # Step 3: Summarize conversations
        logger.info("Step 3: Summarizing conversations with OpenAI...")
        summary, tokens_summary = await summarize_conversations(enriched_events)
        
        # Step 4: Extract patterns
        logger.info("Step 4: Extracting patterns...")
        patterns, tokens_patterns = await extract_patterns(summary)
        
        # Step 5: Get current active Master Prompt
        logger.info("Step 5: Fetching current Master Prompt...")
        current_master = await db.master_prompts.find_one({"status": "active"})
        
        if not current_master:
            logger.warning("No active Master Prompt found. Cannot propose update.")
            return
        
        current_version = current_master["version"]
        current_content = current_master["content"]
        
        # Calculate next version
        version_parts = current_version.split("_v")
        if len(version_parts) == 2:
            base = version_parts[0]
            version_num = version_parts[1]
            try:
                major, minor = map(int, version_num.split("."))
                next_version = f"{base}_v{major}.{minor + 1}"
            except ValueError:
                next_version = f"{base}_v1.1"
        else:
            next_version = "Ω_v1.1"
        
        # Step 6: Propose new Master Prompt
        logger.info(f"Step 6: Proposing Master Prompt {next_version}...")
        proposed_prompt, tokens_propose = await propose_master_prompt_update(
            current_content,
            patterns,
            summary
        )
        
        # Step 7: Generate daily insight
        logger.info("Step 7: Generating daily insight...")
        insight, tokens_insight = await generate_daily_insight(summary, patterns)
        
        # Step 8: Store learning summary
        logger.info("Step 8: Storing learning summary...")
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        learning_summary = {
            "date": today,
            "summary_text": summary,
            "patterns_extracted": patterns,
            "proposed_master_prompt_changes": proposed_prompt,
            "approved": False,
            "created_at": datetime.now(timezone.utc),
            "daily_insight": insight,
            "tokens_used": {
                "summary": tokens_summary,
                "patterns": tokens_patterns,
                "propose": tokens_propose,
                "insight": tokens_insight,
                "total": tokens_summary + tokens_patterns + tokens_propose + tokens_insight
            }
        }
        
        await db.learning_summaries.insert_one(learning_summary)
        
        # Step 9: Create pending Master Prompt
        logger.info("Step 9: Creating pending Master Prompt...")
        new_master_prompt = {
            "version": next_version,
            "content": proposed_prompt,
            "status": "pending",
            "created_at": datetime.now(timezone.utc),
            "approved_at": None,
            "approved_by": None,
            "patterns_learned": patterns
        }
        
        await db.master_prompts.insert_one(new_master_prompt)
        
        logger.info(f"✅ Learning loop complete! Proposed {next_version} awaiting approval.")
        logger.info(f"📊 Total tokens used: {learning_summary['tokens_used']['total']}")
        
        # Optional: Generate embeddings for clustering (if enough data)
        if len(data["agents"]) >= 10:
            logger.info("Bonus: Generating embeddings for clustering...")
            descriptions = [agent["description"] for agent in data["agents"][:50]]
            embeddings = await generate_embeddings(descriptions)
            
            if embeddings:
                clusters = cluster_embeddings(embeddings, n_clusters=5)
                logger.info(f"Clustered {len(descriptions)} agents into groups: {set(clusters)}")
        
    except Exception as e:
        logger.error(f"❌ Error in learning loop: {str(e)}")
        logger.exception(e)


def run_learning_loop_sync():
    """
    Synchronous wrapper for the async learning loop.
    Used by APScheduler which requires sync functions.
    """
    try:
        asyncio.run(process_learning_loop())
    except Exception as e:
        logger.error(f"Error running learning loop: {str(e)}")


async def initialize_master_prompt():
    """
    Initialize the first Master Prompt (Ω_v1.0) if it doesn't exist.
    Uses the Czech prompt provided by the user.
    """
    try:
        existing = await db.master_prompts.find_one({"version": "Ω_v1.0"})
        
        if existing:
            logger.info("Ω_v1.0 already exists in database.")
            return
        
        # User-provided initial Master Prompt in Czech
        initial_prompt = """MASTER_AGENT:Ω-Agent-Architekt
FUNCTION:Převod_přirozeného_jazyka→optimalizované_prompty_agentů
PROCES:Uživatelský_vstup→Mapování_konceptů→Kognitivní_vrstvení→Komprimovaný_prompt
INTERAKCE:Objasňující_dialog→Rekurzivní_optimalizace→Konečný_výstup

**KOGNITIVNÍ_ARCHITEKTURA**
VRSTVA_1:Percepce→Extrakce_jádra_záměru_z_ůživatelského_vstupu
VRSTVA_2:Analýza→Mapování_na_Omega_frameworky_a_vzory
VRSTVA_3:Syntéza→Stavba_rekurzivní_struktury_agenta
VRSTVA_4:Komprese→Optimalizace_pro_maximální_účinnost

**DIAOLOGOVÝ_PROTOKOL**
FÁZE_1:Počáteční_analýza_vstupu→2-3_objasňující_otázky
FÁZE_2:Demonstrace_mapování_konceptů→Zpětná_vazba_uživatele
FÁZE_3:Cyklické_zpřesňování→Dokud_není_optimální
FÁZE_4:Generování_komprimovaného_promptu

**FORMÁT_VÝSTUPU**
Ω-[TYP_AGENTA]v1.0
ROLE:[Přesná_definice_identity]
KONTEXT:[Provozní_prostředí]
SCHOPNOSTI:[Základní_funkce_s_rekurzivním_zlepšováním]
KOGNITIVNÍ_VRSTVY:[Architektura_víceúrovňového_uvažování]
ETIKA:[Vestavěná_omezení_a_hodnoty]
INTERAKCE:[Komunikační_protokol]

**KOMPRESNÍ_ALGORITMUS**
-Maximální_hustota_informací
-Rekurzivní_sebeodkazování
-Vestavěné_mechanismy_učení
-Omega_kognitivní_vzory

**PŘÍKLAD_VÝSTUPU**
Ω-Obchodní-Analytikv1.0
ROLE:Rekurzivní_stroj_na_optimalizaci_podnikání
KONTEXT:Startupové_prostředí_s_omezenými_zdroji
SCHOPNOSTI:Analýza_trhu→Generování_strategií→Sledování_výkonnosti→Rekurzivní_zlepšování
KOGNITIVNÍ_VRSTVY:Percepce_dat→Rozpoznávání_vzorů→Syntéza_strategií→Monitorování_realizace
ETIKA:Transparentní_odůvodňování→Soukromí_uživatele→Podnikatelská_etika
INTERAKCE:Proaktivní_postřehy→Jasná_vysvětlení→Iterativní_zpřesňování

**AKTIVACE:Začíná_"Popište_agenta,_kterého_potřebujete"**"""

        master_prompt_doc = {
            "version": "Ω_v1.0",
            "content": initial_prompt,
            "status": "active",
            "created_at": datetime.now(timezone.utc),
            "approved_at": datetime.now(timezone.utc),
            "approved_by": "system",
            "patterns_learned": ["Initial baseline prompt"]
        }
        
        await db.master_prompts.insert_one(master_prompt_doc)
        logger.info("✅ Initialized Ω_v1.0 Master Prompt in database")
        
    except Exception as e:
        logger.error(f"Error initializing Master Prompt: {str(e)}")


if __name__ == "__main__":
    # For testing: run the learning loop immediately
    logging.basicConfig(level=logging.INFO)
    asyncio.run(process_learning_loop())
