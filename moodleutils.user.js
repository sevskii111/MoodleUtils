// ==UserScript==
// @name         Moodle Utils
// @namespace    http://willsr71.net
// @version      0.2
// @description  Provides a number of cheats for Moodle
// @author       Willsr71
// @updateURL    https://github.com/Willsr71/MoodleUtils/raw/master/moodleutils.user.js
// @match        http://www.latintutorial.com/moodle/*
// @grant        localstorage
// @run-at       document-body
// ==/UserScript==

var configuration = {
	devMode: false,
	showPanel: true,
	showConsole: false,
	showButtons: true
};

window.localStorage.setItem("moodleutils_config", JSON.stringify(configuration));

var script = document.createElement('script');

if (configuration.devMode) {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/moodleutils.js?t=" + Date.now();
} else {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/moodleutils.min.js";
}

(document.body || document.head || document.documentElement).appendChild(script);
