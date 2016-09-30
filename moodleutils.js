var databaselist = ["vocab"];
var databases = {};
var failedDatabaseCount = 0;
var shouldLoad = false;
var loadedDate = Date.now();
var updaterVersion;
var configoptions = ["devMode", "showPanel", "showConsole", "showButtons", "version"];
var configuration = {
	devMode: false,
	showPanel: true,
	showConsole: true,
	showButtons: true,
	version: "0.0"
};

function main() {
	readConfig();
	initialize();
	createUpdater();
	log("Loading MoodleUtils v" + configuration.version + "...");

	if (document.location.pathname == "/moodle/mod/quiz/attempt.php") {
		addButton("Fill Answers", autoFill);
		shouldLoad = true;
	} else if (document.location.pathname == "/moodle/mod/quiz/review.php") {
		addButton("Record Answers", autoRecord);
		shouldLoad = true;
	}

	if (shouldLoad) {
		addButton("Clear Answers", autoClear);

		addDatabases();
	}
	
	addButton("Hide Panel", hidePanel);
	
	checkLoaded();
}

Object.size = function(obj) {
	var size = 0
	for (var key in obj) {
			if (obj.hasOwnProperty(key)) size = size + 1;
	}
	return size;
};

function l(e) {
	return document.getElementById(e);
}

function log(what) {
	console.info(what);
	var line = '<a style="color:#000000;text-decoration:none">[' + parseTime(Date.now() - loadedDate) + '] ' + what + '</a><br>';
	l("moodleutils_logger").innerHTML = l("moodleutils_logger").innerHTML + line;
}

function parseTime(time) {
	var string;
	
	string = (time % 60);
	string = (Math.floor(time / 60) % 60 + "." + string);
	string = Math.floor(time / (60 * 60)) + ":" + string;
	
	return string;
}

function checkForUpdates() {
	if (updaterVersion === null || updaterVersion === undefined) {
		return false;
	}
	
	var versionNum = parseInt(configuration.version.split(".").join(""));
	var updaterVersionNum = parseInt(updaterVersion.version.split(".").join(""));
	var updateAvaliable = updaterVersionNum > versionNum;
	
	if (updateAvaliable) {
		log("</a><a style=\"color:red\">Update avaliable: " + updaterVersion.version + "</a><a href=\"" + document.location.protocol + "//github.com/Willsr71/MoodleUtils/raw/master/moodleutils.user.js\">[link]");
		log("Changelog: " + updaterVersion.changelog);
		//var win = window.open(document.location.protocol + "//github.com/Willsr71/MoodleUtils/raw/master/moodleutils.user.js");
	} else {
		log("No updates avaliable")
	}
	
	return updateAvaliable;
}

function createUpdater() {
	var updater = document.createElement("script");
	updater.src = document.location.protocol + "//willsr71.net/scripts/version.php?script=moodleutils&lang=javascript";
	updater.onload = function() {
		checkForUpdates();
	};
	(document.body || document.head || document.documentElement).appendChild(updater);
}

function readConfig() {
	var newconfig = JSON.parse(window.localStorage.getItem("moodleutils_config"));
	
	if (newconfig === null) {
		newconfig = configuration;
	}
	
	for (var x = 0; x < configoptions.length; x = x + 1) {
		if (newconfig[configoptions[x]] === undefined) {
			continue;
		}
		
		configuration[configoptions[x]] = newconfig[configoptions[x]];
	}
}

function initialize() {
	var container = document.createElement("div");
	var buttons = document.createElement("div");
	var logger = document.createElement("div");
	
	container.id = "moodleutils_panel";
	buttons.id = "moodleutils_buttons";
	logger.id = "moodleutils_logger";
	
	if (!configuration.showPanel) {
		container.style.display = "none";
	}
	
	if (!configuration.showButtons) {
		buttons.style.display = "none";
	}
	
	if (!configuration.showConsole) {
		logger.style.display = "none";
	}
	
	container.appendChild(buttons);
	container.appendChild(logger);
	
	(l("mod_quiz_navblock") || l("inst64") || l("inst4")).appendChild(container);
}

function hidePanel() {
	l("moodleutils_panel").style.display = "none";
}

function addButton(name, onclick) {	
	var button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", name);
	button.addEventListener("click", onclick);
	
	l("moodleutils_buttons").appendChild(button);
}

