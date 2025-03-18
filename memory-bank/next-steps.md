# Next Steps for Murder Mystery AI

Based on our latest discussions and implementation attempts, we need to take a more incremental approach. Here are the prioritized next steps:

## 1. Story and Character Improvements (Phase 1)

- **Update Story Content** (Completed)

  - Changed murder weapon to "The Banhammer" (giant novelty keyboard)
  - Updated story setting to TechVision tech company with Slack drama
  - Modified timeline to 1:00-1:30 PM during a heated debate

- **Character Revisions** (Completed)

  - Made Sarah the guilty suspect instead of Alexandra
  - Removed James Wilson, focusing on three core suspects
  - Updated character personalities and backgrounds

- **Agent Prompt Enhancements** (Initial Implementation)
  - Added more detailed prompt structure for each character
  - Added suspect-specific conversation styles
  - Added background story context for consistent responses
  - Keep character styles without overusing ALL CAPS

## 2. Conversation Features (Phase 2)

- **Conversation Summaries** (In Progress)

  - Implement ability for players to ask for conversation summary
  - Highlight key points and inconsistencies
  - Implement server-side only without frontend transcript display

- **Deferred Frontend Features** (To Implement Later)
  - Transcript display with toggle button
  - Evidence tracking system
  - Visual connection between suspect statements and evidence

## 3. Technical Improvements (Phase 3)

- **Code Unification**

  - Single source of truth for suspect data in frontend/data/suspects.ts
  - Agent.py reads data from frontend files instead of duplication
  - Better error handling and logging

- **Performance Optimization**
  - Remove UI elements that cause slowdowns
  - Implement features incrementally to test performance impact
  - Add better error handling and debugging information

## 4. Clue Balance and Game Flow (Phase 4)

- **Balanced Suspect Design**

  - Ensure each suspect has logical red herrings
  - Make guilty suspect (Sarah) have subtle tells and inconsistencies
  - Create interconnected alibis (Victoria saw Sarah near the desk)

- **Game Flow Optimization**
  - Target 15-30 minutes total gameplay time
  - 3-5 minute interrogations per suspect
  - Add subtle guidance if players seem stuck

## Incremental Implementation Plan

To avoid performance issues, we'll implement features in this order:

1. **First: Basic Story Changes** ✓

   - ✓ Update suspect.ts with new characters and story
   - ✓ Update agent.py to read from frontend data

2. **Second: Agent Prompt Enhancement** ✓

   - ✓ Improve system prompts for more character-specific responses
   - ✓ Add background story context to prompts
   - ✓ Add personalized character greetings

3. **Third: Conversation Summaries** (Next)

   - Add summary feature on backend only
   - Test to ensure it doesn't impact performance

4. **Fourth: Evidence System** (Later)

   - Implement only after core features are stable
   - Start with simple evidence tracking before visual components

5. **Fifth: Database Migration** (Production Readiness)
   - Move from file-based data to proper database
   - Implement using Neon Database and Drizzle ORM (open source alternative to Prisma)
   - Create API endpoints to serve data to both frontend and Python agent
   - See `database-migration-plan.md` for detailed implementation plan

This incremental approach will ensure we maintain performance while improving the game experience.
