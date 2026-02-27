// This is my first time trying out custom HTML elements
// I did not know you could do that; it's pretty cool so far

class W95Window extends HTMLElement {
	// static observedAttributes = ["style"];

	constructor() {
		super();

		this._internals = this.attachInternals(); // Makes states selectable in CSS (with :state())
	}

	connectedCallback() { // Called each time the element is added to the document
		const win = this;
		var mouseDown = false;
		var offset = [0, 0];
		var mousePosition;

		var audio = new Audio("./audio/golden_freddy.mp3");

		win.classList.add("window-border");
		addDOMElements(win);

		win.addEventListener('mousedown', function(e) {
			offset = [
				win.offsetLeft - e.clientX,
				win.offsetTop - e.clientY
			];

			if (true) { // TODO Once the title bar is complete, add a verification that it's clicking in it
				mouseDown = true;
				win.dragged = true;
				audio.play();
			}
		}, true);

		document.addEventListener('mouseup', function(e) {
			mouseDown = false;
			win.dragged = false;
			audio.pause();
		}, true);

		document.addEventListener('mousemove', function(e) { // Makes the window follow the mouse if the click is held down
			if (mouseDown) {
				mousePosition = {
					x: e.clientX,
					y: e.clientY
				};

				win.style.left = (mousePosition.x + offset[0]) + "px";
				win.style.top = (mousePosition.y + offset[1]) + "px";
			}
		}, true);
	}

	diconnectedCallback() { // Called each time the element is removed from the document
		// Unused for now
	}

	attributeChangedCallback(name, oldValue, newValue) { // Called when attributes are changed, added, removed, or replaced.
		// Unused for now
	}

	get dragged() {
		return this._internals.states.has("dragged");
	}

	set dragged(flag) {
		if (flag) {
			this._internals.states.add("dragged");
		} else {
			this._internals.states.delete("dragged");
		}
	}
}

function addDOMElements(win) { // Fills in the window with the basic elements (title bar, settings bar, etc.)
	const titleBar = document.createElement("div");
	titleBar.classList.add("window-title-bar");
	titleBar.textContent = "This would normally be the window's title bar";

	win.insertBefore(titleBar, win.firstChild);
}

customElements.define("w95-window", W95Window);