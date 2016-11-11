
// Init
var autoBlacklist = typeof(localStorage.autoBlacklist)=='undefined' ? [] : JSON.parse(localStorage.autoBlacklist);
var autoWhitelist = typeof(localStorage.autoWhitelist)=='undefined' ? [] : JSON.parse(localStorage.autoWhitelist);
var pause = false;
var domainsDetecting = [];

// Functions
function in_array(needle, haystack) {
	for(key in haystack) if(haystack[key]==needle) return true;
	return false;
}
function domainChange(domain, action) { // 0: remove, 1:, whitelist, 2: blacklist
	if(action<2 && in_array(domain, autoBlacklist)) {
		autoBlacklist.splice(autoBlacklist.indexOf(domain), 1);
		localStorage.autoBlacklist = JSON.stringify(autoBlacklist);
	}
	if(action!=1 && in_array(domain, autoWhitelist)) {
		autoWhitelist.splice(autoWhitelist.indexOf(domain), 1);
		localStorage.autoWhitelist = JSON.stringify(autoWhitelist);
	}
	
	var listID = ['autoWhitelist', 'autoBlacklist'][action-1];
	if(action>0 && !in_array(domain, window[listID])) {
		window[listID].push(domain);
		localStorage[listID] = JSON.stringify(window[listID]);
	}
}

function domainCheck(domain, inIncognitoContext) {
	if(in_array(domain, autoBlacklist)) return false;
	if(in_array(domain, autoWhitelist)) return true;
	
	// Detect, if not incognito and not already detecting this domain
	var ssl = false;
	if(!inIncognitoContext && !in_array(domain, domainsDetecting)) {
		domainsDetecting.push(domain);
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() { 
			if(xhr.readyState==4) {
				if(!in_array(domain, autoBlacklist)) { // Don't whitelist if the infinite loop detection in onBeforeRedirect happened to blacklist it recently
					ssl = in_array(xhr.status, [200, 204]);
					domainChange(domain, ssl?1:2);
				}
				domainsDetecting.splice(domainsDetecting.indexOf(domain), 1);
			}
		};
		// Timeout disabled and xhr set to async, since timeout isn't working (TODO: fix it)
		// Awaiting Chromium issue 105656: https://code.google.com/p/chromium/issues/detail?id=105656
		//xhr.timeout = 1000; // We wanna have a short timeout to avoid hanging the browser too long
		//var timer = setTimeout(function(xhr) { xhr.abort(); }, 1000, xhr);
		xhr.open('GET', 'https://'+domain+'/', true);
		try {
			xhr.send(null);
		} catch (e) {
			domainChange(domain, 2);
			domainsDetecting.splice(domainsDetecting.indexOf(domain), 1);
		}
		//if(typeof(timer)!='undefined') clearTimeout(timer);
	}
	
	return ssl;
}

chrome.webRequest.onHeadersReceived.addListener(function(details) {
	// Blacklist domains that redirect from SSL to unencrypted HTTP
	if(!pause && (new RegExp('^HTTP/1\.1 30[01237]').test(details.statusLine))) {
		for(var i in details.responseHeaders) {
			if(details.responseHeaders[i].name.toLowerCase() == 'location') {
				var headerVal = details.responseHeaders[i].value;
				
				// Strips out any username and password for privacy reasons and just gets the domain
				var url = new RegExp('^https://([^/@]+@)?([^/@]+)(?:/(.*))?').exec(details.url);
				var urlRedirect = new RegExp('^http://([^/@]+@)?([^/@]+)(?:/(.*))?').exec(headerVal);
				
				if(urlRedirect!==null && urlRedirect[2] == url[2] && !chrome.extension.inIncognitoContext) domainChange(url[2], 2);
			}
		}
	}
}, {urls:['https://*/*']}, ['blocking','responseHeaders']);

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	var retval = {};
	
	// Redirection is disabled on sub_frame's, since they're on mixed content pages, either http parent frame which
	// doesn't allow ssl sub_frame's or ssl parent which blocks http requests before we get to redirect them
	if(!pause && details.type!='sub_frame') {
		// Strips out any username and password for privacy reasons and just gets the domain
		var url = (new RegExp('^http://([^/@]+@)?([^/@]+)/(.*)').exec(details.url));
		var domain = url[2];
		
		if(domainCheck(domain, chrome.extension.inIncognitoContext))
			retval = { redirectUrl: 'https://' + details.url.substr(7) }; // Redirect the requested domain
	}
	
	return retval;
}, {urls:['http://*/*']}, ['blocking']);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.a) {
		case 'pause':
			if(!chrome.extension.inIncognitoContext) pause = request.pause;
			sendResponse({});
			break;
		case 'paused':
			sendResponse({paused:pause});
			break;
		case 'clear':
			var listID = ['autoWhitelist','autoBlacklist'][request.listID];
			
			window[listID] = [];
			localStorage[listID] = JSON.stringify(window[listID]);
			
			sendResponse({});
			break;
		case 'domainAction': // 0: redetect, 1: enforce, 2: ignore, 3: remove
			if(!chrome.extension.inIncognitoContext) {
				domainChange(request.domain, request.action==3 ? 0 : request.action);
				if(request.action==0) domainCheck(request.domain, false);
			}
			sendResponse({});
			break;
	}
});
