// This is my first time trying out custom HTML elements
// I did not know you could do that; it's pretty cool so far

class W95Window extends HTMLElement {
	constructor() {
		super();

		this._internals = this.attachInternals(); // Makes states selectable in CSS (with :state())
	}

	connectedCallback() { // Called each time the element is added to the document
		const win = this;
		var mouseDown = false;
		var offset = [0, 0];
		var mousePosition;

		win.classList.add("window-border");
		addDOMElements(win);

		win.addEventListener('mousedown', function(e) {
			offset = [
				win.offsetLeft - e.clientX,
				win.offsetTop - e.clientY
			];

			const titleBar = win.getElementsByClassName("window-title-bar")[0];

 			// Verifies if the click actually comes from the title bar (-5 is top-left & adds clientWidth/Height to it)
			if (offset[0] <= -5 && offset[0] >= -5 - titleBar.clientWidth
			&& offset[1] <= -5 && offset[1] >= -5 - titleBar.clientHeight
			&& !win.maximised) {
				mouseDown = true;
				win.dragged = true;
			}
		}, true);

		document.addEventListener('mouseup', function(e) {
			mouseDown = false;
			win.dragged = false;
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
		// If I do plan to use it, add "static observedAttributes = ["attribute"];" before the constructor
	}

	// Get & Set add the "dragged" state for CSS
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

	// Get & Set add the "maximised" state for CSS
	get maximised() {
		return this._internals.states.has("maximised");
	}

	set maximised(flag) {
		if (flag) {
			this._internals.states.add("maximised");
		} else {
			this._internals.states.delete("maximised");
		}
	}
}


// Fills in the window with the basic elements (title bar, settings bar, etc.)
function addDOMElements(win) {
	const titleBar = createTitleBar(win);
	const settingsBar = createSettingsBar(win);
	const body = document.createElement("div");
	body.classList.add("window-body", "frame-border");
	const footer = createFooter(win);

	moveChildrenToBody(win.children, body);

	if (settingsBar) {
		win.insertBefore(settingsBar, win.firstChild);
	}
	win.insertBefore(titleBar, win.firstChild);
	win.append(body);
	win.append(footer);
}

function moveChildrenToBody(children, body) {
	while (children.length > 0) {
		const child = children[0];

		body.append(child);
	}
}

function createTitleBar(win) {
	const titleBar = document.createElement("div");
	titleBar.classList.add("window-title-bar");

	const icon = document.createElement("div");
	icon.classList.add("window-title-icon");

	const title = document.createElement("h1");
	title.classList.add("window-title");
	title.textContent = "This is the title";

	const filler = document.createElement("div");
	filler.classList.add("flex-filler");

	const buttons = document.createElement("div");
	buttons.classList.add("window-title-buttons");

	createTitleButtons(buttons, win);

	titleBar.addEventListener('dblclick', function(e) {
		toggleMaximised(win);
	}, true);

	titleBar.append(icon);
	titleBar.append(title);
	titleBar.append(filler);
	titleBar.append(buttons);

	return titleBar;
}

function createTitleButtons(buttons, win) {
	const minimiseButton = document.createElement("div");
	const maximiseButton = document.createElement("div");
	const closeButton = document.createElement("div");
	minimiseButton.classList.add("window-title-buttons-minimise", "window-border");
	maximiseButton.classList.add("window-title-buttons-maximise", "window-border");
	closeButton.classList.add("window-title-buttons-close", "window-border");

	minimiseButton.addEventListener('mousedown', function() {
		// TODO
	}, true);

	maximiseButton.addEventListener('mousedown', function() {
		toggleMaximised(win);
	}, true);

	closeButton.addEventListener('mousedown', function() {
		// TODO
	}, true);

	buttons.append(minimiseButton);
	buttons.append(maximiseButton);
	buttons.append(closeButton);
}

function toggleMaximised(win) {
	if (!win.maximised) {
		win.maximised = true;
	} else {
		win.maximised = false;
	}
}

function createSettingsBar(win) {
	const settingsBar = document.createElement("div");
	settingsBar.classList.add("window-settings-bar");

	const settings = JSON.parse(win.getAttribute("settings"));

	if (settings) {
		// Checks the JSON attribute for settings and adds them here according to it
		settings.forEach((item) => {
			initiateSetting(item, settingsBar);
		});

		return settingsBar;
	} else {
		return null;
	}
}

function initiateSetting(item, settingsBar) {
	const setting = document.createElement("div");
	setting.classList.add("window-settings-button");

	const name = document.createElement("p");
	name.classList.add("window-settings-name");
	name.textContent = item.name;

	setting.append(name);

	if (item.hasDropdown) {
		const dropdown = document.createElement("div");
		dropdown.classList.add("window-settings-dropdown", "window-border");
		dropdown.style.display = "none";

		setting.addEventListener('mousedown', function(e) {
			toggleDropdownMode(settingsBar, setting, dropdown);
		});

		dropdown.addEventListener('mousedown', function(e) {
			e.stopPropagation();
		}, true);

		setting.addEventListener('mouseover', function(e) {			
			if (settingsBar.classList.contains("window-settings-bar-dropdown-mode")) {
				openDropdown(setting, dropdown);
				closeAllOtherDropdowns(settingsBar, setting);
			}
		}, true);

		document.addEventListener('mousedown', function(e) {
			if (!e.target.closest(".window-settings-button-active")) {
				stopDropdownMode(settingsBar);
				closeAllDropdowns(settingsBar);
			}
		}, true);

		setting.append(dropdown);
	} else {
		setting.addEventListener('mousedown', function(e) {
			window[item.function]();
		}, true);
	}

	settingsBar.append(setting);
}

function toggleDropdownMode(settingsBar, setting, dropdown) {
	if (!settingsBar.classList.contains("window-settings-bar-dropdown-mode")) {
		startDropdownMode(settingsBar);
		openDropdown(setting, dropdown);
	} else {
		stopDropdownMode(settingsBar);
		closeDropdown(setting, dropdown);
	}
}

function startDropdownMode(settingsBar) {
	settingsBar.classList.add("window-settings-bar-dropdown-mode");
}

function stopDropdownMode(settingsBar) {
	settingsBar.classList.remove("window-settings-bar-dropdown-mode");
}

function openDropdown(setting, dropdown) {
	setting.classList.add("window-settings-button-active");
	dropdown.style.display = "block";
}

function closeDropdown(setting, dropdown) {
	setting.classList.remove("window-settings-button-active");
	dropdown.style.display = "none";
}

function closeAllDropdowns(settingsBar) {
	Array.from(settingsBar.children).forEach(item => {
		if (item.children.length > 1) {
			closeDropdown(item, item.children[1]);
		}
	})
}

function closeAllOtherDropdowns(settingsBar, currentSetting) {
	Array.from(settingsBar.children).forEach(item => {
		if (item !== currentSetting && item.children.length > 1) {
			closeDropdown(item, item.children[1]);
		}
	})
}

function createFooter(win) {
	const footer = document.createElement("div");
	footer.classList.add("window-footer", "frame-border");
	footer.textContent = win.getAttribute("footer");

	return footer;
}

customElements.define("w95-window", W95Window);