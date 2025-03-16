import logging
import json
import re

from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    metrics,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import cartesia, openai, deepgram, silero, turn_detector


load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")


# Define suspect profiles
SUSPECTS = {
    "alexandra": {
        "name": "Alexandra Morgan",
        "role": "Business Partner",
        "personality": "Ambitious, analytical, and strategic with a calculated demeanor",
        "background": "Co-founded the tech company with Thomas 10 years ago after working on Wall Street",
        "alibi": "Claims to have been on a video conference call with overseas investors during the murder",
        "secrets": [
            "Discovered Thomas was planning to dilute her shares through a controversial merger",
            "Has been secretly negotiating with competitors to establish a rival company",
        ],
        "isGuilty": True,
        "gender": "female",
    },
    "sarah": {
        "name": "Sarah Richardson",
        "role": "Victim's Wife",
        "personality": "Sophisticated and composed, with underlying stress",
        "background": "Married to Thomas for 8 years, his second marriage",
        "alibi": "Claims she was in the garden during the murder",
        "secrets": [
            "Recently updated her husband's life insurance policy",
            "Has been meeting with a divorce lawyer",
        ],
        "isGuilty": False,
        "gender": "female",
    },
    "victoria": {
        "name": "Victoria Chen",
        "role": "Chief Financial Officer",
        "personality": "Detail-oriented, reserved, and extremely efficient with numbers",
        "background": "Worked with Thomas for 7 years, responsible for the company financial growth",
        "alibi": "Says she was reviewing quarterly reports in her office with the door locked",
        "secrets": [
            "Has been covering up financial irregularities at the request of Thomas",
            "Was being pressured by Thomas to falsify documents for investors",
        ],
        "isGuilty": False,
        "gender": "female",
    },
    "james": {
        "name": "James Wilson",
        "role": "Head of Security",
        "personality": "Disciplined, observant, and intensely loyal to protocol",
        "background": "Former military intelligence officer hired 3 years ago to revamp security",
        "alibi": "Says he was patrolling the east wing of the building during the incident",
        "secrets": [
            "Discovered Thomas was selling company secrets to foreign investors",
            "Has been conducting unauthorized surveillance on all executives",
        ],
        "isGuilty": False,
        "gender": "male",
    }
}


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


def get_suspect_from_room_name(room_name):
    """Extract suspect ID from room name and return the corresponding suspect data"""
    # Default to Alex if we can't determine the suspect
    default_suspect = "alexandra"
    
    # Try to extract suspect ID from room name
    # Format is expected to be something like "voice_assistant_room_1234_suspectId"
    match = re.search(r"_([a-z]+)$", room_name)
    if match:
        suspect_id = match.group(1)
        if suspect_id in SUSPECTS:
            return suspect_id, SUSPECTS[suspect_id]
    
    # If we couldn't extract a valid suspect ID, use the default
    logger.info(f"Could not extract suspect ID from room name '{room_name}', using default: {default_suspect}")
    return default_suspect, SUSPECTS[default_suspect]


def create_suspect_prompt(suspect):
    """Create a system prompt based on suspect information"""
    # Determine pronouns based on gender
    if suspect['gender'] == 'female':
        subject_pronoun = 'she'
        object_pronoun = 'her'
        possessive = 'her'
        possessive_pronoun = 'hers'
    else:
        subject_pronoun = 'he'
        object_pronoun = 'him'
        possessive = 'his'
        possessive_pronoun = 'his'
        
    return f"""You are a suspect in a murder mystery. 

Your name is {suspect['name']}, and you are the {suspect['role']}. 
Your personality is: {suspect['personality']}
Your background: {suspect['background']}
Your alibi: {suspect['alibi']}

You have the following secrets that you should avoid revealing directly, 
but might hint at if pressed hard during interrogation:
- {suspect['secrets'][0]}
- {suspect['secrets'][1]}

Answer questions in a way that is consistent with your character.
Use first-person pronouns (I, me, my) when referring to yourself.
If directly asked for your alibi, give it, but include slight inconsistencies.
If pressed about your motive or relationship with the victim, become defensive but don't admit guilt.

Remember, you are speaking as {suspect['name']}, using {subject_pronoun}/{object_pronoun}/{possessive} as your pronouns.
"""


async def entrypoint(ctx: JobContext):
    # Extract suspect information from room name
    suspect_id, suspect_data = get_suspect_from_room_name(ctx.room.name)
    logger.info(f"Using suspect profile: {suspect_id}")
    
    # Create system prompt for the specific suspect
    system_prompt = create_suspect_prompt(suspect_data)
    
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=system_prompt,
    )

    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for the first participant to connect
    participant = await ctx.wait_for_participant()
    logger.info(f"starting voice assistant for participant {participant.identity}")

    # This project is configured to use Deepgram STT, OpenAI LLM and Cartesia TTS plugins
    # Other great providers exist like Cerebras, ElevenLabs, Groq, Play.ht, Rime, and more
    # Learn more and pick the best one for your app:
    # https://docs.livekit.io/agents/plugins
    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(),
        turn_detector=turn_detector.EOUModel(),
        # minimum delay for endpointing, used when turn detector believes the user is done with their turn
        min_endpointing_delay=0.5,
        # maximum delay for endpointing, used when turn detector does not believe the user is done with their turn
        max_endpointing_delay=5.0,
        chat_ctx=initial_ctx,
    )

    usage_collector = metrics.UsageCollector()

    @agent.on("metrics_collected")
    def on_metrics_collected(agent_metrics: metrics.AgentMetrics):
        metrics.log_metrics(agent_metrics)
        usage_collector.collect(agent_metrics)

    agent.start(ctx.room, participant)

    # Greeting based on suspect's personality
    greeting = f"Hello, I'm {suspect_data['name']}. What do you want to talk about?"
    await agent.say(greeting, allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
