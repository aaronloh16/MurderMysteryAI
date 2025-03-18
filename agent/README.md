<a href="https://livekit.io/">
  <img src="./.github/assets/livekit-mark.png" alt="LiveKit logo" width="100" height="100">
</a>

# Python Voice Agent

<p>
  <a href="https://cloud.livekit.io/projects/p_/sandbox"><strong>Deploy a sandbox app</strong></a>
  •
  <a href="https://docs.livekit.io/agents/overview/">LiveKit Agents Docs</a>
  •
  <a href="https://livekit.io/cloud">LiveKit Cloud</a>
  •
  <a href="https://blog.livekit.io/">Blog</a>
</p>

# Murder Mystery AI - Voice Agent

This is the voice agent backend for the Murder Mystery AI game. It handles the AI character responses and voice interactions.

## Features

- Voice-powered AI characters with distinct personalities
- Dynamic response generation based on character profiles
- Real-time speech-to-text and text-to-speech conversion
- Room-based interactions through LiveKit

## Tech Stack

- **Python 3.9+**: Core programming language
- **LiveKit Agents**: Framework for voice agent development
- **OpenAI GPT-4**: AI model for character responses
- **Deepgram**: Speech-to-text conversion
- **Cartesia**: Text-to-speech conversion
- **Silero**: Voice activity detection
- **Turn Detector**: End-of-utterance prediction model

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- API keys for OpenAI, Deepgram, Cartesia, and LiveKit

### Installation

1. Create a virtual environment:

   ```bash
   # For macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # For Windows
   python -m venv venv
   venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Download required model files (important!):

   ```bash
   python3 agent.py download-files
   ```

   This downloads the turn detector model to your local cache.

4. Create a `.env.local` file with your API keys:
   ```
   CARTESIA_API_KEY="your_cartesia_api_key"
   DEEPGRAM_API_KEY="your_deepgram_api_key"
   LIVEKIT_API_KEY="your_livekit_api_key"
   LIVEKIT_API_SECRET="your_livekit_api_secret"
   LIVEKIT_URL="your_livekit_url"
   OPENAI_API_KEY="your_openai_api_key"
   API_BASE_URL=http://localhost:3000/api
   ```

### Running the Agent

Start the agent in development mode (with auto-reload):

```bash
python3 agent.py dev
```

Or in production mode:

```bash
python3 agent.py start
```

## Troubleshooting

### "Could not find model livekit/turn-detector" Error

If you see this error, run:

```bash
python3 agent.py download-files
```

## Commands

- `python3 agent.py dev`: Start in development mode
- `python3 agent.py start`: Start in production mode
- `python3 agent.py connect`: Connect to a specific room
- `python3 agent.py download-files`: Download required model files

## How It Works

1. The agent connects to a LiveKit room
2. When a user speaks, the speech is converted to text using Deepgram
3. The text is sent to OpenAI's GPT-4 with the character's profile as context
4. GPT-4 generates a response in the character's voice
5. The response is converted to speech using Cartesia
6. The speech is played back to the user

