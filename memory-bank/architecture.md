# Murder Mystery AI Architecture

This document outlines the architecture of the Murder Mystery AI game, including file structure, component relationships, and data flow.

## Project Structure

```
MurderMysteryAI/
├── frontend/                      # Next.js frontend application
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Landing page
│   │   ├── story/                 # Story overview page
│   │   │   └── page.tsx
│   │   ├── interrogate/           # Interrogation pages
│   │   │   └── [suspectId]/       # Dynamic route for each suspect
│   │   │       └── page.tsx
│   │   └── api/                   # API routes
│   │       └── connection-details/ # LiveKit connection API
│   │           └── route.ts
│   ├── components/                # Reusable React components
│   │   ├── interrogation/         # Interrogation-specific components
│   │   │   ├── SimpleVoiceAssistant.tsx
│   │   │   ├── ControlBar.tsx
│   │   │   └── AccusationButton.tsx (to be implemented)
│   │   ├── suspects/              # Suspect-related components
│   │   │   └── SuspectCard.tsx
│   │   ├── story/                 # Story-related components
│   │   │   └── StoryCard.tsx
│   │   ├── evidence/              # Evidence-related components (to be implemented)
│   │   │   └── EvidenceList.tsx
│   │   ├── NoAgentNotification.tsx
│   │   └── CloseIcon.tsx
│   ├── data/                      # Data files
│   │   └── suspects.ts            # Suspect information
│   ├── utils/                     # Utility functions
│   │   └── deviceFailure.ts       # Error handling for media devices
│   └── public/                    # Static assets
│       └── images/                # Images including suspect photos
│           └── suspects/
│               ├── alex.webp
│               └── sarah.webp
├── agent/                         # Python backend
│   ├── agent.py                   # Main agent logic
│   ├── requirements.txt           # Python dependencies
│   └── .env.local                 # Environment variables for backend
└── memory-bank/                   # Project documentation
    ├── game-design-document.md    # Game design specifications
    ├── tech-stack.md              # Technology choices
    ├── implementation-plan.md     # Development roadmap
    ├── architecture.md            # This document
    └── progress.md                # Development progress
```

## Component Hierarchy

### Frontend Components

```
App
├── LandingPage (app/page.tsx)
├── StoryPage (app/story/page.tsx)
│   ├── StoryCard
│   └── SuspectCard(s)
└── InterrogationPage (app/interrogate/[suspectId]/page.tsx)
    ├── SimpleVoiceAssistant
    ├── ControlBar
    ├── RoomAudioRenderer
    ├── NoAgentNotification
    └── AccusationButton
```

### Backend Components

```
LiveKit Server
└── MurderMysteryAgent
    ├── Speech-to-Text (Deepgram)
    ├── Language Model (GPT-4)
    ├── Text-to-Speech (Cartesia)
    └── Voice Activity Detection (Silero)
```

## Data Flow

### User Journey Flow

1. User lands on the landing page
2. User clicks "Begin Investigation" to navigate to the story page
3. User reviews the story and suspects
4. User clicks on a suspect to navigate to the interrogation page
5. User starts a conversation with the suspect
6. User collects evidence during the interrogation
7. User makes an accusation
8. Game provides feedback on the accusation

### Voice Interaction Flow

1. User speaks into microphone
2. LiveKit captures audio and sends to agent
3. Agent processes audio through speech-to-text
4. Text is sent to language model with suspect context
5. Language model generates response
6. Response is converted to speech
7. Speech is played back to user

### Evidence Collection Flow (To Be Implemented)

1. Agent identifies key information in conversation
2. Key information is tagged as evidence
3. Evidence is stored in game state
4. Evidence is displayed on the story page
5. Contradictions between evidence items are highlighted

### Accusation Flow (Implemented)

1. User clicks the accusation button below the voice interface
2. User confirms the accusation in the confirmation dialog
3. System checks if the accused suspect has the `isGuilty` flag set to true
4. System displays feedback based on the accusation result:
   - Correct accusation: Green success message
   - Incorrect accusation: Red error message
5. User can continue the investigation after receiving feedback

## State Management

### Current State

- **Suspect Selection**: URL parameter (`suspectId`)
- **Agent State**: Component state in InterrogationPage
- **Connection Details**: Component state in InterrogationPage

### Planned State Management

- **Game State**: React Context for global state
  - Evidence collection
  - Conversation history
  - Game progress
  - Accusation status

## API Integration

### LiveKit Integration

- **Connection Details API**: Generates tokens for LiveKit rooms
- **Room Creation**: Each interrogation creates a unique room
- **Metadata**: Suspect context is passed through room metadata

### OpenAI Integration

- **GPT-4 API**: Used by the agent for language understanding and generation
- **Prompt Engineering**: Suspect personality and context is injected into prompts

## Error Handling

- **Media Device Failures**: Handled by `onDeviceFailure` utility
- **Connection Errors**: Currently being debugged (401 errors)
- **Agent Errors**: Basic logging implemented, needs enhancement

## Future Architecture Considerations

- **Server-Side Rendering**: For improved SEO and initial load performance
- **Progressive Web App**: For offline support and mobile installation
- **Database Integration**: For saving game progress
- **User Authentication**: For multi-user support
- **Analytics**: For tracking player behavior and game balancing
