class W95Taskbar extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() { // Called each time the element is added to the document
		const win = this;

		win.classList.add("taskbar-border");
		addDOMElements(win);
	}
}

function addDOMElements(win) {
	const startButton = createStartButton();

	win.append(startButton);
}

function createStartButton() {
	const startButton = document.createElement("div");
	startButton.classList.add("taskbar-start-button", "window-border");

	const startIcon = document.createElement("div");
	const startText = document.createElement("h1");
	startIcon.classList.add("taskbar-start-icon");
	startText.classList.add("taskbar-start-text");
	startText.textContent = "Start"

	startButton.append(startIcon);
	startButton.append(startText);

	return startButton;
}

customElements.define("w95-taskbar", W95Taskbar);