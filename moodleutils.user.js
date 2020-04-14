// ==UserScript==
// @name         Moodle Utils
// @namespace    http://willsr71.net
// @version      0.5
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

script.src = "https://raw.githubusercontent.com/sevskii111/MoodleUtils/master/moodleutils.js";

(document.body || document.head || document.documentElement).appendChild(script);
