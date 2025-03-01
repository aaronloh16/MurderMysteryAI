import { MediaDeviceFailure } from 'livekit-client';

/**
 * Error handler for media device failures
 */
export function onDeviceFailure(error?: MediaDeviceFailure) {
	console.error(error);
	alert(
		'Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab'
	);
}
