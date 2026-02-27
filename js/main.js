function fullscreen() { // Puts the game in fullscreen
	var canvas = document.getElementById('mainCanvas');

	if (canvas.requestFullscreen) {
		canvas.requestFullscreen();
	} else if (canvas.webkitRequestFullscreen) {
		canvas.webkitRequestFullscreen();
	} else if (canvas.msRequestFullscreen) {
		canvas.msRequestFullscreen();
	}
}