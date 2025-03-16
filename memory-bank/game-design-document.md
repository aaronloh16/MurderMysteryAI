# Game Design Document: Murder Mystery AI

## Table of Contents

1. [Game Overview](#game-overview)
2. [Core Mechanics](#core-mechanics)
3. [Characters](#characters)
4. [Evidence System](#evidence-system)
5. [How to Win](#how-to-win)
6. [UI/UX](#uiux)
7. [Tech Stack](#tech-stack)
8. [LiveKit Integration](#livekit-integration)
9. [Development Plan](#development-plan)

---

## Game Overview

**Murder Mystery AI** is an interactive detective game where players solve a murder by interrogating AI suspects using natural voice conversation. The game leverages advanced AI to create realistic interrogation experiences where suspects can reveal clues, contradict themselves, or hide information based on questioning techniques.

- **Story**: Thomas Richardson, a wealthy businessman, was found dead in his study with a single gunshot wound. The murder weapon is missing, and several suspects were present at the time of the murder. As the detective, you must interrogate the suspects to determine who is guilty.

---

## Core Mechanics

### Voice Interrogation

- Players use real-time voice conversation to question suspects
- AI responds naturally based on character profiles and hidden information
- Suspects may reveal clues under pressure or become defensive about sensitive topics
- Conversation history is tracked to maintain context

### Evidence Collection

- Information gathered during interrogations becomes evidence
- Contradictions between testimonies are highlighted
- Evidence is displayed on the story page for reference

### Accusation System

- Players can accuse a suspect when they believe they have sufficient evidence
- The game evaluates the accusation based on the guilty suspect (Alex)
- Feedback is provided on whether the accusation was correct

---

## Characters

We currently have two implemented suspects:

### Alex Thompson

- **Role**: Business Partner
- **Description**: A long-time business partner with a recent falling out
- **Background**: Co-founded the company with Thomas 15 years ago
- **Personality**: Ambitious and calculating, but maintains a friendly facade
- **Alibi**: Claims to have been in a business call during the time of murder
- **Secrets**:
  - Recently discovered Thomas was planning to sell the company without consulting him
  - Has been secretly moving company assets
- **Status**: Guilty (implemented but hidden from player)

### Sarah Richardson

- **Role**: Victim's Wife
- **Description**: The victim's wife who stands to inherit his fortune
- **Background**: Married to Thomas for 8 years, second marriage
- **Personality**: Sophisticated and composed, with underlying stress
- **Alibi**: Says she was in the garden during the murder
- **Secrets**:
  - Recently updated her husband's life insurance policy
  - Has been meeting with a divorce lawyer
- **Status**: Innocent

---

## Evidence System

The evidence system tracks information revealed during interrogations:

### Evidence Types

- **Direct Statements**: What suspects say about themselves
- **Contradictions**: When statements conflict with other evidence
- **Physical Evidence**: References to objects or locations
- **Alibis**: Where suspects claim to have been

### Evidence Collection

- Evidence is automatically tracked during conversations
- Key revelations are added to the evidence list
- Contradictions are highlighted when detected

### Evidence Display

- Evidence is shown on the story page
- Organized by suspect and type
- Contradictions are visually emphasized

---

## How to Win

1. **Gather Evidence**: Interrogate suspects to collect information
2. **Identify Contradictions**: Find inconsistencies in testimonies
3. **Make an Accusation**: Use the accusation button on a suspect's page
4. **Win Condition**: Correctly accusing Alex Thompson with sufficient evidence
5. **Lose Condition**: Accusing an innocent suspect (Sarah)

---

## UI/UX

### Landing Page

- Title and atmospheric introduction
- "Begin Investigation" button
- Simple, focused design

### Story & Suspects Page

- Two-column layout:
  - Left: Story narrative with case details
  - Right: Suspect cards with basic information
- Evidence list below the story (to be implemented)
- Clean, intuitive navigation

### Interrogation Page

- Split-screen layout:
  - Left: Suspect image and basic information
  - Right: Voice interaction interface
- Voice visualization during conversation
- Connection controls (start/stop conversation)
- Accusation button (to be implemented)
- Back navigation to story page

---

## Tech Stack

### Frontend

- **Next.js**: App router for page structure and navigation
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Styling and responsive design
- **Framer Motion**: Animations for UI elements

### Backend

- **Python**: Agent logic and AI processing
- **LiveKit Agents**: Voice pipeline and real-time communication

### AI Services

- **OpenAI GPT-4**: Language model for suspect responses
- **Deepgram**: Speech-to-Text processing
- **Cartesia**: Text-to-Speech for suspect voices
- **Silero**: Voice Activity Detection

---

## LiveKit Integration

The LiveKit integration handles real-time voice communication:

### Voice Pipeline

1. **Voice Input**: User speaks into microphone
2. **Speech-to-Text**: Deepgram converts speech to text
3. **AI Processing**: GPT-4 generates response based on suspect context
4. **Text-to-Speech**: Cartesia converts text to speech
5. **Audio Output**: Response is played to user

### Room Management

- Each interrogation creates a unique LiveKit room
- Suspect context is passed through room metadata
- Connection details are generated via API route

### Agent States

- **Disconnected**: Before conversation starts
- **Connecting**: Establishing connection
- **Listening**: Waiting for user input
- **Thinking**: Processing user input
- **Speaking**: Delivering response

---

## Development Plan

### Phase 1: Core Functionality (Completed)

- ✅ Set up Next.js project structure
- ✅ Implement LiveKit integration
- ✅ Create basic UI for landing, story, and interrogation pages
- ✅ Set up Python agent with voice pipeline
- ✅ Implement basic suspect profiles

### Phase 2: Enhanced Interrogation (Current)

- ⬜ Implement suspect-specific contexts
- ⬜ Add accusation button to interrogation page
- ⬜ Create basic evidence tracking

### Phase 3: Evidence System

- ⬜ Implement evidence collection during conversations
- ⬜ Create evidence display on story page
- ⬜ Add contradiction detection
- ⬜ Enhance suspect responses based on evidence presented

### Phase 4: Game Completion

- ⬜ Implement win/lose conditions
- ⬜ Add feedback for accusations
- ⬜ Create case summary on completion
- ⬜ Polish UI and interactions

---

## Implementation Notes

### Next Steps

2. Implement the accusation button
3. Add basic evidence tracking
4. Enhance agent to respond to accusations

### Future Enhancements

- Add more suspects
- Create more complex evidence relationships
- Implement difficulty levels
- Add visual state changes for suspect emotions
