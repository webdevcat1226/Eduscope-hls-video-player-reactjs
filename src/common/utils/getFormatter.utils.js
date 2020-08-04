export function getFormattedTime (time) {
	let tempTime = Math.round(time);
	let hours = Math.floor(tempTime / 3600);
	let minutes = Math.floor((tempTime - hours * 60) / 60);
	let seconds = tempTime - minutes * 60 - hours * 3600;
	let formattedHours = hours < 10 ? "0" + `${hours}` : `${hours}`;
	let formattedMinutes = minutes < 10 ? "0" + `${minutes}` : `${minutes}`;
	let formattedSeconds = seconds < 10 ? "0" + `${seconds}` : `${seconds}`;
	return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
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
	let hour = +timeArray[0];
	let min = +timeArray[1];
	let sec = +timeArray[2];
	return hour * 3600 + min * 60 + sec;
}
