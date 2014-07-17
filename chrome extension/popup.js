
// Functions
function domainboxHandler(action) {
	var action = typeof action !== 'undefined' ? action : 0; // Default: redetect
	var domain = $('#domain').text();
	var scheme = $('#protocol').text().toLowerCase();
	
	if(domain=='Special page') {
		msgbubble('This type of page is not supported.');
	} else if(tabSelected.incognito) {
		msgbubble('The cached list of sites can\'t be changed from incognito mode.');
	} else {
		chrome.extension.sendMessage({a:'domainAction', domain:domain, action:action, tab:tabSelected}, function(response) {
			$('#status').html(['Redetecting','Enforcing','Ignoring'][action]+' '+domain+'.').show('slow');
			switch(action) {
				case 0: // Redetect
					if(response.result && scheme=='http') chrome.tabs.update(tabSelected.id, {url:'https://'+tabSelected.url.substr(7)});
					else if(!response.result && scheme=='https') chrome.tabs.update(tabSelected.id, {url:'http://'+tabSelected.url.substr(8)});
					break;
				case 1: // Whitelist
					if(scheme=='http') chrome.tabs.update(tabSelected.id, {url:'https://'+tabSelected.url.substr(7)});
					break;
				case 2: // Blacklist
					if(scheme=='https') chrome.tabs.update(tabSelected.id, {url:'http://'+tabSelected.url.substr(8)});
					break;
			}			tabUpdate();
			msgbubble();
		});
	}
	return false;
}
function domainboxHandlerRedetect() {
	domainboxHandler(0);
}
function domainboxHandlerEnforce() {
	domainboxHandler(1);
}
function domainboxHandlerIgnore() {
	domainboxHandler(2);
}
function msgbubble(msg) {
	if(typeof(msg)!='undefined') $('#status').html(msg).show('slow');
	if(typeof(timer)=='number') clearTimeout(timer);
	timer = setTimeout(function() { $("#status").hide("slow"); }, 10000);
}
function pause() {
	if(tabSelected.incognito) msgbubble('Settings can\'t be changed from incognito mode.');
	else {
		var pause = $('#pause').html() == 'Pause';
		chrome.extension.sendMessage({a:'pause', pause:pause}, function(response) {
			chrome.browserAction.setBadgeText({text:pause?'II':''});
			$('#pause').html(pause?'Unpause':'Pause');
			msgbubble(
				pause ? 'The extension is now paused until it is restarted or manually unpaused.' :
				'The extension is now unpaused.'
			);
		});
	}
	return false;
}
function tabUpdate() {
	chrome.tabs.getSelected(undefined, function(tab) {
		tabSelected = tab;
		var urlSplit = tab.url.toLowerCase().match('^(https?)://([a-z0-9-.]+)/');
		$('#domain').text(urlSplit ? urlSplit[2] : 'Special page');
		$('#protocol').text(urlSplit ? urlSplit[1].toUpperCase() : 'N/A');
	});
}
$(tabUpdate);
$(function() {
	chrome.extension.sendMessage({a:'paused'}, function(response) {
		var pause = response.paused;
		chrome.browserAction.setBadgeText({text:pause?'II':''});
		$('#pause').html(pause?'Unpause':'Pause');
	});
});


// Init
var tabSelected;

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#domainboxForm').addEventListener('submit', domainboxHandler);
	document.querySelector('#buttonRedetect').addEventListener('click', domainboxHandlerRedetect);
	document.querySelector('#buttonEnforce').addEventListener('click', domainboxHandlerEnforce);
	document.querySelector('#buttonIgnore').addEventListener('click', domainboxHandlerIgnore);
	document.querySelector('#pause').addEventListener('click', pause);
});


