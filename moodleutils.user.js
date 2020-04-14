// ==UserScript==
// @name         Moodle Utils
// @namespace    http://willsr71.net
// @version      0.4
// @description  Provides a number of cheats for Moodle
// @author       Willsr71
// @updateURL    https://github.com/sevskii111/MoodleUtils/raw/master/moodleutils.user.js
// @match        http://do.novsu.ru/*
// @grant        localstorage
// @run-at       document-body
// ==/UserScript==

var configuration = {
	devMode: true,
	showPanel: true,
	showConsole: true,
	showButtons: true,
	version: "0.4"
};

window.localStorage.setItem("moodleutils_config", JSON.stringify(configuration));

var script = document.createElement('script');

if (configuration.devMode) {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/moodleutils.js?t=" + Date.now();
} else {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/moodleutils.min.js";
}

(document.body || document.head || document.documentElement).appendChild(script);
