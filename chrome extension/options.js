
// Functions
function domainboxHandler(action) {
	var action = typeof action !== 'undefined' ? action : 0; // Default: redetect
	var domain = $('input[name=domain]').val();
	$('#divShow').hide('fast');
	
	// Validate domain
	var domainValidator = new RegExp('^[a-z0-9]([a-z0-9.-]*[a-z0-9.])?$');
	
	if(typeof(timer)!='undefined') clearTimeout(timer);
	
	if(!(domainValidator.test(domain.toLowerCase()))) {
		$('#status').html('<strong>Error</strong><br/>Invalid domain.').show('slow');
		timer = setTimeout(function() { $("#status").hide("slow"); }, 10000);
	}else{
		domainHandler(domain, action);
		$('[name=domain]').val('');
		$('#status').html(['Redetecting','Enforcing','Ignoring'][action]+' '+domain+'.<br/><br/>Note that domains with and without www are two separate domains and need to be specified separately.').show('slow');
		timer = setTimeout(function() { $("#status").hide("slow"); }, 10000);
	}
	return false;
}
function domainboxHandlerRedetect(evt) {
	domainboxHandler(0);
	evt.preventDefault();
}
function domainboxHandlerEnforce() {
	domainboxHandler(1);
}
function domainboxHandlerIgnore() {
	domainboxHandler(2);
}

function domainHandler(domain, action) {
	chrome.extension.sendMessage({a:'domainAction', action:action, domain:domain}, action==3?listUpdate:function(){});
}
function listUpdate() {
	var div = $('#divShow');
	var listType = div.find('.type').text();
	var list = (listType==1?'autoWhitelist':'autoBlacklist');
	var list = typeof(localStorage[list])=='undefined' ? [] : JSON.parse(localStorage[list]);
	
	var listCompiled = '';
	if(list.length==0) listCompiled = '[Empty]';
	else {
		list.sort();
		for(i in list) listCompiled += '<div><span class="domain">'+list[i]+'</span> <a href="#" style="color:#f00;" id="listDelLink'+i+'">X</a></div>';
	}
	
	div.html(
		'<h2><span style="display:none" class="type">'+listType+'</span>'+(listType==1?'Enforced':'Ignored')+'</h2>'+
		'<div class="listclear"><a href="#" id="linkClear">Clear list</a></div>'+
		'<div class="list">'+listCompiled+'</div>'
	);
	for(i in list) document.querySelector('#listDelLink'+i).addEventListener('click', function(evt) {
		domainHandler($(this).siblings('span.domain')[0].textContent, 3);
		evt.preventDefault();
	});
	document.querySelector('#linkClear').addEventListener('click', listType==1 ? listclearWhitelist : listclearBlacklist);
}
function divToggle(type) { // 1=whitelist, 2=blacklist
	var divShow = function() {
		div.find('.type').text(type);
		listUpdate();
		div.show('fast');
	}
	var div = $('#divShow');
	if(div.is(':visible')) div.hide('fast',div.find('.type').text()!=type?divShow:function() {});
	else divShow();
	return false;
}
function listclear(type) {
	if(confirm('Remove all cached entries from the '+(['enforce','ignore'][type-1])+' list?'))
		chrome.extension.sendMessage({a:'clear', listID:type-1}, listUpdate);
	return false;
}
function toggleEnforcedList() {
	return divToggle(1);
}
function toggleIgnoredList() {
	return divToggle(2);
}
function listclearWhitelist(evt) {
	listclear(1);
	evt.preventDefault();
}
function listclearBlacklist(evt) {
	listclear(2);
	evt.preventDefault();
}

// Init
document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#domainboxForm').addEventListener('submit', domainboxHandlerRedetect);
	document.querySelector('#buttonRedetect').addEventListener('click', domainboxHandlerRedetect);
	document.querySelector('#buttonEnforce').addEventListener('click', domainboxHandlerEnforce);
	document.querySelector('#buttonIgnore').addEventListener('click', domainboxHandlerIgnore);
	document.querySelector('#linkEnforced').addEventListener('click', toggleEnforcedList);
	document.querySelector('#linkIgnored').addEventListener('click', toggleIgnoredList);
});


