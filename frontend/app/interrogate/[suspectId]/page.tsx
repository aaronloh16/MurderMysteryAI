'use client';

import { useParams, useRouter } from 'next/navigation';

import {
	LiveKitRoom,


	RoomAudioRenderer,

	AgentState,
} from '@livekit/components-react';
import { useCallback, useState } from 'react';
import type { ConnectionDetails } from '../../api/connection-details/route';
import { NoAgentNotification } from '@/components/NoAgentNotification';
import { SimpleVoiceAssistant } from '@/components/interrogation/SimpleVoiceAssistant';
import { ControlBar } from '@/components/interrogation/ControlBar';
import { onDeviceFailure } from '@/utils/deviceFailure';

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
