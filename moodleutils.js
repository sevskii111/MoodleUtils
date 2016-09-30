var Option = {
	OptionsExpanded: false,
	TypeHeaders: true,
	ToolTips: true,
	Lang: "both",
	Chap: "all",
	Save: true,
	Debug: false
};
var counter = {
	Nouns: 0,
	Pronouns: 0,
	Adjectives: 0,
	Verbs: 0,
	Adverbs: 0,
	Prepositions: 0,
	Conjunctions: 0,
	EncliticParticles: 0
};
var version = 131;
var chMax = 11;
var x;
var word;
var noallow = [];
var wselected = [];
var expanded = [];
var words = [];
var endings = [];
var changelog;
var newVersion;
var oldVer;
function l(e) {
	return document.getElementById(e);
}

String.prototype.isEmpty = function() {
	if(this === '') {
		return true;
	} else {
		return false;
	}
};

function getCookie(name) {
	var parts = document.cookie.split(name + "=");
	if(parts.length === 2) {
		return parts.pop().split(";").shift();
	}
}

function createarray(y,w) {
	var out = "";
	var t = "";
	w = w.split("|");
	for(x = 0; x < w.length; x++) {
		t = w[x].split("=");
		out += '{type:"' + y + '"/lat:"' + t[0] + '",eng:"' + t[1] + '"},\n';
		//out += "{type:\"" + y + "\",lat:\"" + t[0] + "\",eng:\"" + t[1] + "\"},\n";
	}
	return out;
}

window.onload = function() {
	initChs();
	if (Option.Save) {
		loadCookie();
	}
	initWords();
	initEndings();
	
	l("optionsButton").onclick = function() {
		showOptions()
	};
	
	find();
	sendUpdateRequest();
	removeAlert();
};

function removeAlert() {
	l("removeByJs").innerHTML = "";
}

function sendUpdateRequest() {
	ajax('version.txt?', getUpdateRequest);
}

