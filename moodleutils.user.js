// ==UserScript==
// @name         Moodle Utils
// @namespace    http://willsr71.net
// @version      0.1
// @description  Provides a number of cheats for Moodle
// @author       Willsr71
// @updateURL    https://github.com/Willsr71/MoodleUtils/raw/master/moodleutils.user.js
// @match        http://www.latintutorial.com/moodle/*
// @grant        none
// ==/UserScript==

var developmentMode = false;
var logVisible = true;
var script = document.createElement('script');

if (developmentMode) {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/moodleutils.js?t=" + Date.now();
} else {
	script.src = document.location.protocol + "//https://github.com/Willsr71/MoodleUtils/raw/master/moodleutils.js";
}

(document.body || document.head || document.documentElement).appendChild(script);
