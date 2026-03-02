class W95Taskbar extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() { // Called each time the element is added to the document
		const taskbar = this;

		taskbar.classList.add("taskbar-border");
		addDOMElements(taskbar);
	}
}

function addDOMElements(taskbar) {
	const startButton = createStartButton();
	const taskbarApps = createTaskbarApps();
	const clock = createClock();

	taskbar.append(startButton);
	taskbar.append(taskbarApps);
	taskbar.append(clock);
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

function createTaskbarApps() {
	const taskbarApps = document.createElement("div");
	taskbarApps.classList.add("taskbar-apps", "flex-filler");

	const temporaryApp = document.createElement("div");
	temporaryApp.classList.add("taskbar-apps-button", "window-border");

	const icon = document.createElement("div");
	icon.classList.add("taskbar-apps-button-icon");
	const text = document.createElement("p");
	text.classList.add("taskbar-apps-button-text");
	text.textContent = "This is the title"
	temporaryApp.append(icon, text);

	taskbarApps.append(temporaryApp);

	return taskbarApps;
}

function createClock() {
	const clock = document.createElement("div");
	clock.classList.add("taskbar-clock", "frame-border");

	const time = document.createElement("p");
	time.classList.add("taskbar-clock-time");
	time.textContent = "12:00 PM"

	clock.append(time);

	return clock;
}

customElements.define("w95-taskbar", W95Taskbar);