function checkLoaded() {
	if (!shouldLoad || databaselist.length - failedDatabaseCount == Object.size(databases)) {
		log("Loaded " + getData().length + " terms from localstorage");
		log("Loaded " + appendDatabases(getData()).length + " terms from " + (Object.size(databases) + 1) + " databases");
		log("Done.");
	} else {
		log("Waiting on " + (databaselist.length - failedDatabaseCount - Object.size(databases)) + " databases...");
	}
}

function addDatabase(name) {
	var script = document.createElement("script");
	script.src = document.location.protocol + "//willsr71.net/scripts/moodle/databases/" + name + ".js";
	script.onload = function() {
		log("Loaded " + databases[name].length + " terms from " + name);
		checkLoaded();
	};
	script.onerror = function() {
		log("Error loading database " + name);
		failedDatabaseCount = failedDatabaseCount + 1;
		checkLoaded();
	};
	(document.body || document.head || document.documentElement).appendChild(script);
}

function addDatabases() {
	for (var x = 0; x < databaselist.length; x = x + 1) {
		addDatabase(databaselist[x]);
	}
}

function appendDatabase(database, data) {
	if (database === undefined) {
		return data;
	}
	
	for (var x = 0; x < database.length; x = x + 1) {
		data.push(database[x]);
	}
	return data;
}

function appendDatabases(data) {
	for (var x = 0; x < databaselist.length; x = x + 1) {
		data = appendDatabase(databases[databaselist[x]], data);
	}
	
	return data;
}

function getData() {
	var data = JSON.parse(window.localStorage.getItem("moodleutils_local_database"));
	if (data === null || data === undefined) {
		setData([]);
		data = getData();
	}
	return data;
}

function setData(data) {
	window.localStorage.setItem("moodleutils_local_database", JSON.stringify(data));
}

function prettifyAnswer(answer) {
	answer = answer.split("ā").join("a");
	answer = answer.split("ē").join("e");
	answer = answer.split("ī").join("i");
	answer = answer.split("ō").join("o");
	answer = answer.split("ū").join("u");
	
	return answer;
}

function setValue(answerbox, answer) {
	if (answer === undefined || answer === "") {
		return 0;
	}

	answerbox.setAttribute("value", answer);
	return 1;
}

function setSelected(answerbox, answer) {
	if (answer === undefined || answer === "") {
		return 0;
	}
	
	for (var x = 0; x < answerbox.options.length; x = x + 1) {
		if (answerbox.options[x].innerHTML == answer) {
			answerbox.selectedIndex = x;
			return 1;
		}
	}
	return 0;
}

function parseAnswer(correcttext, questions, question){
	var qpos = correcttext.indexOf(question);
	var qposnext = correcttext.length;
	var answer;
	
	for (var x = 0; x < questions.length; x = x + 1) {
		var len = correcttext.indexOf(questions[x]);
		
		if (len <= qpos) {
			continue;
		}
		
		qposnext = Math.min(qposnext, len);
	}
	
	answer = correcttext.substring(qpos, qposnext);
	answer = answer.replace(question + " – ", "");
	if (answer.indexOf(", ") !== -1) {
		answer = answer.substring(0, answer.lastIndexOf(", "));
	}
	
	return answer;
}

function isPairSet(data, question) {
	for (var x = 0; x < data.length; x = x + 1) {
		if (data[x].q == question) {
			return true;
		}
	}
	return false;
}

function addPair(question, answer) {
	var data = getData();
	var pair = {q:question,a:answer};
	
	if(!isPairSet(appendDatabases(getData()), question)){
		console.info("Pushing pair " + question + " = " + answer);
		data.push(pair);
		setData(data);
		return 1;
	}
	return 0;
}

function getPair(question) {
	var data = appendDatabases(getData());
	for (var x = 0; x < data.length; x = x + 1) {
		if (data[x].q == question) {
			return data[x].a;
		}
	}
	return "";
}

