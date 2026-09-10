# VoiceShield - Containerization & Docker Setup

This directory contains containerization scripts, Dockerfiles, and deployment specifications for VoiceShield services.

## Containers Breakdown

- **PostgreSQL**: Local persistent relational store (`postgres:16-alpine`) managed via `docker-compose.yml`.
- **Backend Service** *(Future)*: Containerized FastAPI app hosting API endpoints and audio WebSocket streaming listeners.
- **Frontend Service** *(Future)*: Containerized Next.js production build with standalone web server.