function getUpdateRequest(response, auto) {
	response = response.split("|");
	newVersion = parseInt(response[0]);
	changelog = response[1].split(";");
	console.log("[UPDATE] Old=" + oldVer + " Curr=" + version + " New=" + newVersion);
	if (newVersion > version){
		console.log("[UPDATE] New version avaliable");
		var msg="New version avaliable: v"+newVersion;
		msg+="\nRefresh to get it.";
		msg+="\n\nChangelog:";
		for(x=0;x<changelog.length;x++){
			msg+="\n"+changelog[x];
		}
		alert(msg);
	}else if(oldVer<version){
		console.log("[UPDATE] Updated to new version");
		var msg="Updated to v"+version+"!";
		msg+="\n\nChangelog:";
		for(x=0;x<changelog.length;x++){
			msg+="\n"+changelog[x];
		}
		alert(msg);
	}else{
		console.log("[UPDATE] No new version information avaliable");
	}
}
function initChs(){
	var html='';
	for(x=1;x<=chMax;x++){
		html+='<option value="'+x+'">Ch '+x+'</option>';
	}
	l("chapSelect").innerHTML+=html;
	l("bnoun").onclick=function(){buttonflip(this)};
	l("bpron").onclick=function(){buttonflip(this)};
	l("badje").onclick=function(){buttonflip(this)};
	l("bverb").onclick=function(){buttonflip(this)};
	l("badve").onclick=function(){buttonflip(this)};
	l("bprep").onclick=function(){buttonflip(this)};
	l("bconj").onclick=function(){buttonflip(this)};
	l("bencl").onclick=function(){buttonflip(this)};
}
function showOptions(){
	l("optionsButton").innerHTML="Options \u25B2";
	l("optionsButton").onclick=function(){hideOptions()};
	l("topPadding").style.paddingTop="90px";
	l("options").style.display="block";
	Option.OptionsExpanded=true;
	saveCookie();
}
function hideOptions(){
	l("optionsButton").innerHTML="Options \u25BC";
	l("optionsButton").onclick=function(){showOptions()};
	l("topPadding").style.paddingTop="65px";
	l("options").style.display="none";
	Option.OptionsExpanded=false;
	saveCookie();
}
function updateOptions(){
	Option.TypeHeaders=l("optionTypeHeaders").title=="true";
	Option.ToolTips=l("optionToolTips").title=="true";
	find();
}
function resetOptions(){
	Option.OptionsExpanded=false;
	Option.TypeHeaders=true;
	Option.ToolTips=true;
	Option.Lang="both";
	Option.Chap="all";
	Option.Save=true;
	l("word").value="";
	noallow=[];
	expanded=[];
	if(l("bnoun").title=="false"){l("bnoun").title=true;buttonStyleFlip("bnoun");}
	if(l("bpron").title=="false"){l("bpron").title=true;buttonStyleFlip("bpron");}
	if(l("badje").title=="false"){l("badje").title=true;buttonStyleFlip("badje");}
	if(l("bverb").title=="false"){l("bverb").title=true;buttonStyleFlip("bverb");}
	if(l("badve").title=="false"){l("badve").title=true;buttonStyleFlip("badve");}
	if(l("bprep").title=="false"){l("bprep").title=true;buttonStyleFlip("bprep");}
	if(l("bconj").title=="false"){l("bconj").title=true;buttonStyleFlip("bconj");}
	if(l("bencl").title=="false"){l("bencl").title=true;buttonStyleFlip("bencl");}
	find();
	loadCookie("LatinSave=v"+version+"|*|both|all|false|true|true|*|*|END;");
}
function buttonflip(b){
	if(b.title=="true"){
		b.title=false;
		b.style.backgroundColor="red";
	}else{
		b.title=true;
		b.style.backgroundColor="green";
	}
	find();
}
function buttonFlipV(b){var c;
	if(b.id=="optionTypeHeaders") c=Option.TypeHeaders;
	else if(b.id=="optionToolTips") c=Option.ToolTips;
	if(c){
		c=false;
		b.innerHTML="OFF (Turn On)";
	}else{
		c=true;
		b.innerHTML="ON (Turn Off)";
	}
	if(b.id=="optionTypeHeaders") Option.TypeHeaders=c;
	else if(b.id=="optionToolTips") Option.ToolTips=c;
	find();
}
function buttonStyleFlip(b){
	b=l(b);
	if(b.title=="true") b.style.backgroundColor="green";
	else b.style.backgroundColor="red";
}
function compress(what,me){
	if(me===true){
		l(what.id).style.display="none";
		if(Option.ToolTips){l("w"+(what.id.split("e")[1])).title="Click to expand";}
		l("w"+(what.id.split("e")[1])).onclick=function(){expand(this)};
		expanded.splice(expanded.indexOf(l("wlat"+(what.id.split("e")[1])).innerHTML),1);
	}else{
		l("e"+(what.id.split("w")[1])).style.display="none";
		if(Option.ToolTips){l(what.id).title="Click to expand";}
		l(what.id).onclick=function(){expand(this)};
		expanded.splice(expanded.indexOf(l("wlat"+(what.id.split("w")[1])).innerHTML),1);
	}
	saveCookie();
}
function compressAll(){
	expanded=[];
	find();
}
function expand(what){
	l("e"+(what.id.split("w")[1])).style.display="table-row";
	if(Option.ToolTips){l(what.id).title="Click to compress";}
	l(what.id).onclick=function(){compress(this, false)};
	expanded.push(l("wlat"+(what.id.split("w")[1])).innerHTML);
	saveCookie();
}
function checkChapter(chap){
	if(chap.indexOf(",")!=-1){
		chap=chap.split(", ");
		for(y=0;y<chap.length;y++){
			if(chap[y]==Option.Chap) return true;
		}
	}else{
		if(chap==Option.Chap) return true;
		else return false;
	}
}
function checkForMatch(word,type,lat,eng){
	var latR=false;
	var engR=false;
	if(noallow.indexOf(type)!==-1) return false;
	if(lat.toLowerCase().indexOf(word)!==-1) latR=true;
	if(eng.toLowerCase().indexOf(word)!==-1) engR=true;
	if(Option.Lang=="both") if(latR||engR) return true;
	else if(Option.Lang=="latin"&&latR) return true;
	else if(Option.Lang=="english"&&engR) return true;
	else return false;
}
function find(){
	word=(l("word").value).trim().toLowerCase();
	wselected=[];
	noallow=[];
	Option.Lang=l("langSelect").value;
	Option.Chap=l("chapSelect").value;
	if(l("bnoun").title=="false") noallow.push("Noun");
	if(l("bpron").title=="false") noallow.push("Pronoun");
	if(l("badje").title=="false") noallow.push("Adjective");
	if(l("bverb").title=="false") noallow.push("Verb");
	if(l("badve").title=="false") noallow.push("Adverb");
	if(l("bprep").title=="false") noallow.push("Preposition");
	if(l("bconj").title=="false") noallow.push("Conjunction");
	if(l("bencl").title=="false") noallow.push("Enclitic Particle");
	if(Option.Chap=="all"){
		for(x=0;x<words.length;x++){
			if(checkForMatch(word,words[x].type,words[x].lat,words[x].eng)) wselected.push(words[x]);
		}
	}else{
		for(x=0;x<words.length;x++){
			if(checkForMatch(word,words[x].type,words[x].lat,words[x].eng)&&checkChapter(words[x].ch)) wselected.push(words[x]);
		}
	}
	renderwords();
	if(Option.Save) saveCookie();
	return wselected;
}
function renderwords(){var tr;var td;var latin;var english;var info;
	var completed=[];
	for(x=0;x<noallow.length;x++){
		completed.push(noallow[x]);
	}
	var HTML="";
	for(x=0;x<wselected.length;x++){
		if(completed.indexOf(wselected[x].type)===-1){
			completed.push(wselected[x].type);
			if(Option.TypeHeaders){
				HTML+='<tr class="table-title"><td style="font-size:20px;padding-left:30px">'+wselected[x].type+'s</td><td></td></tr>';
			}
		}
		tr='<tr id="w'+x+'"';
		if(Option.ToolTips){tr+=' title="Click to expand"';}
		if((x%2)===0){tr+=' class="table-other"';}
		tr+='>';
		latin='<td class="tablepadding" id="wlat'+x+'">'+wselected[x].lat+'</td>';
		english='<td class="tablepadding">'+wselected[x].eng+'</td>';
		HTML+=tr+latin+english+'</tr>';

		tr='<tr id="e'+x+'"';
		if(Option.ToolTips){tr+=' title="Click to compress"';}
		if(expanded.indexOf(wselected[x].lat)===-1){tr+=' style="display:none"';}
		if((x%2)===0){tr+=' class="table-other"';}
		tr+='>';
		td='<td class="tablepadding"';
		if(endify(wselected[x].lat,wselected[x].type,wselected[x].decl,wselected[x].conj)==''){td+=' colspan="2"';}
		info=td+'>';
		info+='<b>Type:</b> '+wselected[x].type;
		info+='<br /><b>Chapter:</b> '+wselected[x].ch;
		if(wselected[x].type=="Noun"&&wselected[x].decl.isEmpty()){info+='<br /><b>Declension:</b> '+wselected[x].decl;}
		else if(wselected[x].type=="Verb"&&wselected[x].conj.isEmpty()){info+='<br /><b>Conjugation:</b> '+wselected[x].conj;}
		if(wselected[x].derv.isEmpty()) info+='<br /><b>Derivitives:</b> '+wselected[x].derv;
		info+='</td>';
		
		info+=endify(wselected[x].lat,wselected[x].type,wselected[x].decl,wselected[x].conj);
		
		HTML+=tr+info+'</tr>';
	}
	l("table").innerHTML='<tr style="text-align:center;cursor:auto"><td>Latin</td><td>English</td></tr>'+HTML;
	for(x=0;x<wselected.length;x++){
		l("w"+x).onclick=function(){expand(this)};
		l("e"+x).onclick=function(){compress(this, true)};
	}
	if(wselected.length===0){
		l("results").innerHTML='<a style="color:red">No results</a>';
	}else if(wselected.length!==1){
		l("results").innerHTML=wselected.length+" results";
	}else{
		l("results").innerHTML="1 result";
	}
}

