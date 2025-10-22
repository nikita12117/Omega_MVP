# Ω-KOMPRESNÍ ROVNICE (Omega-Compressive Equation) - Development Plan

**Project:** Meta-learning AI platform where every created agent teaches the system  
**Version:** 2.0  
**Started:** 2025-01-22  
**Last Updated:** 2025-01-22 12:40 UTC

---

## Executive Summary

Building a self-evolving AI system where:
- Users describe agents they want to create
- System generates custom AI agents using an evolving Master Prompt (Ω_v1.0 → v1.1 → v1.2...)
- Every interaction feeds back into nightly learning loop
- Admin dashboard monitors system evolution with 6 modules
- Education section (existing) remains accessible

**Tech Stack:** FastAPI (Python) + React + MongoDB + OpenAI API  
**Design System:** Ω-Aurora (deep blues, teal, neural pathways aesthetic)

---

## Phase 1: Learning Loop Backend Infrastructure (Status: 90% Complete)

**Goal:** Build complete backend for agent creation, conversation tracking, feedback collection, and nightly learning loop.

### 1.1 Environment Setup & Dependencies ✅ COMPLETE
- ✅ Add OpenAI API key to `/app/backend/.env`
- ✅ Install `apscheduler` for nightly jobs
- ✅ Verify `openai` SDK (already installed)
- ✅ Create initial Master Prompt document in MongoDB

### 1.2 Database Models (server.py) ✅ COMPLETE
- ✅ Agent Model: id, user_id, description, generated_prompt, master_prompt_version, score, metadata, created_at
- ✅ ConversationEvent Model: id, agent_id, user_id, messages, scores, feedback_rating, created_at
- ✅ MasterPrompt Model: id, version, content, status, created_at, approved_at, approved_by, patterns_learned
- ✅ LearningSummary Model: id, date, summary_text, patterns_extracted, proposed_changes, approved, created_at

### 1.3 API Endpoints - Agent Creation ✅ COMPLETE
- ✅ POST /api/start-agent
- ✅ POST /api/agent/{agent_id}/refine
- ✅ POST /api/agent/{agent_id}/finalize

### 1.4 API Endpoints - Conversation & Feedback ✅ COMPLETE
- ✅ POST /api/message (existing, can be used for agent chat)
- ✅ POST /api/feedback (existing, enhanced)
- ✅ GET /api/agent/{agent_id}

### 1.5 API Endpoints - Admin & Monitoring ✅ COMPLETE
- ✅ GET /api/admin/agents
- ✅ GET /api/admin/master-prompts
- ✅ POST /api/admin/master-prompts/approve
- ✅ GET /api/admin/learning-summaries
- ✅ GET /api/admin/metrics
- ✅ POST /api/admin/trigger-learning

### 1.6 OpenAI Integration Module ✅ COMPLETE
- ✅ Created `/app/backend/openai_service.py`
- ✅ Implemented agent generation functions
- ✅ Implemented summarization functions
- ✅ Implemented embeddings & clustering

### 1.7 Nightly Learning Loop (Scheduler) ✅ COMPLETE
- ✅ Install APScheduler, configure timezone to CET
- ✅ Created `/app/backend/learning_loop.py`
- ✅ Schedule job: 4:20 AM CET daily
- ✅ Add error handling + logging

### 1.8 Master Prompt Initialization ✅ COMPLETE
- ✅ Created MongoDB document for Ω_v1.0
- ✅ Set status="active"

### 1.9 Testing Backend ⏳ IN PROGRESS
- ✅ Test admin endpoints (master-prompts, metrics)
- ✅ Backend starts successfully
- ✅ Scheduler initialized
- [ ] Test agent creation flow end-to-end
- [ ] Test learning loop manually
- [ ] Python linting

---

## Phase 2: Agent Creator Frontend (Status: Not Started)
## Phase 3: Admin Dashboard (6 Modules) (Status: Not Started)
## Phase 4: Polish & Deployment (Status: Not Started)

---

## Technical Implementation Details

### Files Created:
1. `/app/backend/openai_service.py` - OpenAI API integration (425 lines)
2. `/app/backend/learning_loop.py` - Nightly scheduler (236 lines)

### Files Modified:
1. `/app/backend/server.py` - Added 9 new Pydantic models, 10 new endpoints, scheduler initialization (~600 lines added)
2. `/app/backend/.env` - Added OPENAI_API_KEY
3. `/app/backend/requirements.txt` - Added apscheduler, tzlocal

### Database Collections Added:
- `agents` - Stores all created agents
- `conversation_events` - Stores conversations for learning
- `master_prompts` - Version control for Master Prompt
- `learning_summaries` - Daily learning results

### API Endpoints Added:
1. POST /api/start-agent - Start agent creation
2. POST /api/agent/{id}/refine - Refine with Q&A
3. POST /api/agent/{id}/finalize - Generate final prompt
4. GET /api/agent/{id} - Get agent details
5. GET /api/admin/agents - List all agents
6. GET /api/admin/master-prompts - List all versions
7. POST /api/admin/master-prompts/approve - Approve new version
8. GET /api/admin/learning-summaries - Get daily summaries
9. GET /api/admin/metrics - Live expo metrics
10. POST /api/admin/trigger-learning - Manual learning loop trigger

### Backend Verification:
✅ Backend starts without errors
✅ Ω_v1.0 Master Prompt initialized in MongoDB
✅ Scheduler started (4:20 AM CET daily)
✅ Admin endpoints tested and working
✅ Metrics endpoint returns live data

---

## Notes

- Keep existing Education section (/education) unchanged
- Preserve Ω-Aurora design system
- All Czech content must render diacritics correctly
- Admin dashboard requires is_admin: true
- Master Prompt Ω_v1.0 stored in MongoDB
- Nightly learning loop at 4:20 AM CET
