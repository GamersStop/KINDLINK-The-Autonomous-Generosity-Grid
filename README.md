<div align="center">

# 🌐 KindLink: The Autonomous Generosity Grid

**AI-Orchestrated Crisis Response • Multimodal Distress SKU Decomposition • Solana Micro-Grant Rails • Snowflake Cortex Macro-Analytics**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16_Alpine-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Conversational_AI-black?style=for-the-badge&logo=elevenlabs&logoColor=white)](https://elevenlabs.io/)
[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet_Escrow-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com/)
[![Snowflake Cortex](https://img.shields.io/badge/Snowflake-Cortex_Analytics-29B5E8?style=for-the-badge&logo=snowflake&logoColor=white)](https://www.snowflake.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Orchestrated-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-core-architecture--system-topology">Architecture</a> •
  <a href="#-key-features--portal-screens">Portal Modules</a> •
  <a href="#-deep-sponsor-integrations">Sponsor Integrations</a> •
  <a href="#-complete-rest-api-reference">API Reference</a> •
  <a href="#-database-schema--models">Database Schema</a> •
  <a href="#-quickstart-guide">Quickstart</a> •
  <a href="#-snowflake-cortex-setup">Snowflake Analytics</a> •
  <a href="#-environment-variables">Configuration</a> •
  <a href="#-repository-structure">Structure</a>
</p>

</div>

---

## 📌 Overview

**KindLink** is an autonomous, open-access crisis response and generosity grid. In catastrophic emergencies, relief efforts frequently stall not from lack of goodwill, but due to chaotic information bottlenecks, ambiguous disaster pleas, opaque volunteer coordination, and slow financial rails.

KindLink solves this by bridging **multimodal generative AI**, **conversational voice interfaces**, **high-throughput blockchain micro-grants**, and **enterprise data warehousing**:

1. **Multimodal SKU Decomposition:** Converts raw, unstructured text pleas or live camera video streams into itemized, quantifiable relief SKUs (rations, transport capacity, medical kits, labor hours) with threat scoring via **Google Gemini 3.5 Flash**.
2. **Immediate Lifeline Voice Directives:** Streams calming, actionable survival instructions in real-time to victims via **ElevenLabs Conversational AI**.
3. **Frictionless Micro-Grants:** Executes instant, verifiable on-chain Devnet SOL sponsorships directly to mission escrow pools via **Solana Web3**.
4. **Resilient Volunteer & NGO Orchestration:** Dynamic scheduling, dispatch radius filtering, calendar date blocking, and capacity rosters backed by **PostgreSQL 16**.
5. **Macro-Triage Analytics:** Synchronizes real-time field telemetry into **Snowflake Cortex / OLAP Matrix** to compute capital velocity, aid distribution shares, and cross-zone elasticity indices.

---

## 🏗️ Core Architecture & System Topology

```text
                                  ┌────────────────────────────────────────────────────────┐
                                  │                KindLink Frontend Portal                │
                                  │      (Next.js 14 App Router • TypeScript • Tailwind)   │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │ REST / JSON (HTTP & WebRTC)
                                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                  FastAPI Backend Core                                                    │
│                                                                                                                          │
│   ┌────────────────────────────────┐   ┌────────────────────────────────┐   ┌────────────────────────────────────────┐   │
│   │       Google Gemini 3.5        │   │        ElevenLabs Voice        │   │             Solana Devnet              │   │
│   │   • Raw Plea Decomposition     │   │   • Emergency Audio Directives │   │   • Escrow Micro-Grant Transfers       │   │
│   │   • 5-Frame Visual SOS Audit   │   │   • Calm Victim Guidance       │   │   • Versioned Transaction (V0)         │   │
│   │   • Pydantic Schema Extraction │   │   • Low-Latency TTS Synthesis  │   │   • Cryptographic Signatures           │   │
│   └────────────────────────────────┘   └────────────────────────────────┘   └────────────────────────────────────────┘   │
│                                                                                                                          │
│                                           ┌───────────────────────────────────┐                                          │
│                                           │       PostgreSQL 16 (SQLModel)    │                                          │
│                                           │   • Missions & Mission Items      │                                          │
│                                           │   • Volunteer Offers & Pledges    │                                          │
│                                           │   • Verified NGO Partners         │                                          │
│                                           │   • Giver Accounts & Sessions     │                                          │
│                                           └─────────────────┬─────────────────┘                                          │
│                                                             │                                                            │
│                                                             ▼ Batch Sync / Analytics                                     │
│                                           ┌───────────────────────────────────┐                                          │
│                                           │         Snowflake Cortex          │                                          │
│                                           │   • CORTEX_MISSIONS_ANALYTICS     │                                          │
│                                           │   • CORTEX_COMMITMENT_LEDGER      │                                          │
│                                           │   • V_MODAL_AID_DISTRIBUTION      │                                          │
│                                           │   • V_MISSION_CAPITAL_VELOCITY    │                                          │
│                                           │   • V_CORTEX_AI_DISPATCH_HEALTH   │                                          │
│                                           └───────────────────────────────────┘                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Key Features & Portal Modules

The frontend web application provides a comprehensive suite of 10 specialized disaster relief and generosity management interfaces:

| Route | Module Name | Core Capabilities |
| :--- | :--- | :--- |
| [`/`](frontend/src/app/(portal)/page.tsx) | **Home & Grid Hub** | Live global mission statistics (active needs, regional zones, giver velocity, SOL funded), dynamic urgent SOS notification ticker, and quick navigation. |
| [`/ngo`](frontend/src/app/(portal)/ngo/page.tsx) | **NGO Need Decomposer** | Ingests raw disaster pleas, runs structured AI decomposition with **Gemini 3.5 Flash**, extracts verified SKUs, urgency tags, and broadcasts directly to the live grid (Gated by `NGOGate`). |
| [`/onboard`](frontend/src/app/(portal)/onboard/page.tsx) | **NGO Onboarding Wizard** | 4-step partner registration verifying legal charter ID, operational zones, rescue fleets, team headcount, alert channels, and Solana treasury address. |
| [`/givers`](frontend/src/app/(portal)/givers/page.tsx) | **Giver Matching & Intake** | Semantic giver registration, category filtering (rations, logistics, labor, skill, SOL), calendar date blocking, instant SOL escrow donations, and commitment history (Gated by `GiverGate`). |
| [`/live-grid`](frontend/src/app/(portal)/live-grid/page.tsx) | **Live Mission Grid** | Real-time mission feed with category filtering, search, interactive **Volunteer Capacity Roster** modal (individual responders & certified NGOs), and direct SKU claims. |
| [`/sos`](frontend/src/app/(portal)/sos/page.tsx) | **Live Sentinel SOS** | One-touch emergency SOS utilizing device camera and GPS telemetry. Extracts 5 representative video frames, performs Gemini hazard auditing, and plays **ElevenLabs** safety voice guidance. |
| [`/partners`](frontend/src/app/(portal)/partners/page.tsx) | **Partners Directory** | Dynamic NGO partner registry loaded from PostgreSQL alongside Core Infrastructure Pillars (Solana Foundation & ElevenLabs Voice Lab) with live node statuses. |
| [`/admin`](frontend/src/app/(portal)/admin/page.tsx) | **Auditor Dashboard** | Grid telemetry, PostgreSQL record counters, one-click **Snowflake ETL sync**, and real-time Snowflake Cortex distribution and capital velocity charts. |
| [`/how-it-works`](frontend/src/app/(portal)/how-it-works/page.tsx) | **Interactive Architecture** | Visual 5-phase breakdown of KindLink's pipeline: Ingestion, Decomposition, Matching, On-chain Escrow, and Snowflake Analytics. |
| [`/contact`](frontend/src/app/(portal)/contact/page.tsx) | **Operations & Support** | Emergency hotline dispatch, regional command centers, priority ticketing system, and field FAQ. |

---

## ⚡ Deep Sponsor Integrations

### 1. 🤖 Google Gemini 3.5 Flash
* **Structured Text Plea Decomposition:** Ingests chaotic messages *(e.g. "We have 80 families stranded in Sector 9, rising floodwaters, urgent need for dry food, blankets, and 2 rescue boats")* and parses them deterministically into Pydantic models containing itemized SKUs, target quantities, category taxonomy, and threat priority scores.
* **Multimodal Visual Sentinel Audit:** Ingests base64 camera frames captured during SOS emergencies, evaluates water depth, structural stability, trapped victim counts, and generates emergency directives.

### 2. 🎙️ ElevenLabs Conversational Voice AI
* **Dynamic Lifeline TTS:** Synthesizes low-latency, empathetic spoken directives for trapped individuals during SOS distress calls via the `eleven_turbo_v2` model.
* **Intake Voice Prompts:** Powers interactive conversational prompts for hands-free giver onboarding and accessibility.

### 3. ⛓️ Solana Devnet & Micro-Grant Rails
* **Programmatic Escrow Funding:** Uses `@solana/web3.js` on the client and `solders` / `solana-py` on the backend to execute transfers of Devnet SOL directly into the mission escrow vault.
* **Versioned Transactions (V0):** Automatically compiles instructions with the latest finalized blockhash, signs with payer keys, and broadcasts via Devnet JSON-RPC.
* **Transparent Verification:** Every micro-grant creates an immutable `VolunteerCommitment` with an on-chain transaction signature verifiable on Solana Explorer.

### 4. ❄️ Snowflake Cortex & Warehouse Analytics
* **Automated Data Pipeline:** The `/api/v1/admin/snowflake/sync` endpoint merges PostgreSQL missions and commitments into `KINDLINK_ANALYTICS.AUDIT_GRID`.
* **Analytical Intelligence Views (`snowflakes.sql`):**
  * `V_CORTEX_AI_DISPATCH_HEALTH`: Computes a dynamic Grid Resilience Index based on escrow funding, volunteer commitments, and priority scores.
  * `V_MODAL_AID_DISTRIBUTION`: Aggregates distribution share percentages across aid types (`SOL_ESCROW`, `LOGISTICS`, `LABOUR`, `SKILL`, `RATION`).
  * `V_MISSION_CAPITAL_VELOCITY`: Evaluates capital deployment efficiency (SOL per priority unit) across active disaster zones.

---

## 📡 Complete REST API Reference

All backend endpoints are prefixed with `/api/v1`. Interactive OpenAPI documentation is accessible at `http://localhost:8000/docs`.

### 🆘 Aid & Needs Decomposition (`/api/v1/aid`)
* `POST /api/v1/aid/decompose` — Decomposes raw distress text pleas into structured SKUs using Gemini 3.5 Flash.
* `POST /api/v1/aid/missions/broadcast` — Commits a decomposed mission with its itemized requirements to PostgreSQL.
* `GET /api/v1/aid/missions/feed` — Returns all active crisis missions with nested SKU items.
* `POST /api/v1/aid/missions/items/claim` — Increments the raised quantity for a specific SKU requirement.
* `POST /api/v1/aid/missions/items/donate-sol` — Broadcasts a Devnet SOL transfer to the escrow vault and logs the commitment.

### 🚨 Sentinel SOS (`/api/v1/sentinel`)
* `GET /api/v1/sentinel/calm-audio` — Fetches synthesized ElevenLabs audio prompts for emergency guidance.
* `POST /api/v1/sentinel/audit-broadcast` — Audits 5 camera frames with Gemini multimodal vision, creates a high-priority SOS mission, and returns spoken directives.

### 🤝 Volunteers & Givers (`/api/v1/volunteers` & `/api/v1/giver-auth`)
* `POST /api/v1/giver-auth/signup` — Registers a new giver/volunteer with salted password hashing.
* `POST /api/v1/giver-auth/login` — Authenticates a giver and returns an active session token.
* `GET /api/v1/giver-auth/verify-session` — Validates an existing giver session token.
* `POST /api/v1/volunteers/standby` — Registers volunteer availability, vehicle capacity, and dispatch radius.
* `GET /api/v1/volunteers/capacity-roster` — Returns all standby responders and certified NGO partner capacities.
* `POST /api/v1/volunteers/commit-item` — Blocks dates for physical volunteer dispatch on a mission SKU.
* `GET /api/v1/volunteers/my-offers` — Retrieves offers submitted by the volunteer.
* `GET /api/v1/volunteers/my-completed-services` — Retrieves confirmed service pledges and SOL donations.

### 🏢 NGO Management (`/api/v1/ngo-auth`)
* `POST /api/v1/ngo-auth/login` — Authenticates an NGO partner via Registration Number and password.
* `GET /api/v1/ngo-auth/verify-session` — Verifies NGO partner session token.
* `POST /api/v1/ngo-auth/onboard` — Onboards and verifies an NGO organization with personnel and fleet records.
* `GET /api/v1/ngo-auth/directory` — Returns verified partner NGOs alongside core protocol pillars.

### 📊 Admin & Snowflake Analytics (`/api/v1/admin`)
* `POST /api/v1/admin/login` — Authenticates admin auditor credentials.
* `GET /api/v1/admin/metrics` — Retrieves aggregate mission, SKU, commitment, and SOL allocation counts.
* `POST /api/v1/admin/snowflake/sync` — Synchronizes local PostgreSQL state to Snowflake analytics tables.
* `GET /api/v1/admin/snowflake/analytics` — Fetches modal aid distribution and capital velocity metrics from Snowflake.

---

## 🗄️ Database Schema & Models

Built with **SQLModel** (SQLAlchemy + Pydantic) on **PostgreSQL 16**:

```text
┌──────────────────────────────────────┐       1 : N       ┌──────────────────────────────────────┐
│               Mission                │ ────────────────< │             MissionItem              │
├──────────────────────────────────────┤                   ├──────────────────────────────────────┤
│ mission_id (PK, String)              │                   │ id (PK, Integer)                     │
│ incident_zone (String)               │                   │ item_key (String)                    │
│ extracted_coordinates (String)       │                   │ category (String)                    │
│ reported_timestamp (String)          │                   │ title (String)                       │
│ affected_count (Integer)             │                   │ target_qty (Integer)                 │
│ summary (String)                     │                   │ raised_qty (Integer)                 │
│ priority_score (Integer, Indexed)    │                   │ unit (String)                        │
│ status (String, Indexed)             │                   │ urgency (String)                     │
│ escrow_allocated_sol (Float)         │                   │ mission_id (FK -> Mission.mission_id)│
│ broadcast_timestamp (String, Indexed)│                   └──────────────────────────────────────┘
└──────────────────────────────────────┘

┌──────────────────────────────────────┐                   ┌──────────────────────────────────────┐
│            VolunteerOffer            │                   │         VolunteerCommitment          │
├──────────────────────────────────────┤                   ├──────────────────────────────────────┤
│ id (PK, Integer)                     │                   │ id (PK, Integer)                     │
│ full_name (String)                   │                   │ giver_email (String, Indexed)        │
│ contact (String)                     │                   │ mission_id (String, Indexed)          │
│ location (String)                    │                   │ item_key (String)                    │
│ category (String)                    │                   │ item_title (String)                  │
│ dispatch_radius_km (Integer)         │                   │ commitment_type (String)             │
│ vehicle_capacity_kg (Integer)        │                   │ details (String)                     │
│ available_from (Date)                │                   │ sol_amount (Float)                   │
│ available_to (Date)                  │                   │ tx_signature (String)                │
│ notes (String)                       │                   │ status (String)                      │
│ status (String)                      │                   │ created_at (String)                  │
│ created_at (String)                  │                   └──────────────────────────────────────┘
└──────────────────────────────────────┘

┌──────────────────────────────────────┐                   ┌──────────────────────────────────────┐
│              NGOPartner              │                   │              GiverUser               │
├──────────────────────────────────────┤                   ├──────────────────────────────────────┤
│ id (PK, Integer)                     │                   │ id (PK, Integer)                     │
│ org_name (String, Indexed)           │                   │ email (String, Unique, Indexed)      │
│ reg_number (String, Unique, Indexed) │                   │ password_hash (String)               │
│ org_type (String)                    │                   │ created_at (String)                  │
│ lead_name / lead_phone / lead_email  │                   └──────────────────────────────────────┘
│ password_hash (String)               │
│ operational_zones (JSON Array)       │
│ active_personnel (Integer)           │
│ vehicle_fleet (JSON Array)           │
│ alert_channel (String)               │
│ solana_treasury_address (String)     │
│ verification_status (String)         │
│ created_at (String)                  │
└──────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### Option A: 🐳 Docker Compose (Recommended)

> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/KINDLINK-The-Autonomous-Generosity-Grid.git
cd KINDLINK-The-Autonomous-Generosity-Grid
```

#### 2. Create Environment Configuration
```bash
cp .env.example .env
```

#### 3. Build & Boot the Complete Stack
```bash
docker compose up --build
```
*All three services (PostgreSQL, FastAPI Backend, Next.js Frontend) will start with container healthchecks configured.*

---

### Option B: 💻 Local Bare-Metal Setup

#### 1. Start PostgreSQL
Ensure PostgreSQL is running locally on port `5432` with database `kindlink_db`, user `kindlink`, password `kindlink_secret_password`.

#### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Linux/macOS:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ❄️ Snowflake Cortex Setup

To initialize your Snowflake data warehouse for KindLink analytics:

1. Log into your Snowflake Worksheets console.
2. Execute the initialization script [`snowflakes.sql`](snowflakes.sql):

```sql
USE DATABASE KINDLINK_ANALYTICS;
USE SCHEMA AUDIT_GRID;

-- Creates view for grid resilience calculation
CREATE OR REPLACE VIEW V_CORTEX_AI_DISPATCH_HEALTH AS
SELECT 
    m.mission_id,
    m.incident_zone,
    m.priority_score,
    COALESCE(m.escrow_allocated_sol, 0) AS escrow_allocated_sol,
    COUNT(c.id) AS total_pledges,
    ROUND(
        LEAST(1.0, (COALESCE(m.escrow_allocated_sol, 0) * 0.4 + COUNT(c.id) * 0.6) / NULLIF(m.priority_score * 2.0, 0)), 
        2
    ) AS grid_resilience_score,
    CASE 
        WHEN (COALESCE(m.escrow_allocated_sol, 0) * 0.4 + COUNT(c.id) * 0.6) / NULLIF(m.priority_score * 2.0, 0) >= 0.75 THEN 'OPTIMAL_RESPONSE'
        WHEN (COALESCE(m.escrow_allocated_sol, 0) * 0.4 + COUNT(c.id) * 0.6) / NULLIF(m.priority_score * 2.0, 0) >= 0.40 THEN 'MODERATE_DEFICIT'
        ELSE 'CRITICAL_SHORTAGE'
    END AS triage_status
FROM CORTEX_MISSIONS_ANALYTICS m
LEFT JOIN CORTEX_COMMITMENT_LEDGER c ON m.mission_id = c.mission_id
GROUP BY m.mission_id, m.incident_zone, m.priority_score, m.escrow_allocated_sol;

-- Creates view for multi-modal aid distribution
CREATE OR REPLACE VIEW V_MODAL_AID_DISTRIBUTION AS
SELECT 
    commitment_type,
    COUNT(*) AS total_pledges,
    SUM(sol_amount) AS total_sol,
    ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 1) AS pct_share
FROM CORTEX_COMMITMENT_LEDGER
GROUP BY commitment_type;

-- Creates view for mission urgency vs capital velocity
CREATE OR REPLACE VIEW V_MISSION_CAPITAL_VELOCITY AS
SELECT 
    m.mission_id,
    m.incident_zone,
    m.priority_score,
    COALESCE(m.escrow_allocated_sol, 0) AS escrow_allocated_sol,
    COUNT(c.id) AS total_commitments,
    ROUND(COALESCE(m.escrow_allocated_sol, 0) / NULLIF(m.priority_score, 0), 3) AS sol_per_priority_ratio
FROM CORTEX_MISSIONS_ANALYTICS m
LEFT JOIN CORTEX_COMMITMENT_LEDGER c ON m.mission_id = c.mission_id
GROUP BY m.mission_id, m.incident_zone, m.priority_score, m.escrow_allocated_sol;
```

3. Trigger synchronization directly from the KindLink Auditor Dashboard (`/admin`) or via POST `/api/v1/admin/snowflake/sync`.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on [`.env.example`](.env.example):

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://kindlink:kindlink_secret_password@db:5432/kindlink_db` |
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini 3.5 Flash | `AIzaSy...` |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for emergency voice TTS | `sk_...` |
| `ELEVENLABS_VOICE_ID` | Voice profile ID for speech synthesis | `21m00Tcm4TlvDq8ikWAM` |
| `SOLANA_RPC_URL` | Solana Devnet JSON-RPC endpoint URL | `https://api.devnet.solana.com` |
| `SOLANA_PAYER_PRIVATE_KEY` | Base58 encoded Solana private key for payer wallet | `5K...` *(Optional: autogenerated if blank)* |
| `SOLANA_ESCROW_PUBKEY` | Target Solana public key for escrow micro-grants | `ComputeBudget111...` |
| `ADMIN_EMAIL` | Auditor dashboard login email | `admin@kindlink.org` |
| `ADMIN_PASSWORD` | Auditor dashboard login password | `GridAdminSecure2026!` |
| `SNOWFLAKE_ACCOUNT` | Snowflake account identifier | `xy12345.us-east-1` |
| `SNOWFLAKE_USER` | Snowflake username | `KINDLINK_ADMIN` |
| `SNOWFLAKE_PASSWORD` | Snowflake password | `YourPasswordHere` |
| `SNOWFLAKE_WAREHOUSE` | Snowflake compute warehouse name | `COMPUTE_WH` |
| `SNOWFLAKE_DATABASE` | Target Snowflake database | `KINDLINK_ANALYTICS` |
| `SNOWFLAKE_SCHEMA` | Target Snowflake schema | `AUDIT_GRID` |
| `NEXT_PUBLIC_API_URL` | Frontend pointer to FastAPI backend | `http://localhost:8000` |

---

## 🛠️ Developer CLI Shortcuts (`Makefile`)

The root [`Makefile`](Makefile) provides quick developer commands:

```bash
make up             # Build & start all containers in detached mode
make down           # Stop and tear down running containers
make build          # Force rebuild of Docker images without cache
make restart        # Restart all services
make logs           # Stream combined logs from all containers
make logs-backend   # Follow logs from FastAPI backend
make logs-frontend  # Follow logs from Next.js frontend
make shell-backend  # Open an interactive bash shell in the backend container
make shell-frontend # Open an interactive shell in the frontend container
make test           # Run pytest (backend) and ESLint (frontend)
make clean          # Remove dangling images, containers, and volumes
```

---

## 📂 Repository Structure

```text
KINDLINK-The-Autonomous-Generosity-Grid/
├── docker-compose.yml              # PostgreSQL, FastAPI & Next.js multi-container setup
├── Makefile                        # CLI shortcuts for container management & testing
├── snowflakes.sql                  # Snowflake Cortex analytics views & intelligence schema
├── .env.example                    # Blueprint environment variables configuration
├── .gitignore                      # Git exclusion rules for node, python & secrets
├── backend/
│   ├── Dockerfile                  # Python 3.11 container definition
│   ├── requirements.txt            # FastAPI, SQLModel, Google GenAI, ElevenLabs, Solana, Snowflake
│   └── src/
│       ├── main.py                 # ASGI application entrypoint, CORS & DB initialization
│       ├── core/
│       │   └── database.py         # Synchronous SQLModel engine & session generator
│       ├── models/
│       │   ├── mission.py          # Mission & MissionItem SQLModel table entities
│       │   ├── volunteer.py        # VolunteerOffer & VolunteerCommitment entities
│       │   ├── ngo.py              # NGOPartner entity with JSON fleet & zone arrays
│       │   └── giver.py            # GiverUser entity for donor authentication
│       ├── schemas/
│       │   ├── decomposition.py    # Pydantic schemas for Gemini text plea parsing
│       │   ├── mission.py          # Mission broadcast request & response schemas
│       │   ├── sentinel.py         # Visual SOS audit request & response models
│       │   └── volunteer.py        # Volunteer offer & roster DTOs
│       ├── services/
│       │   ├── gemini_service.py   # Gemini 3.5 Flash text decomposition client
│       │   ├── sentinel_service.py # Gemini 3.5 Flash vision & ElevenLabs voice engine
│       │   └── mission_service.py  # Mission persistence & SQLModel query logic
│       └── api/v1/
│           ├── router.py           # Unified APIRouter aggregator
│           └── endpoints/
│               ├── decompose.py    # POST /api/v1/aid/decompose
│               ├── missions.py     # POST /broadcast, GET /feed, /donate-sol, /items/claim
│               ├── volunteers.py   # POST /standby, GET /capacity-roster, /commit-item
│               ├── sentinel.py     # GET /calm-audio, POST /audit-broadcast
│               ├── ngo.py          # POST /login, POST /onboard, GET /directory
│               ├── giver_auth.py   # POST /signup, POST /login, GET /verify-session
│               └── admin.py        # POST /login, GET /metrics, POST /snowflake/sync
└── frontend/
    ├── Dockerfile                  # Node 18 Alpine multi-stage container
    ├── package.json                # Next.js 14, Tailwind, Lucide, Solana Web3 dependencies
    ├── tailwind.config.ts          # Tailwind CSS theme extensions & custom palette
    └── src/
        ├── components/
        │   ├── GiverGate.tsx       # Auth modal gate for Giver portal access
        │   └── NGOGate.tsx         # Auth modal gate for NGO distress broadcast
        └── app/
            └── (portal)/
                ├── layout.tsx      # Global sticky navbar & footer shell
                ├── globals.css     # Design tokens, background grid patterns & utilities
                ├── page.tsx        # Homepage hero & live mission ticker
                ├── ngo/page.tsx    # NGO Need Decomposer with Gemini 3.5 Flash
                ├── onboard/page.tsx# 4-step NGO partner onboarding wizard
                ├── givers/page.tsx # Giver matching, voice intake & SOL micro-donations
                ├── live-grid/page.tsx # Real-time mission grid & volunteer capacity roster
                ├── sos/page.tsx    # Live Sentinel SOS camera stream & ElevenLabs guidance
                ├── partners/page.tsx # Verified partner directory from PostgreSQL
                ├── admin/page.tsx  # Auditor dashboard with Snowflake Cortex analytics
                ├── how-it-works/page.tsx # 5-phase visual architecture walkthrough
                └── contact/page.tsx# Operations dispatch & emergency hotlines
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.