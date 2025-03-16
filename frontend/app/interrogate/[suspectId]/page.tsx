'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { suspects } from '@/data/suspects';

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
import { AccusationButton } from '@/components/interrogation/AccusationButton';
import { onDeviceFailure } from '@/utils/deviceFailure';

/**
 * Interrogation Page Component
 * Handles the voice interaction interface with an AI suspect
 * Uses dynamic routing to load specific suspect data
 *
 * @example
 * When user visits /interrogate/alex, params.suspectId will be "alex", "sarah", etc.
 */
export default function InterrogationPage() {
	const router = useRouter();
	const params = useParams();
	const suspectId = params.suspectId as string;

	// Get suspect data
	const suspect = suspects[suspectId];

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
		// Create URL with suspectId as a query parameter
		const baseUrl =
			process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
			'/api/connection-details';
		const url = new URL(baseUrl, window.location.origin);

		// Add suspectId as a query parameter
		url.searchParams.append('suspectId', suspectId);

		const response = await fetch(url.toString());
		const connectionDetailsData = await response.json();
		updateConnectionDetails(connectionDetailsData);
	}, [suspectId]);

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

			<div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
				{/* Left side - Suspect Image and Info */}
				<div className="md:w-1/2 relative">
					<div className="relative h-full">
						<Image
							src={`/images/suspects/${suspectId}.webp`}
							alt={suspect.name}
							fill
							className="object-cover"
							priority
						/>
						{/* Dark gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

						{/* Suspect info positioned at bottom */}
						<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
							<h1 className="text-2xl font-bold mb-2">{suspect.name}</h1>
							<p className="text-gray-300 mb-2">{suspect.role}</p>
							<p className="text-gray-400 text-sm">
								{suspect.context.background}
							</p>
						</div>
					</div>
				</div>

				{/* Right side - Voice Interface */}
				<div className="md:w-1/2 bg-gray-900 p-6">
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
						className="flex flex-col justify-center h-full gap-8"
					>
						<SimpleVoiceAssistant onStateChange={setAgentState} />
						<ControlBar
							onConnectButtonClicked={onConnectButtonClicked}
							agentState={agentState}
						/>
						<RoomAudioRenderer />
						<NoAgentNotification state={agentState} />
						{/* Accusation button - always visible */}
						<div className="mt-6 flex justify-center">
							<AccusationButton suspectId={suspectId} />
						</div>
					</LiveKitRoom>
				</div>
			</div>
		</div>
	);
}