function endify(what,type,decl,conj){
	pre='<td class="tablepadding"><table border="0" style="width:initial"><tbody>';
	post='</tbody></table></td>';
	if(type=="Noun"){
		return pre+endifyNoun(what,decl)+post;
	}else if(type=="Verb"){
		return pre+endifyVerb(what,conj)+post;
	}else{
		return '';
	}
}

function endifyNoun(what,decl){var f='';
	var stem=(what).split(",")[0];
	var word=what.split(",")[0];
	if(decl=="First"){
		stem=stem.slice(0,stem.length-1);
		declension.curr=declension.first;
	}else if(decl=="Second M"){
		stem=stem.slice(0,stem.length-2);
		declension.curr=declension.secondM;
	}else if(decl=="Second N"){
		stem=stem.slice(0,stem.length-2);
		declension.curr=declension.secondN;
	}else if(decl=="Third"){
		stem=stem.slice(0,stem.length-2);
		declension.curr=declension.thirdM;
		console.log("[ENDIFIER] [ThirdM] "+what+" | "+word.slice(word.length-2,word.length));
		declension.curr[0]=word.slice(word.length-2,word.length);
	}else if(decl=="Third F"){
		stem=stem.slice(0,stem.length-2);
		declension.curr=declension.thirdF;
		console.log("[ENDIFIER] [ThirdF] "+what+" | "+word.slice(word.length-2,word.length));
	}else if(decl=="Third N"){
		stem=stem.slice(0,stem.length-2);
		declension.curr=declension.thirdN;
		console.log("[ENDIFIER] [ThirdN] "+what+" | "+word.slice(word.length-2,word.length));
	}else{
		declension.curr=["","","","","","","","","",""];
	}
	f+='<tr><td><b>Nominitive</b></td><td>'+(stem+declension.curr[0])+'</td><td>'+(stem+declension.curr[5])+'</td></tr>';
	f+='<tr><td><b>Genative</b></td><td>'+(stem+declension.curr[1])+'</td><td>'+(stem+declension.curr[6])+'</td></tr>';
	f+='<tr><td><b>Dative</b></td><td>'+(stem+declension.curr[2])+'</td><td>'+(stem+declension.curr[7])+'</td></tr>';
	f+='<tr><td><b>Accusative</b></td><td>'+(stem+declension.curr[3])+'</td><td>'+(stem+declension.curr[8])+'</td></tr>';
	f+='<tr><td><b>Ablative</b></td><td>'+(stem+declension.curr[4])+'</td><td>'+(stem+declension.curr[9])+'</td></tr>';
	return f;
}
function endifyVerb(what,conj){var f='';
	return f;
}

