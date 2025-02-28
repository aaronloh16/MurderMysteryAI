'use client';

import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
	LiveKitRoom,
	useVoiceAssistant,
	BarVisualizer,
	RoomAudioRenderer,
	VoiceAssistantControlBar,
	AgentState,
	DisconnectButton,
} from '@livekit/components-react';
import { useCallback, useEffect, useState } from 'react';
import { MediaDeviceFailure } from 'livekit-client';
import type { ConnectionDetails } from '../../api/connection-details/route';
import { NoAgentNotification } from '@/components/NoAgentNotification';
import { CloseIcon } from '@/components/CloseIcon';
import { useKrispNoiseFilter } from '@livekit/components-react/krisp';

/**
 * Interrogation Page Component
 * Handles the voice interaction interface with an AI suspect
 * Uses dynamic routing to load specific suspect data
 *
 * @example
 * When user visits /interrogate/alex, params.suspectId will be "alex"
 */
export default function InterrogationPage() {
	const router = useRouter();
	const params = useParams();
	const suspectId = params.suspectId as string; // This will be "alex", "sarah", etc.

	// State to store LiveKit connection information
	const [connectionDetails, updateConnectionDetails] = useState<
		ConnectionDetails | undefined
	>(undefined);

	// State to track the AI agent's current status
	const [agentState, setAgentState] = useState<AgentState>('disconnected');

	/**
	 * Initiates connection to LiveKit server
	 */
	const onConnectButtonClicked = useCallback(async () => {
		const url = new URL(
			process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
				'/api/connection-details',
			window.location.origin
		);
		const response = await fetch(url.toString());
		const connectionDetailsData = await response.json();
		updateConnectionDetails(connectionDetailsData);
	}, []);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<header className="p-4 border-b border-gray-800">
				<button
					onClick={() => router.push('/story')}
					className="flex items-center text-gray-400 hover:text-white transition-colors"
				>
					<svg
						className="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Suspects
				</button>
			</header>

			{/* Display which suspect we're interrogating */}
			<div className="text-center py-4">
				<h1 className="text-xl">Interrogating Suspect: {suspectId}</h1>
			</div>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<LiveKitRoom
					token={connectionDetails?.participantToken}
					serverUrl={connectionDetails?.serverUrl}
					connect={connectionDetails !== undefined}
					audio={true}
					video={false}
					onMediaDeviceFailure={onDeviceFailure}
					onDisconnected={() => {
						updateConnectionDetails(undefined);
					}}
					className="grid grid-rows-[2fr_1fr] items-center gap-8"
				>
					<SimpleVoiceAssistant onStateChange={setAgentState} />
					<ControlBar
						onConnectButtonClicked={onConnectButtonClicked}
						agentState={agentState}
					/>
					<RoomAudioRenderer />
					<NoAgentNotification state={agentState} />
				</LiveKitRoom>
			</main>
		</div>
	);
}

/**
 * SimpleVoiceAssistant Component
 * Displays the audio visualization and handles voice assistant state
 */
function SimpleVoiceAssistant(props: {
	onStateChange: (state: AgentState) => void;
}) {
	const { state, audioTrack } = useVoiceAssistant();

	useEffect(() => {
		props.onStateChange(state);
	}, [props, state]);

	return (
		<div className="h-[300px] max-w-[90vw] mx-auto">
			<BarVisualizer
				state={state}
				barCount={5}
				trackRef={audioTrack}
				className="agent-visualizer"
				options={{ minHeight: 24 }}
			/>
		</div>
	);
}

/**
 * ControlBar Component
 * Handles the UI controls for starting/stopping conversations
 */
function ControlBar(props: {
	onConnectButtonClicked: () => void;
	agentState: AgentState;
}) {
	const krisp = useKrispNoiseFilter();
	useEffect(() => {
		krisp.setNoiseFilterEnabled(true);
	}, [krisp]);

	return (
		<div className="relative h-[100px]">
			<AnimatePresence>
				{props.agentState === 'disconnected' && (
					<motion.button
						initial={{ opacity: 0, top: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, top: '-10px' }}
						transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
						className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
						onClick={() => props.onConnectButtonClicked()}
					>
						Start a conversation
					</motion.button>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{props.agentState !== 'disconnected' &&
					props.agentState !== 'connecting' && (
						<motion.div
							initial={{ opacity: 0, top: '10px' }}
							animate={{ opacity: 1, top: 0 }}
							exit={{ opacity: 0, top: '-10px' }}
							transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
							className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center"
						>
							<VoiceAssistantControlBar controls={{ leave: false }} />
							<DisconnectButton>
								<CloseIcon />
							</DisconnectButton>
						</motion.div>
					)}
			</AnimatePresence>
		</div>
	);
}

/**
 * Error handler for media device failures
 */
function onDeviceFailure(error?: MediaDeviceFailure) {
	console.error(error);
	alert(
		'Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab'
	);
}
