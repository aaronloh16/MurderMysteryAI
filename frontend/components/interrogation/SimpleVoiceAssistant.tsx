import { useEffect } from 'react';
import {
	AgentState,
	BarVisualizer,
	useVoiceAssistant,
} from '@livekit/components-react';

/**
 * SimpleVoiceAssistant Component
 * Displays the audio visualization and handles voice assistant state
 */
export function SimpleVoiceAssistant(props: {
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
