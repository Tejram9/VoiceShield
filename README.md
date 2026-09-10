# VoiceShield 🛡️🎙️

**VoiceShield** is a near-real-time voice impersonation risk and prevention system designed to protect individuals and organizations against AI-driven voice deepfakes, synthetic speech spoofing, and social engineering attacks.

---

## Core Architecture Flow

```text
Live Audio Input
  │
  ├──► Voice Clone / Audio Spoof Detection  ─────┐
  │                                              │
  ├──► Speaker Verification (Embedding Match) ───┼──► Risk Fusion Engine
  │                                              │           │
  ├──► Speech-to-Text (Whisper ASR)             │           ├──► Low / Medium / High Risk Level
  │       │                                      │           ├──► User Alerting System
  │       └──► Social Engineering / NLP Analysis ┘           └──► Multi-Factor Verification Workflow
  │
  └──► Context Signals (Caller ID, Metadata, Geolocation)
```

---

## Frozen Technology Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python 3.11+, FastAPI, Pydantic, WebSockets (Uvicorn)
- **AI**: Whisper (ASR), Pretrained Speaker Verification Model, Pretrained Audio Spoof/Deepfake Detection Model, LLM + NLP Engine
- **Database**: PostgreSQL 16
- **Deployment & Orchestration**: Docker, Docker Compose

---

## Repository Structure

```text
VoiceShield/
├── frontend/        # Next.js 15 + TypeScript + Tailwind CSS application
├── backend/         # FastAPI Python application with WebSocket endpoints
├── ai/              # AI/ML pipeline modules (ASR, Spoof Detection, Speaker Verification, NLP)
├── data/            # Local datasets, reference voice samples, and test audio clips
├── database/        # PostgreSQL schema migration scripts and documentation
├── docker/          # Dockerfiles and container orchestration configurations
├── docs/            # Architecture diagrams, API specifications, and design docs
├── .env.example     # Environment variable template
├── .gitignore       # Git ignore rules
├── docker-compose.yml # Local development database service container configuration
└── README.md        # Main repository documentation
```

---

## Implementation Status

> [!NOTE]
> **Current Status**: Foundation Initialization Phase.
> Only the skeleton configuration, Next.js frontend starter, FastAPI backend foundation (`GET /health`), Docker Compose PostgreSQL definition, and directory layout are initialized.
> **AI models, Whisper ASR, speaker verification, spoof detection, LLM analysis, risk fusion engine, database schemas, and live WebSockets are not yet implemented.**

---

## Local Development Prerequisites

- **Node.js**: v18+ (Node v24 recommended)
- **Python**: 3.11+ (Python 3.14+ supported)
- **Docker & Docker Compose**: (Optional for local PostgreSQL)

---

## Getting Started

### 1. Database Setup (Docker)

Start the PostgreSQL service container locally:

```bash
docker-compose up -d postgres
```

### 2. Backend Setup (FastAPI)

Navigate to the `backend/` directory:

```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Verify backend health:
```bash
curl http://localhost:8000/health
```

### 3. Frontend Setup (Next.js)

Navigate to the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Intended Future Development Sequence

1. **Database Schema & Migrations**: Define entities for users, sessions, calls, voice profiles, and risk scores.
2. **Audio Processing Pipeline**: Establish WebSocket stream ingestion for real-time PCM audio chunks.
3. **AI Core Ingestion**:
   - Integrate Whisper ASR for real-time speech transcription.
   - Implement speaker verification embedding comparisons.
   - Deploy audio spoof detection classifier.
4. **NLP & Social Engineering Classifier**: Analyze transcriptions for high-risk urgency and financial triggers.
5. **Risk Fusion Engine & Threshold Router**: Combine multi-signal scores into Low, Medium, and High risk classifications.
6. **Frontend Dashboard & Verification Workflows**: Display real-time risk gauges, alerts, and interactive verification prompts.
