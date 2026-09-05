<div align="center">

# 🌐 KindLink: The Autonomous Generosity Grid

**AI-Orchestrated Crisis Response • Semantic Mutual Aid Matching • Verifiable On-Chain Disaster Relief**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Conversational_AI-black?style=for-the-badge&logo=elevenlabs&logoColor=white)](https://elevenlabs.io/)
[![Solana](https://img.shields.io/badge/Solana-Actions_%26_cNFTs-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com/)
[![Snowflake Cortex](https://img.shields.io/badge/Snowflake-Cortex_AI-29B5E8?style=for-the-badge&logo=snowflake&logoColor=white)](https://www.snowflake.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <a href="#-architecture--system-overview">Architecture</a> •
  <a href="#-sponsor-integrations">Sponsor Integrations</a> •
  <a href="#-core-operational-flows">Operational Flows</a> •
  <a href="#-3-command-quickstart">Quickstart</a> •
  <a href="#-service-endpoints">Endpoints</a> •
  <a href="#-repository-structure">Structure</a>
</p>

</div>

---

## 📌 Overview

**KindLink** is an autonomous crisis response and generosity grid. It transforms raw, unstructured community distress pleas into real-time operational units, semantic giver-matching missions, and verifiable on-chain disaster relief rails.

By bridging multimodal AI understanding, ultra-low-latency voice interfaces, high-throughput blockchain micro-grants, and enterprise-grade data warehouse analytics, KindLink removes human bottlenecks in disaster relief logistics.

---

## 🏗️ Architecture & System Overview

KindLink connects frontline crisis zones with local resources and micro-funding through four core sponsor integrations:

```text
              ┌──────────────────────────────────────────────┐
              │          KindLink Web Portal                 │
              │   (Next.js 14 • TypeScript • Tailwind)       │
              └───────────────┬──────────────────────────────┘
                              │ JSON / WebSocket / WebRTC
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Grid Engine                             │
│                                                                        │
│   ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
│   │ Google Gemini 2.5  │ │ ElevenLabs Voice   │ │ Solana Devnet      │  │
│   │ Flash Multimodal   │ │ Conversational AI  │ │ Blinks & cNFTs     │  │
│   │ Triage & SKU Split │ │ Lifeline Audio TTS │ │ Micro-Grant Escrow │  │
│   └────────────────────┘ └────────────────────┘ └────────────────────┘  │
│                                  │                                     │
│                     ┌────────────┴─────────────┐                       │
│                     │ Snowflake Cortex         │                       │
│                     │ Warehouse Elasticity &   │                       │
│                     │ Macro Triage Directives  │                       │
│                     └──────────────────────────┘                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Sponsor Integrations

| Technology | Integration Role & Capabilities |
| :--- | :--- |
| **Google Gemini 2.5 Flash** | Ingests raw voice transcripts, textual distress pleas, and live camera snapshot frames (`image/jpeg`). Performs structured extraction into Pydantic models (decomposing ambiguous pleas into verifiable itemized SKUs: meals, potable water, medical units, transport vans) and conducts automated visual hazard audits (flood depth estimation, structural risks, victim counts). |
| **ElevenLabs Conversational AI** | Generates low-latency, empathetic voice intake prompts for givers and delivers immediate 20-word spoken safety guidance directives to stranded individuals during emergency SOS alerts. |
| **Solana (Actions, Blinks & cNFTs)** | Powers instant, one-click micro-grants via dialect-compatible Solana Actions/Blinks for instant gas/fuel sponsorship, and mints compressed NFTs (cNFTs) as immutable, tamper-proof impact receipts on Devnet. |
| **Snowflake Cortex** | Powers the macro-triage administrative dashboard, calculating grid elasticity indices, tracking supply deficit velocity, and returning dynamic inventory allocation directives across active disaster nodes. |

---

## 🔄 Core Operational Flows

### 1. 🆘 NGO Need Decomposer (`/ngo`)
* **Input:** Ingests high-stress, natural-language crisis messages *(e.g., "We have 120 people trapped in Sector 4 school; no drinking water and power is out")*.
* **Processing:** Gemini 2.5 Flash extracts priority levels, location context, and converts the plea into measurable SKU items with real-time target meters.

### 2. 🤝 Giver Voice Intake & Semantic Matching (`/givers` & `/givers/matches`)
* **Input:** Givers register available resources (vehicles, time, supplies, technical skills) via ElevenLabs Conversational Voice or quick manual input.
* **Processing:** The matching engine scores proximity, capacity, and critical campaign deficits to produce ranked mission recommendation cards.

### 3. 🚨 Live Sentinel SOS (`/sos`)
* **Input:** Real-time camera feed captures field conditions and extracts GPS telemetry.
* **Processing:** Vision AI triages physical hazards (water level, structural risk, crowd count) and ElevenLabs streams a spoken safety directive.

### 4. 🔗 Dual-Rail Fulfillment & Cryptographic Verification (`/checkout` & `/impact`)
* **Solana Blink Rail:** Allows instant devnet SOL micro-donations directly via shareable action URLs.
* **Volunteer QR Pass:** Generates verifiable offline passes for volunteer checkpoints and physical dispatch verification.
* **cNFT Proof of Impact:** Issues an on-chain receipt linking volunteer execution to the donor's wallet.

### 5. 📊 Macro Triage & Elasticity Dashboard (`/admin`)
* **Input:** Multi-node crisis telemetry and relief inventory states across regional grids.
* **Processing:** Snowflake Cortex computes grid elasticity indices, supply deficit velocity, and automated inter-node redistribution recommendations.

---

## 🚀 3-Command Quickstart (Local Evaluation)

> [!NOTE]
> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone & Enter Directory
```bash
git clone https://github.com/your-org/KINDLINK-The-Autonomous-Generosity-Grid.git
cd KINDLINK-The-Autonomous-Generosity-Grid
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(By default, `MOCK_SERVICES=true` is enabled in `.env` so you can test all screens and API flows without live API keys).*

### 3. Build & Boot the Grid
```bash
docker compose up --build
```
*Or run in detached mode with `make up`.*

---

## 🌐 Service Endpoints & Verification

| Service | Endpoint URL | Purpose |
| :--- | :--- | :--- |
| **Frontend Web Portal** | [`http://localhost:3000`](http://localhost:3000) | 9-screen Next.js crisis and generosity dashboard |
| **Backend Swagger UI** | [`http://localhost:8000/docs`](http://localhost:8000/docs) | Interactive OpenAPI documentation & live playground |
| **Backend ReDoc** | [`http://localhost:8000/redoc`](http://localhost:8000/redoc) | Static specification viewer |
| **System Health Probe** | [`http://localhost:8000/health`](http://localhost:8000/health) | Container readiness and engine heartbeat |

---

## 📂 Repository Structure

```text
.
├── docker-compose.yml        # Multi-container orchestration (FastAPI + Next.js)
├── .env.example              # Blueprint environment variables
├── .env                      # Local runtime secrets & configuration
├── Makefile                  # Developer CLI shortcuts
├── backend/
│   ├── Dockerfile            # Python container definition
│   ├── requirements.txt      # Core backend dependencies
│   └── src/
│       ├── main.py           # ASGI entrypoint & CORS configuration
│       ├── core/             # Settings (pydantic-settings), security, logging
│       ├── schemas/          # Pydantic v2 DTOs & Gemini response contracts
│       ├── services/         # Gemini, ElevenLabs, Solana & Snowflake clients
│       └── api/v1/           # Modular REST routers & endpoints
└── frontend/
    ├── Dockerfile            # Node container definition
    ├── package.json          # Next.js 14, Lucide, Tailwind, Solana Web3
    └── src/
        ├── app/              # Portal screens mapped to Next.js routes
        ├── components/       # Flow-specific UI widgets & alert components
        └── hooks/            # Camera feed, GPS geolocation, and audio hooks
```

---

## 🛠️ Developer CLI Shortcuts (`Makefile`)

If you have `make` installed:

```bash
make up             # Start all containers in background (-d)
make down           # Stop and tear down running containers
make restart        # Restart all containers
make logs           # Stream combined logs from all services
make logs-backend   # Stream backend logs only
make logs-frontend  # Stream frontend logs only
make shell-backend  # Open interactive bash inside backend container
make shell-frontend # Open interactive shell inside frontend container
make test           # Run backend & frontend test suites
make clean          # Prune dangling containers, volumes & images
```

---

## ⚙️ Environment Variables Reference

| Variable | Default / Example | Purpose |
| :--- | :--- | :--- |
| `MOCK_SERVICES` | `true` | When `true`, enables zero-API-key sandbox mode with mock responses |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Google Gemini 2.5 Flash API authentication key |
| `ELEVENLABS_API_KEY` | `your_elevenlabs_key` | ElevenLabs API key for lifelike conversational audio |
| `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` | `your_agent_id` | ElevenLabs conversational widget agent ID |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | `https://api.devnet.solana.com` | Solana Devnet cluster RPC endpoint |
| `MISSION_ESCROW_WALLET` | `ComputeBudget111...` | Target escrow public key for micro-grants |
| `SNOWFLAKE_ACCOUNT` | `your_account_id` | Snowflake account locator for Cortex macro-analytics |
| `SNOWFLAKE_USER` | `your_user` | Snowflake authentication username |
| `SNOWFLAKE_PASSWORD` | `your_password` | Snowflake authentication password |
| `SNOWFLAKE_DATABASE` | `KINDLINK_DB` | Snowflake target database |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.