class W95WindowSettings extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const settingsBar = this;

		addDOMElements(settingsBar);
	}
}

function addDOMElements(settingsBar) {
	const settings = JSON.parse(settingsBar.getAttribute("settings"));

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

customElements.define("w95-window-settings", W95WindowSettings);