// ==UserScript==
// @name         Moodle AutoFill
// @namespace    http://willsr71.net
// @version      0.1
// @description  Automatically fills in Moodle answers based on previous answers
// @author       Willsr71
// @updateURL    http://willsr71.net/scripts/moodle/autofill.user.js
// @match        http://www.latintutorial.com/moodle/*
// @grant        storage
// ==/UserScript==

var developmentMode = true;
var logVisible = true;
var script = document.createElement('script');

if (developmentMode) {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/autofill.js?t=" + Date.now();
} else {
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/autofill.min.js";
}

(document.body || document.head || document.documentElement).appendChild(script);
