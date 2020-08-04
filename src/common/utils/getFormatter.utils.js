export function getFormattedTime (time) {
	let tempTime = Math.round(time);
	let minutes = Math.floor(tempTime / 60);
	let seconds = tempTime - minutes * 60;
	let formattedMinutes = minutes < 10 ? "0" + `${minutes}` : `${minutes}`;
	let formattedSeconds = seconds < 10 ? "0" + `${seconds}` : `${seconds}`;
	return formattedMinutes + ":" + formattedSeconds;
}

export function getHHMMTime (time) {
	let tempTime = Math.round(time);
	let hours = Math.floor(tempTime / 3600);
	let minutes = Math.floor((tempTime - hours * 60) / 60);
	let formattedHours = hours < 10 ? "0" + `${hours}` : `${hours}`;
	let formattedMinutes = minutes < 10 ? "0" + `${minutes}` : `${minutes}`;
	return formattedHours + ":" + formattedMinutes;
}

export function getSecondsTime (time) {
	let timeArray = time.split(":");
	let min = +timeArray[0];
	let sec = +timeArray[1];
	return min * 60 + sec;
}