function autoFill() {
	var count = 0;
	var totalcount = 0;
	var n = 0;
	while (true) {
		n = n + 1;
		var q = l("q" + n);
		
		if (q === null) {
			break;
		}
		
		if (q.classList.contains("informationitem")) {
			continue;
		}
		
		var contentnode = q.childNodes[1];
		var questionnode;
		var answernode;
		var question;
		var answerbox;
		var answer;
		
		if (q.classList.contains("shortanswer")) {
			question = contentnode.getElementsByClassName("qtext")[0].innerHTML;
			answerbox = contentnode.getElementsByClassName("answer")[0];
			answer = prettifyAnswer(getPair(question));
			count = count + setValue(answerbox.childNodes[0], answer);
			totalcount = totalcount + 1;
		} else if (q.classList.contains("multichoice")) {
			question = contentnode.getElementsByClassName("qtext")[0].innerHTML;
			answernode = contentnode.childNodes[0].getElementsByClassName("answer")[0];
			
			answer = getPair(question);
			
			var suba = answernode.firstChild;
			var subn = 0;
			while (true) {
				if (suba === null) {
					break;
				}
				
				if (suba.nodeName == "#text") {
					suba = suba.nextSibling;
					continue;
				}
				
				var subo = suba.childNodes[1].innerHTML;
				if (subo.indexOf(". ") == 1) {
					subo = subo.substr(3, subo.length);
				}
				
				if (subo == answer) {
					suba.childNodes[0].checked = "checked";
					count = count + 1;
				}
				
				subn = subn + 1;
				suba = suba.nextSibling;
			}
			totalcount = totalcount + 1;
		} else if (q.classList.contains("randomsamatch")) {
			questionnode = contentnode.childNodes[0].getElementsByClassName("answer")[0];
			
			var subq = questionnode.firstChild.firstChild;
			var subn = 0;
			while (true) {
				if (subq === null) {
					break;
				}
				
				question = subq.getElementsByClassName("text")[0].innerHTML;
				answerbox = subq.getElementsByClassName("select")[0];
				answer = getPair(question);
				count = count + setSelected(answerbox, answer);
				totalcount = totalcount + 1;
				
				subn = subn + 1;
				subq = subq.nextSibling;
			}
		}
	}
	
	log("Filled " + count + " answers out of " + totalcount + " on the page");
}

function autoRecord() {
	var count = 0;
	var totalcount = 0;
	var n = 0;
	while (true) {
		n = n + 1;
		var q = l("q" + n);
		
		if (q === null) {
			break;
		}
		
		if (q.classList.contains("informationitem")) {
			continue;
		}
		
		var contentnode = q.childNodes[1];
		var question;
		var answer;
		
		if (q.classList.contains("shortanswer")) {
			question = contentnode.childNodes[0].getElementsByClassName("qtext")[0].innerHTML;
			answer = contentnode.childNodes[1].getElementsByClassName("rightanswer")[0].innerHTML.replace("The correct answer is: ", "");
			count = count + addPair(question, answer);
			totalcount = totalcount + 1;
		} else if (q.classList.contains("multichoice")) {
			question = contentnode.childNodes[0].getElementsByClassName("qtext")[0].innerHTML;
			answer = contentnode.childNodes[1].getElementsByClassName("rightanswer")[0].innerHTML.replace("The correct answer is: ", "");
			count = count + addPair(question, answer);
			totalcount = totalcount + 1;
		} else if (q.classList.contains("randomsamatch")) {
			var correcttext = contentnode.childNodes[1].getElementsByClassName("rightanswer")[0].innerHTML.replace("The correct answer is: ", "");
			var questionnode = contentnode.childNodes[0].getElementsByClassName("answer")[0];
			var questions = [];
			
			var subq = questionnode.firstChild.firstChild;
			var subn = 0;
			while (true) {			
				if (subq === null) {
					break;
				}
				
				questions[subn] = subq.getElementsByClassName("text")[0].innerHTML;
				
				subn = subn + 1;
				subq = subq.nextSibling;
			}
			
			for (var x = 0; x < questions.length; x = x + 1) {
				answer = parseAnswer(correcttext, questions, questions[x]);
				
				if (answer !== "") {
					count = count + addPair(questions[x], answer);
				}
				
				totalcount = totalcount + 1;
			}
		}
	}
	
	log("Added " + count + " new answers out of " + totalcount + " on the page");
}

function autoClear() {
	var data = getData();
	var confirmmsg = "Are you sure you want to clear " + data.length + " answers?";
	var confirmed = confirm(confirmmsg);
	log(confirmmsg);
	log(confirmed);
	
	if (confirmed) {
		setData([]);
		
		log("Cleared " + data.length + " answers");
	}
}

main();
