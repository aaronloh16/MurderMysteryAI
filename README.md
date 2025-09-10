# Murder Mystery AI

![Murder Mystery AI Interface](frontend/data/image.png)

A voice-powered murder mystery game where players interrogate AI suspects through natural conversation to solve complex cases. Built to explore the intersection of conversational AI, real-time voice processing, and interactive storytelling.

## Overview

Players use voice commands to question AI-driven suspects, each with distinct personalities, backstories, and secrets. The game combines speech recognition, natural language processing, and text-to-speech to create immersive interrogation experiences that adapt to player questioning styles.

## Technical Features

**Real-Time Voice Processing**
- Bidirectional voice communication with sub-200ms latency
- Voice activity detection and conversation turn management
- Multi-speaker audio processing and isolation

**AI-Driven Characters**
- Dynamic personality modeling with persistent memory systems
- Context-aware response generation maintaining character consistency
- Adaptive dialogue that responds to investigation patterns

**Game Logic**
- Evidence tracking and deduction scoring algorithms
- Multi-path narrative branching based on player choices
- Real-time accusation validation and case resolution

## Architecture

**Frontend**: Next.js with TypeScript, real-time audio via LiveKit SDK
**Voice Pipeline**: Deepgram (STT) → OpenAI (LLM) → Cartesia (TTS)
**Infrastructure**: Python-based agent system with WebRTC for low-latency communication

## Quick Start

### Prerequisites
```bash
Node.js 18+, Python 3.9+, pnpm
API keys: LiveKit, OpenAI, Deepgram, Cartesia
```

### Setup
```bash
# Frontend
cd frontend && pnpm install
# Add LiveKit credentials to .env.local
pnpm dev

# Agent
cd agent && python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 agent.py download-files
# Add API credentials to .env.local
python3 agent.py dev
```

Access at `http://localhost:3000`

---

**Built to explore voice AI applications in interactive media and test real-time conversation systems at scale.**
