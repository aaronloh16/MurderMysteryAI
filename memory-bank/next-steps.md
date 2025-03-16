# Next Steps for Murder Mystery AI

Based on our progress so far and implementation plan, here are the next steps to focus on:

## 1. Evidence System Implementation

The evidence system is the next major feature to implement. This should include:

- **Evidence Data Structure** (1-2 days)

  - Create an `evidence.ts` file in the `data` folder
  - Define interfaces for evidence items and collections
  - Add utility functions for adding and retrieving evidence

- **Evidence UI Components** (2-3 days)

  - Create an `EvidenceItem` component
  - Implement an `EvidenceList` component for the story page
  - Add a notebook-style UI for viewing collected evidence

- **Evidence Collection Logic** (3-4 days)
  - Modify the agent to identify and flag key revelations as evidence
  - Create a system to recognize contradictions between evidence
  - Implement a hook to capture evidence from agent responses

## 2. Performance Optimizations

To ensure smooth gameplay, the following optimizations should be prioritized:

- **Code Splitting** (1 day)

  - Implement dynamic imports for larger components
  - Separate the interrogation page logic into smaller chunks

- **Image Optimization** (1 day)

  - Review all image components to ensure they use proper next/image features
  - Implement lazy loading for non-critical images

- **API Performance** (1-2 days)
  - Add caching for API responses where appropriate
  - Implement error retries for LiveKit connections

## 3. Testing and Debugging

To ensure everything works properly:

- **Unit Testing** (2-3 days)

  - Add Jest tests for key components
  - Test the accusation logic and evidence system

- **Integration Testing** (1-2 days)
  - Test the complete user flow from landing to accusation
  - Verify that all components work together correctly

## 4. State Management Enhancement

As the app grows, better state management will be needed:

- **React Context** (2-3 days)
  - Create a GameContext for global state
  - Implement reducers for game actions
  - Move evidence and suspect state to context

## Timeline

Estimated total time: 3-4 weeks

Priority order:

1. Evidence data structure and UI components
2. Performance optimizations
3. Evidence collection logic
4. Testing
5. State management

## Getting Started

To begin work on the evidence system:

1. Create a new branch from `accusation-system`
2. Start by defining the evidence data structure
3. Implement the basic UI components for displaying evidence
4. Test the evidence display before connecting it to the agent
