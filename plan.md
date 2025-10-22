# Ω-KOMPRESNÍ ROVNICE (Omega-Compressive Equation) - Development Plan

**Project:** Meta-learning AI platform where every created agent teaches the system  
**Version:** 2.0  
**Started:** 2025-01-22  
**Last Updated:** 2025-01-22

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

## Phase 1: Learning Loop Backend Infrastructure (Status: In Progress)

**Goal:** Build complete backend for agent creation, conversation tracking, feedback collection, and nightly learning loop.

### 1.1 Environment Setup & Dependencies
- [ ] Add OpenAI API key to `/app/backend/.env`
- [ ] Install `apscheduler` for nightly jobs
- [ ] Verify `openai` SDK (already installed)
- [ ] Create initial Master Prompt document in MongoDB

### 1.2 Database Models (server.py)
- [ ] Agent Model: id, user_id, description, generated_prompt, master_prompt_version, score, metadata, created_at
- [ ] ConversationEvent Model: id, agent_id, user_id, messages, scores, feedback_rating, created_at
- [ ] MasterPrompt Model: id, version, content, status, created_at, approved_at, approved_by, patterns_learned
- [ ] LearningSummary Model: id, date, summary_text, patterns_extracted, proposed_changes, approved, created_at

### 1.3 API Endpoints - Agent Creation
- [ ] POST /api/start-agent
- [ ] POST /api/agent/{agent_id}/refine
- [ ] POST /api/agent/{agent_id}/finalize

### 1.4 API Endpoints - Conversation & Feedback
- [ ] POST /api/message (enhance for agent-specific chat)
- [ ] POST /api/feedback (enhance existing)
- [ ] GET /api/agent/{agent_id}

### 1.5 API Endpoints - Admin & Monitoring
- [ ] GET /api/admin/agents
- [ ] GET /api/admin/master-prompts
- [ ] POST /api/admin/master-prompts/approve
- [ ] GET /api/admin/learning-summaries
- [ ] GET /api/admin/metrics
- [ ] POST /api/admin/trigger-learning

### 1.6 OpenAI Integration Module
- [ ] Create openai_service.py
- [ ] Implement agent generation functions
- [ ] Implement summarization functions
- [ ] Implement embeddings & clustering

### 1.7 Nightly Learning Loop (Scheduler)
- [ ] Install APScheduler, configure timezone to CET
- [ ] Create learning_loop.py
- [ ] Schedule job: 4:20 AM CET daily
- [ ] Add error handling + logging

### 1.8 Master Prompt Initialization
- [ ] Create MongoDB document for Ω_v1.0
- [ ] Set status="active"

### 1.9 Testing Backend
- [ ] Test agent creation endpoints
- [ ] Test conversation endpoints
- [ ] Test admin endpoints
- [ ] Test learning loop
- [ ] Python linting

---

## Phase 2: Agent Creator Frontend (Status: Not Started)
## Phase 3: Admin Dashboard (6 Modules) (Status: Not Started)
## Phase 4: Polish & Deployment (Status: Not Started)

---

## Notes

- Keep existing Education section (/education) unchanged
- Preserve Ω-Aurora design system
- All Czech content must render diacritics correctly
- Admin dashboard requires is_admin: true
- Master Prompt Ω_v1.0 stored in MongoDB
- Nightly learning loop at 4:20 AM CET
