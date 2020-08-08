export function getVideoId() {
	let url = new URL(window.location.href);
	let encoded_video_id = url.searchParams.get('id');
	let decoded_video_id = window.atob(encoded_video_id).split('_');
	let video_id = decoded_video_id[decoded_video_id.length - 1];
	return {
		encoded_video_id: encoded_video_id,
		video_id: video_id,
	};
}