function buildNormal(x){/*console.log("buildNormal [ "+x+" ]");*/if(x==="") return "*"; else return x;}
function buildArray(x){/*console.log("buildArray [ "+x+" ]");*/if(x.length===0) return "*"; else return x.join(":");}
function buildInt(x){/*console.log("buildInt [ "+x+" ]");*/if(x.isNaN===true) return "*"; else return x.toString();}
function getNormal(x){/*console.log("getNormal [ "+x+" ]");*/if(x=="*") return ""; else return x;}
function getArray(x){/*console.log("getArray [ "+x+" ]");*/if(x=="*") return []; else return x.split(":");}
function getBool(x){/*console.log("getBool [ "+x+" ]");*/if(x=="true"||x===true) return true; else return false;}
function getInt(x){/*console.log(getInt [ "+x+" ]");*/if(x=="*") return 0; else return parseInt(x);}
function saveCookie(){
	var str="LatinSave";
	var build="v"+buildInt(version)+"|";//str[0]
	var expires="Fri, 31 Dec 9999 23:59:59 GMT";
	var path="/";
	build+=""+buildNormal(word);//str[1]
	build+="|"+Option.Lang;//str[2]
	build+="|"+Option.Chap;//str[3]
	build+="|"+Option.OptionsExpanded;//str[4]
	build+="|"+Option.TypeHeaders;//str[5]
	build+="|"+Option.ToolTips;//str[6]
	build+="|"+buildArray(noallow);//str[7]
	build+="|"+buildArray(expanded);//str[8]
	build+="|END";//str[9]
	str+="="+build+"; ";
	str+="expires="+expires+"; ";
	str+="path="+path;
	document.cookie=str;
	console.log("[BUILDER] "+build);
	return str;
}
function loadCookie(str){var temp;
	if(str===undefined){
		str=getCookie("LatinSave");
		if(str===undefined) return false;
	}else{
		str=str.split(";")[0];
		str=str.split("=")[1];
	}
	str=str.split("|");
	str.pop();
	console.log("[LOADER] "+str);
	if(Option.Debug===true){
		for(var y=0;y<str.length;y++){
			console.log("[LOADER "+y+"] "+str[y]);
		}
	}
	oldVer=getInt(str[0].slice(1,str[0].length));
	extractData("all",str);
	loadUrl();
	return true;
}
function loadUrl(){var t;
	var u=window.location.search;
	console.log("[URL] "+u);
	if(u.indexOf("?")!==-1){
		console.log("[URL] LOADING FROM URL");
		u=u.slice(1,u.length);
		u=u.split("&");
		for(x=0;x<u.length;x++){
			u[x]=u[x].split("=");
			console.log(u[x]);
			var v1=u[x][0];
			var v2=u[x][1];
			extractData(v1,v2);
		}
		find();
	}else{
		console.log("[URL] NO URL AVALIABLE");
	}
}
function extractData(what, str){
	console.log("[EXTRACTOR] "+what+" = "+str);
	if(what=="all"){
		word=getNormal(str[1]);
		Option.Lang=str[2];
		Option.Chap=str[3];
		Option.OptionsExpanded=getBool(str[4]);
		Option.TypeHeaders=getBool(str[5]);
		Option.ToolTips=getBool(str[6]);
		noallow=getArray(str[7]);
		expanded=getArray(str[8]);
		l("word").value=word;
		l("langSelect").value=Option.Lang;
		l("chapSelect").value=Option.Chap;
		if(Option.OptionsExpanded) showOptions();
		else if(!Option.OptionsExpanded) hideOptions();
		if(!Option.TypeHeaders) l("optionTypeHeaders").innerHTML="OFF (Turn On)";
		if(!Option.ToolTips) l("optionToolTips").innerHTML="OFF (Turn On)";
		if(noallow.indexOf("Noun")!==-1){l("bnoun").title=false;buttonStyleFlip("bnoun");}
		if(noallow.indexOf("Pronoun")!==-1){l("bpron").title=false;buttonStyleFlip("bpron");}
		if(noallow.indexOf("Adjective")!==-1){l("badje").title=false;buttonStyleFlip("badje");}
		if(noallow.indexOf("Verb")!==-1){l("bverb").title=false;buttonStyleFlip("bverb");}
		if(noallow.indexOf("Adverb")!==-1){l("badve").title=false;buttonStyleFlip("badve");}
		if(noallow.indexOf("Preposition")!==-1){l("bprep").title=false;buttonStyleFlip("bprep");}
		if(noallow.indexOf("Conjunction")!==-1){l("bconj").title=false;buttonStyleFlip("bconj");}
		if(noallow.indexOf("Enclitic Particle")!==-1){l("bencl").title=false;buttonStyleFlip("bencl");}
	}else{
		if(what=="word"){word=str;l("word").value=word;}
		else if(what=="lang"){Option.Lang=str;l("langSelect").value=Option.Lang;}
		else if(what=="chap"){Option.Chap=str;l("chapSelect").value=Option.Chap;}
		else if(what=="optionsExpanded"){Option.OptionsExpanded=getBool(str);if(Option.OptionsExpanded) showOptions(); else if(!Option.OptionsExpanded) hideOptions();}
		else if(what=="typeHeaders"){Option.TypeHeaders=getBool(str);if(!Option.TypeHeaders) l("optionTypeHeaders").innerHTML="OFF (Turn On)";}
		else if(what=="toolTips"){Option.ToolTips=getBool(str);if(!Option.ToolTips) l("optionToolTips").innerHTML="OFF (Turn On)";}
		else if(what=="noallow"){
			noallow=getArray(str);
			if(noallow.indexOf("Noun")!==-1){l("bnoun").title=false;buttonStyleFlip("bnoun");}
			if(noallow.indexOf("Pronoun")!==-1){l("bpron").title=false;buttonStyleFlip("bpron");}
			if(noallow.indexOf("Adjective")!==-1){l("badje").title=false;buttonStyleFlip("badje");}
			if(noallow.indexOf("Verb")!==-1){l("bverb").title=false;buttonStyleFlip("bverb");}
			if(noallow.indexOf("Adverb")!==-1){l("badve").title=false;buttonStyleFlip("badve");}
			if(noallow.indexOf("Preposition")!==-1){l("bprep").title=false;buttonStyleFlip("bprep");}
			if(noallow.indexOf("Conjunction")!==-1){l("bconj").title=false;buttonStyleFlip("bconj");}
			if(noallow.indexOf("Enclitic Particle")!==-1){l("bencl").title=false;buttonStyleFlip("bencl");}
		}
		else if(what=="expanded"){
			for(x=0;x<str.length;x++){
				str=str.replace("%s"," ");
			}
			expanded=getArray(str);
		}
	}
}
