# Murder Mystery AI Development Progress

This document tracks the progress of development for the Murder Mystery AI game, highlighting completed features, current work, and upcoming tasks.

## Completed Features ✅

### Project Setup

- ✅ Set up Next.js project with TypeScript and Tailwind CSS
- ✅ Configured LiveKit integration
- ✅ Established Python agent environment

### Frontend

- ✅ Implemented landing page with atmospheric design
- ✅ Created story page with case details
- ✅ Built suspect cards with basic information
- ✅ Implemented dynamic routing for suspects
- ✅ Designed interrogation page layout
- ✅ Added voice visualization
- ✅ Implemented navigation between pages
- ✅ Created accusation button component
- ✅ Implemented basic accusation feedback

#### todo

- Updated story text with new "Banhammer" murder theme
- Connected story page to storyContext object in suspects.ts

### Backend

- ✅ Set up Python agent with LiveKit integration
- ✅ Implemented voice pipeline with Deepgram and Cartesia
- ✅ Created basic suspect context system
- ✅ Added conversation handling
- ✅ Implemented dynamic suspect profiles in agent
- ✅ Added suspect ID to room names for context
- ✅ Fixed turn detector model loading issues
- ✅ Resolved architecture compatibility issues with psutil on Apple Silicon

#### todo

- Modified agent to read suspect data from frontend
- Improved error handling and logging in agent.py

### Data

- ✅ Defined suspect data structure
- ✅ Updated suspect profiles (Alexandra, Sarah, Victoria)
- ✅ Removed James Wilson from suspect list
- ✅ Added storyContext object to centralize story details
- ✅ Made Sarah the guilty suspect instead of Alexandra

## In Progress 🔄

### Agent Improvements

- 🔄 Implementing conversation summary functionality
- 🔄 Testing updated agent prompts with character-specific response styles
- 🔄 Ensuring consistent behavior across all suspects

### Performance Optimization

- 🔄 Identifying and addressing performance bottlenecks
- 🔄 Taking incremental approach to adding features
- 🔄 Deferring frontend transcript display to avoid slowdowns

## Up Next 📋

### Phase 2: Conversation Features

- 📋 Complete and test the conversation summary feature
- 📋 Verify performance impact of each feature before proceeding
- 📋 Create proper error handling for conversation edge cases

### Phase 3: Evidence System (Deferred)

- 📋 Define evidence data structure
- 📋 Implement backend-only evidence tracking first
- 📋 Add frontend components only after core functionality is stable

## Future Work

### Phase 4: User Experience Enhancements

- Transcript display with toggle button
- Visual evidence board
- Game state management for tracking progress

### Phase 5: Production Readiness

- Database migration from file-based to Neon Postgres
- API layer implementation with Drizzle ORM (open source alternative to Prisma)
- Proper error handling and fallbacks
- Admin interface for content management

## Known Issues

1. **Performance**: Some features cause performance degradation
2. **Agent Startup**: Occasional delays or timeouts during agent initialization
3. **Character Responses**: Need to fine-tune character personalities without overusing stylistic elements

## Next Immediate Steps

1. Test conversation summary feature ("summarize" command)
2. Consider simple evidence tracking that doesn't impact performance
3. Focus on incrementally improving one feature at a time
4. Address performance bottlenecks before adding new features

## Technical Fixes & Solutions

### Turn Detector & Architecture Compatibility Issues (March 18, 2024)

We resolved two critical issues with the agent backend:

1. **Turn Detector Model Loading Error**:

   - Issue: The agent was failing to start with an error: "Could not find model livekit/turn-detector"
   - Solution: Downloaded the required model files using `python3 agent.py download-files`
   - The models are stored in the user's cache directory at `~/.cache/huggingface/`
   - These files only need to be downloaded once unless the cache is cleared

2. **Architecture Compatibility with Apple Silicon**:
   - Issue: On Mac with Apple Silicon (M1/M2/M3), the `psutil` package was installed for x86_64 architecture instead of ARM64
   - Error: `ImportError: dlopen(/path/to/psutil/_psutil_osx.abi3.so): mach-o file, but is an incompatible architecture (have 'x86_64', need 'arm64e' or 'arm64')`
   - Solution: Reinstalled psutil with the correct architecture using `python3 -m pip install --force-reinstall --no-binary :all: psutil==5.9.8`
   - Note: The version must be 5.9.8 to be compatible with livekit-agents

These fixes allowed the agent to start properly and handle voice interactions without errors
