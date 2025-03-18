# Murder Mystery AI Troubleshooting Guide

This guide provides solutions for common issues that may arise when setting up or running the Murder Mystery AI project.

## Agent Setup Issues

### "Could not find model livekit/turn-detector" Error

**Issue:**
The agent fails to start with the following error:

```
ERROR livekit.plugins.turn_detector - Could not find model livekit/turn-detector. Make sure you have downloaded the model before running the agent. Use `python3 your_agent.py download-files` to download the models.
```

**Solution:**

1. Navigate to the agent directory:
   ```bash
   cd agent
   ```
2. Run the download-files command:
   ```bash
   python3 agent.py download-files
   ```
3. This command downloads the required model files to `~/.cache/huggingface/`
4. Restart the agent after the download completes

**Prevention:**

- This only needs to be done once per machine, unless you clear your cache
- If you update the livekit-plugins-turn-detector package, you may need to run this command again

### Architecture Compatibility Issues on Apple Silicon

**Issue:**
On Mac computers with Apple Silicon (M1/M2/M3), you may encounter an error about architecture incompatibility:

```
ImportError: dlopen(/path/to/psutil/_psutil_osx.abi3.so): mach-o file, but is an incompatible architecture (have 'x86_64', need 'arm64e' or 'arm64')
```

**Solution:**

1. Reinstall the psutil package with the correct architecture:
   ```bash
   python3 -m pip install --force-reinstall --no-binary :all: psutil==5.9.8
   ```
2. The `--no-binary :all:` flag forces pip to build from source for your specific architecture
3. The version `5.9.8` is required for compatibility with livekit-agents

**Prevention:**

- When setting up on a new Apple Silicon Mac, use this command to install psutil
- After upgrading macOS or moving to a new device with different architecture, you may need to reinstall

### Virtual Environment Issues

**Issue:**
Commands like `pip` or `python` aren't found, or packages aren't available even after installation.

**Solution:**

1. Ensure your virtual environment is activated:

   ```bash
   # For macOS/Linux
   source venv/bin/activate

   # For Windows
   venv\Scripts\activate
   ```

2. Verify activation by checking for `(venv)` prefix in your terminal
3. If the virtual environment is corrupted, create a new one:
   ```bash
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python3 agent.py download-files
   ```

## LiveKit Connection Issues

### 401 Unauthorized Error

**Issue:**
Connection to LiveKit server fails with 401 error.

**Solution:**

1. Check that your environment variables are set correctly in `.env.local`
2. Ensure LIVEKIT_API_KEY and LIVEKIT_API_SECRET match in both frontend and agent
3. Verify LIVEKIT_URL is correct and accessible
4. Check for typos or whitespace in the environment variables

### Room Connection Timeout

**Issue:**
Agent can't connect to the room or times out waiting for participants.

**Solution:**

1. Ensure both frontend and agent are running simultaneously
2. Check network connectivity and firewall settings
3. Verify the room name formatting in your code

## Audio Issues

### No Audio Input/Output

**Issue:**
Can't hear the AI or microphone isn't working.

**Solution:**

1. Check browser permissions for microphone access
2. Test your microphone in another application
3. Verify audio output device selection in your browser settings
4. Check console for errors related to media devices

### Poor Audio Quality

**Issue:**
AI voice is choppy or has poor quality.

**Solution:**

1. Check your internet connection stability
2. Reduce background noise in your environment
3. Try using headphones to avoid echo
4. Ensure you're not running resource-intensive applications in parallel

## Performance Issues

### Agent Slow to Respond

**Issue:**
Long delays between speaking and getting a response.

**Solution:**

1. Check your internet connection speed
2. Monitor CPU usage while running the agent
3. Close unnecessary applications to free resources
4. Consider reducing the complexity of the language model being used

### Frontend Lag

**Issue:**
Frontend interface becomes unresponsive during conversations.

**Solution:**

1. Optimize state management to prevent excessive re-renders
2. Consider implementing chunked transcripts instead of full history
3. Use performance monitoring tools to identify bottlenecks

## API Key Issues

### Missing or Invalid API Keys

**Issue:**
Services fail with authentication errors.

**Solution:**

1. Verify all required API keys are in `.env.local` files
2. Check for proper quotation marks around API key values
3. Ensure API keys have not expired or been revoked
4. Create new API keys if necessary and update `.env.local`

## Further Help

If you encounter issues not covered by this guide, please:

1. Check the console logs for specific error messages
2. Consult the LiveKit documentation for LiveKit-specific issues
3. Review the package documentation for dependency-related problems
4. Open an issue in the project repository with detailed information about the problem

Remember to include relevant error messages and describe the steps to reproduce the issue when seeking help.
