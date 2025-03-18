# Murder Mystery AI

An interactive murder mystery game where you interrogate AI suspects using your voice and solve the case by finding the real culprit.

## Features

- **Voice-Powered Interrogation**: Natural voice conversations with AI suspects
- **Dynamic Characters**: Multiple suspects with unique personalities, backgrounds, and secrets
- **Accusation System**: Make accusations when you think you've solved the case
- **Responsive UI**: Clean, modern interface that works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Voice Interface**: LiveKit SDK for real-time audio
- **AI Backend**: Python-based agent using OpenAI, Deepgram, and Cartesia
- **Speech Technologies**: Speech-to-text, text-to-speech, voice activity detection

## Project Structure

```
MurderMysteryAI/
├── frontend/         # Next.js application
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable React components
│   ├── data/         # Game data and state
│   └── public/       # Static assets
├── agent/            # Python backend
│   └── agent.py      # Main agent logic
└── memory-bank/      # Project documentation
    ├── architecture.md
    ├── game-design-document.md
    └── tech-stack.md
```

## Getting Started

### Prerequisites

- Node.js (18.x or higher)
- Python (3.9 or higher)
- pnpm (recommended) or npm
- API keys for:
  - LiveKit
  - OpenAI
  - Deepgram
  - Cartesia

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Create a `.env.local` file with your LiveKit credentials:

```
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"
LIVEKIT_URL="your_livekit_url"
```

4. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The frontend will be available at http://localhost:3000

### Agent Setup

1. Navigate to the agent directory:

```bash
cd agent
```

2. Create a Python virtual environment:

```bash
# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
venv\Scripts\activate
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Download required model files (important):

```bash
python3 agent.py download-files
```

5. Create a `.env.local` file with your API credentials:

```
CARTESIA_API_KEY="your_cartesia_api_key"
DEEPGRAM_API_KEY="your_deepgram_api_key"
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"
LIVEKIT_URL="your_livekit_url"
OPENAI_API_KEY="your_openai_api_key"
```

6. Start the agent:

```bash
# For development with auto-reload
python3 agent.py dev

# For production
python3 agent.py start
```

## Troubleshooting

### "Could not find model livekit/turn-detector" Error

If you encounter this error, you need to download the model files:

```bash
python3 agent.py download-files
```

This command downloads the required files for the turn detector model to `~/.cache/huggingface/`.

### Architecture Compatibility Issues

If you're using a Mac with Apple Silicon (M1/M2/M3) and encounter architecture-related errors with `psutil`, reinstall it with:

```bash
python3 -m pip install --force-reinstall --no-binary :all: psutil==5.9.8
```

## Deployment

Detailed deployment instructions can be found in the [deployment guide](memory-bank/deployment-guide.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- LiveKit for their excellent SDK
- OpenAI for the language model capabilities
- Deepgram and Cartesia for speech technologies

<p className="text-gray-300 mb-4">
    Tech mogul Thomas Richardson has been found dead in his office at TechVision headquarters. Four suspects were in the building that night, each with their own motives.
</p>
