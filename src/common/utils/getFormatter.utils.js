export function getFormattedTime (time) {
	let tempTime = Math.round(time);
	let minutes = Math.floor(tempTime / 60);
	let seconds = tempTime - minutes * 60;
	let formattedMinutes = minutes < 10 ? "0" + `${minutes}` : `${minutes}`;
	let formattedSeconds = seconds < 10 ? "0" + `${seconds}` : `${seconds}`;
	return formattedMinutes + ":" + formattedSeconds;
}
