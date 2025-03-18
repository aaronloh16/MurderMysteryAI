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

- **Story**: On a chaotic afternoon at TechVision's open-plan office, CEO Thomas Richardson was found dead at his desk, crushed under a giant novelty keyboard labeled "The Banhammer." The cause of death was blunt force trauma from the oversized keyboard, a gag gift from last year's holiday party that turned deadly. The time of death is estimated between 1:00 PM and 1:30 PM, during a heated Slack debate about the company's glitchy app that had everyone on edge. As the detective, you must interrogate the suspects to determine who killed Thomas Richardson.

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
- The game evaluates the accusation based on the guilty suspect (Sarah)
- Feedback is provided on whether the accusation was correct

---

## Characters

We currently have three implemented suspects:

### Alexandra Morgan

- **Role**: Co-Founder
- **Description**: Ambitious and dramatic, known for her emphatic communication style
- **Background**: Co-founded TechVision with Thomas 10 years ago, but has been secretly outsourcing her coding work to freelancers
- **Personality**: Dramatic and defensive about her technical capabilities
- **Alibi**: Claims she was in a private Slack channel, brainstorming app fixes during the murder
- **Secrets**:
  - Has been faking her coding skills and hiring freelancers to do her work
  - Was arguing with Thomas in Slack about the app's bugs right before his death
- **Status**: Innocent

### Sarah Richardson

- **Role**: CEO's Wife
- **Description**: A Slack lurker who communicates casually with reaction-style responses
- **Background**: Married to Thomas for 8 years, has been blackmailing him with embarrassing Slack screenshots
- **Personality**: Seemingly casual but becomes defensive when pressed
- **Alibi**: Claims she was in the break room, avoiding the Slack drama
- **Secrets**:
  - Has been blackmailing Thomas to maintain her lifestyle
  - Was seen near Thomas's desk during the Slack fight by Victoria
- **Status**: Guilty (implemented but hidden from player)

### Victoria Chen

- **Role**: Chief Financial Officer
- **Description**: A spreadsheet expert who speaks in professional, sometimes passive-aggressive tones
- **Background**: Worked with Thomas for 7 years, has been selling company laptops on eBay to fund her side projects
- **Personality**: Professional and precise, but defensive about financial matters
- **Alibi**: Claims she was in her office, calculating overtime costs
- **Secrets**:
  - Has been embezzling funds by selling company property
  - Overheard Thomas threatening to fire her for budget discrepancies
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
4. **Win Condition**: Correctly accusing Sarah Richardson with sufficient evidence
5. **Lose Condition**: Accusing an innocent suspect (Alexandra or Victoria)

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

### Phase 1: Core Story and Characters (Completed)

- ✅ Set up Next.js project structure
- ✅ Implement LiveKit integration
- ✅ Create basic UI for landing, story, and interrogation pages
- ✅ Set up Python agent with voice pipeline
- ✅ Update story with "Banhammer" murder theme
- ✅ Update suspect profiles (Alexandra, Sarah, Victoria)
- ✅ Implement accusation button functionality
- ✅ Centralize suspect data in frontend/data/suspects.ts
- ✅ Modify agent to read data from frontend files

### Phase 2: Conversation Enhancements (In Progress)

- 🔄 Implement suspect-specific conversation styles
- 🔄 Add conversation summary functionality
- 🔄 Improve agent prompts with personality-specific behaviors
- 🔄 Test and optimize performance

### Phase 3: Evidence System (Future)

- ⬜ Implement basic evidence tracking (backend only first)
- ⬜ Add evidence collection during conversations
- ⬜ Create minimal evidence display on story page
- ⬜ Test for performance impact before expanding

### Phase 4: Polishing and Improvements (Future)

- ⬜ Add transcript display toggle (deferred for performance)
- ⬜ Enhance suspect responses based on evidence presented
- ⬜ Improve feedback for accusations
- ⬜ Polish UI and interactions

---

## Implementation Notes

### Incremental Approach

To ensure stable performance:

1. Test each feature individually before integrating
2. Prioritize backend functionality over frontend enhancements
3. Add user-facing features only after core functionality is stable
4. Avoid features that cause significant performance degradation

### Next Steps

1. Test conversation summary feature
2. Refine character personalities to ensure they're distinctive without overusing stylistic elements
3. Consider simple evidence tracking mechanism
