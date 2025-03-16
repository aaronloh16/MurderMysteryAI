# Murder Mystery AI

An interactive murder mystery game where you interrogate AI suspects using your voice and solve the case by finding the real culprit.

## Features

- **Voice-Powered Interrogation**: Natural voice conversations with AI suspects
- **Dynamic Characters**: Multiple suspects with unique personalities, backgrounds, and secrets
- **Evidence Collection**: Uncover clues through strategic questioning
- **Accusation System**: Make accusations when you think you've solved the case
- **Responsive UI**: Clean, modern interface that works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Voice Interface**: LiveKit SDK for real-time audio
- **AI Backend**: Python-based agent using OpenAI, Deepgram, and Cartesia
- **Speech Technologies**: Speech-to-text, text-to-speech, voice activity detection

## Getting Started

### Prerequisites

- Node.js (18.x or higher)
- Python (3.9 or higher)
- pnpm (recommended) or npm
- API keys for LiveKit, OpenAI, Deepgram, and Cartesia

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/murder-mystery-ai.git
cd murder-mystery-ai
```

2. Install frontend dependencies:

```bash
cd frontend
pnpm install
```

3. Install backend dependencies:

```bash
cd ../agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Create environment files:

Frontend (`.env.local`):

```
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"
LIVEKIT_URL="your_livekit_url"
```

Backend (`.env.local`):

```
CARTESIA_API_KEY="your_cartesia_api_key"
DEEPGRAM_API_KEY="your_deepgram_api_key"
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"
LIVEKIT_URL="your_livekit_url"
OPENAI_API_KEY="your_openai_api_key"
```

5. Start development servers:

Frontend:

```bash
cd frontend
pnpm dev
```

Backend (in a separate terminal):

```bash
cd agent
source venv/bin/activate  # On Windows: venv\Scripts\activate
python agent.py
```

Visit http://localhost:3000 to start playing!

## Deployment Options

### Deployment Without a Database

This application can be deployed without a database as it currently doesn't require persistent storage between sessions. Here's how to deploy it:

#### Frontend (Vercel/Netlify)

1. Push your code to a GitHub repository
2. Connect your repository to Vercel or Netlify
3. Set the environment variables in the deployment platform
4. Deploy!

#### Backend (Cloud Options)

The agent backend can be deployed in several ways:

**Option 1: LiveKit Cloud**

- Sign up for [LiveKit Cloud](https://livekit.io/cloud)
- Deploy your agent there directly

**Option 2: Self-hosted on VPS/EC2**

- Set up a VM on AWS EC2, DigitalOcean, etc.
- Install Python and dependencies
- Run the agent with PM2 or a similar process manager

**Option 3: Containerized with Docker**

- Create a Dockerfile for the agent
- Deploy to a container service like ECS, GKE, etc.

### Adding a Database (Future Enhancement)

For enhanced functionality, you might want to add a database later:

- **User Accounts**: Allow players to save progress
- **Game History**: Track previous playthroughs
- **Leaderboards**: Compare solving times
- **Custom Cases**: Create and share custom mysteries

Recommended database options:

- Supabase (Postgres-based, easy to integrate)
- Firebase (NoSQL, good for rapid development)
- MongoDB Atlas (document database, flexible schema)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- LiveKit for their excellent SDK
- OpenAI for the language model capabilities
- Deepgram and Cartesia for speech technologies

<p className="text-gray-300 mb-4">
    Tech mogul Thomas Richardson has been found dead in his office at TechVision headquarters. Four suspects were in the building that night, each with their own motives.
</p>
