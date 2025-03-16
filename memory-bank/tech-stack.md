# Murder Mystery AI Tech Stack

## Frontend

- **Next.js**: React framework using App Router for page structure and navigation
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for UI transitions

## Backend

- **Python**: For agent logic and AI integrations
- **LiveKit**: Real-time communication platform
- **LiveKit Agents**: Voice pipeline implementation

## AI Services

- **OpenAI GPT-4**: Large language model for realistic character responses
- **Deepgram**: Speech-to-Text service for voice recognition
- **Cartesia**: Text-to-Speech service for AI voice generation
- **Silero**: Voice Activity Detection for determining when the user is speaking

## Development Tools

- **ESLint**: JavaScript and TypeScript linting
- **pnpm**: Package manager for Node.js dependencies
- **Git**: Version control system
- **Cursor**: AI-enhanced code editor with Claude integration

## Environment & Deployment

- **Docker**: For running the LiveKit server locally
- **dotenv**: For managing environment variables

## APIs & Integrations

- **LiveKit Server**: WebRTC infrastructure for real-time audio
- **LiveKit Client SDK**: JavaScript client for LiveKit
- **LiveKit Server SDK**: For token generation and room management

## Project Structure

```
MurderMysteryAI/
├── frontend/         # Next.js application
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable React components
│   ├── data/         # Game data and state
│   └── public/       # Static assets
└── agent/            # Python backend
    └── agent.py      # Main agent logic
```

## Key Dependencies

- **@livekit/components-react**: UI components for LiveKit
- **@livekit/components-styles**: Styling for LiveKit components
- **livekit-client**: LiveKit client library
- **livekit-server-sdk**: Server-side token generation

## Configuration

- **.env.local**: Environment variables for API keys and URLs
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
