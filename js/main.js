function settings() {
	var settings = document.getElementById('settings');

	if (settings.style.display == "none") {
		settings.style.display = "block"
	} else {
		settings.style.display = "none"
	}
}

function fullscreen() {
	var canvas = document.getElementById('mainCanvas');

	if (canvas.requestFullscreen) {
		canvas.requestFullscreen();
	} else if (canvas.webkitRequestFullscreen) {
		canvas.webkitRequestFullscreen();
	} else if (canvas.msRequestFullscreen) {
		canvas.msRequestFullscreen();
	}
}