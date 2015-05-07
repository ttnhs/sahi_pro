var counter = 1;   
var qsParm = new Array();
var statusTimer = {};
var running = 0;
var checkedNodes = [];
var adjustDeltaX = -117;
var adjustReportsDeltaX = -115;
var adjustNodesDeltaX = -120;
var __queuedKeyupTimer = null;
var __queuedOnchangeTimer = null;
var attemptToOpenTab = 0;
var tempTab = 1;
var closeBaseSaveAsTab = false;
var e_history = "";
var getE_history = null;
var getNodes_info = null;
var getDiffMaster_info = null;
var getReports_info = null;
var beforeEditRoot = null;
var beforeEditFile = null;
var beforeEditText = null;
var beforeEditIsFile = false;
var isTreeInEditMode = false;
var selectedInput = null;
var port = null;
var xmlTemplate = null;
var drunXmlTemplate = null;
var drunDiffInitiatorXmlTemplate = null;
var parallelTargetsTemplate = null;
var targetTemplate = null;
var targetDrunTemplate = null;
var targetDrunDiffInitiatorTemplate = null;
var targetTemplateRetry = null;
var targetDrunTemplateRetry = null;
var targetDrunDiffInitiatorTemplateRetry = null;
var targetFailTemplateRetry = null;
var targetFailTemplate = null;
var emailTriggerData = [{"id":'success', "text":"success"}, {"id":'failure', "text":"failure"}];
var _scriptDirList = getScriptDirs();
var _scriptsList = [];
var g_checkDirty = true;
var emailPasswordHidden = true;


onkeydown = function(e){
    e = !e ? window.event : e;
    var ctrlShiftS = e.ctrlKey && e.shiftKey && e.keyCode == 'S'.charCodeAt(0);
    var ctrlS = e.ctrlKey && e.keyCode == 'S'.charCodeAt(0);
    var altO = e.altKey && e.keyCode == 'O'.charCodeAt(0);
    var altF2 = e.altKey && e.keyCode == '113';
    var F2 = e.keyCode == '113';
    var del = e.keyCode == '46';
    var altN = e.altKey && e.keyCode == 'N'.charCodeAt(0);
	    if(ctrlShiftS){
	    	if (e.preventDefault) e.preventDefault();
	    	if (e.stopPropogation) e.stopPropogation();
	    	saveAll();
	    }
	    else if(ctrlS){
	    	if (e.preventDefault) e.preventDefault();
	    	if (e.stopPropogation) e.stopPropogation();
	    	saveSelected();
	    }
	    else if(altO){
 			if (e.preventDefault) e.preventDefault();
 			if (e.stopPropogation) e.stopPropogation();
 			window.setTimeout("openLoadModal();", 1);
 		}
	    else if(altF2){
 			if (e.preventDefault) e.preventDefault();
 			if (e.stopPropogation) e.stopPropogation();
 			window.setTimeout("openSaveAsModal();", 1);
 		}
	    else if(F2) {
	    	if (e.preventDefault) e.preventDefault();
			if (e.stopPropogation) e.stopPropogation();
			window.setTimeout("renameNode();", 1);
	    }
	    else if (del && !isTreeInEditMode && !selectedInput) {
	    	if (e.preventDefault) e.preventDefault();
			if (e.stopPropogation) e.stopPropogation();
			window.setTimeout("deleteNode();", 1);
	    }
	    else if(altN){
 			if (e.preventDefault) e.preventDefault();
 			if (e.stopPropogation) e.stopPropogation();
 			window.setTimeout("createNewFile();", 1);
 		}
    if (e.keyCode == 27) {
		if(!jQuery('#w2').window('options').closed){
			closeWindow('w2');
		} else if(!jQuery('#w3').window('options').closed){
			closeWindow('w3');
		} else{
			if(!jQuery('#w4').window('options').closed){
				if(isTooltipOpen('paramEditor') || isTooltipOpen('nodesEditor') || isTooltipOpen('reportsEditor')){
					paramEditorDisplayNone();
					nodesEditorDisplayNone();
					reportEditorDisplayNone();
				}
				else{
					closeWindow('w4');
				}
			}
			if(isLoadDialogOpened()){
				closeWindow('loadDialog');
			}
			if(isSaveAsDialogOpened()){
				closeWindow('saveAsDialog');
			}
			if(!jQuery('#newDialog').window('options').closed){
				closeWindow('newDialog');
			}
			if(!jQuery('#w').window('options').closed){
				closeWindow('w');
			}
		}
	}
}

	function isTooltipOpen(id){
		var tip = jQuery('#'+id).tooltip('tip');
		if(tip && tip[0].style.display != "none"){
			return true;
		}
		return false;
	}
	
	function isLoadDialogOpened() {
		return !jQuery('#loadDialog').window('options').closed;
	}

	function isSaveAsDialogOpened() {
		return !jQuery('#saveAsDialog').window('options').closed;
	}

	function loadDirScripts(record){
		var dir = record.text;
		jQuery('#load_f_dir').combobox('loadData',getScripts(dir));
	}

	function getScriptDirs(){
		if(_scriptDirList){
			  return _scriptDirList;
		}
		else{
			var scriptDirListData = sahiSendToServer("/_s_/dyn/pro/EditorUI_allScriptsDirListJSON");
		    _scriptDirList = eval("(" + scriptDirListData + ")");
		    return _scriptDirList;
		}
	}
	
	function getScripts(dir){
		var allData = eval("(" + sahiSendToServer("/_s_/dyn/pro/EditorUI_allScriptsListJSON?suites=true") + ")");
		for (var key in allData) {
		  if (allData.hasOwnProperty(key) && (!dir || dir == key)) {
		    var scripts = getScriptsJson(allData[key], key);
		    _scriptsList = scripts;
		    return scripts;
		  }
		}
		return null;
	}
	
	function getScriptsJson(scriptsAr, dir){
		var json = "[";
		for(var i=0; i<scriptsAr.length; i++){
			var script = scriptsAr[i].substring(dir.length);
			json += "{";
			json += quoted("id") + ":" + i+1 + "," + quoted("text") + ":" + quoted(script);
			json += "}";
			if(i < scriptsAr.length-1){
				json += ",";
			}
		}
		json += "]";
		return eval("(" + json + ")");
	}
	
   function renameNode(){
	   var westPanelClosed = jQuery('#container').layout('panel','west').panel('options').collapsed;
	   if(westPanelClosed) return;
	   var node = jQuery('#tt').tree('getSelected');
	   if(!node || !node.scriptDir) return;
	   jQuery('#tt').tree('beginEdit',node.target);
   }
   
   function deleteNode(){
	   var westPanelClosed = jQuery('#container').layout('panel','west').panel('options').collapsed;
	   if(westPanelClosed) return;
	   var node = jQuery('#tt').tree('getSelected');
	   if(!node || !node.scriptDir) return;
	   deleteAction(node);
   }
   
   function opens(){
    var node = jQuery('#tt').tree('getSelected');
    open(node);
   }
   function docs(){
    var node = jQuery('#tt').tree('getSelected');
    doc(node);
   }
   function doc(node){
	if(!node.leaf)	return;
	//var item = jQuery('#mm').menu('findItem', 'Docs');
    if(node.path.indexOf('.sah', node.path.length - '.sah'.length) == -1){
		return;
	}
	var docsUrl = "/_s_/spr/editor/docview/docviewer.htm?dir=" + encodeURIComponent(node.scriptDir) + "&file=" + encodeURIComponent(node.path);
	addTab(node,docsUrl, "doc");
   }
   function getQuery(value){
	   var dbType = sahiSendToServer("/_s_/dyn/Configuration_getDBType");
	   if (dbType == "mssql") {
		   var query = "SELECT /*LIMITSTART*/ TOP 50 /*LIMITEND*/ SUITEREPORTS.STATUS AS ROWSTATUS,SUITEREPORTS.* FROM SUITEREPORTS WHERE SUITEREPORTS.SUITENAME LIKE '" + value + "' /*ORDERBYSTART*/ ORDER BY SUITEREPORTS.STARTTIME DESC /*ORDERBYEND*/";
	   } else {
		   var query = "SELECT SUITEREPORTS.STATUS AS ROWSTATUS,SUITEREPORTS.* FROM SUITEREPORTS WHERE SUITEREPORTS.SUITENAME LIKE '" + value + "' /*ORDERBYSTART*/ ORDER BY SUITEREPORTS.STARTTIME DESC /*ORDERBYEND*/ /*LIMITSTART*/ LIMIT 50 /*LIMITEND*/";
	   }
	   return query;
   }
   function logs(){
	var node = jQuery('#tt').tree('getSelected');
	log(node);
   }
   function log(node){
	if(!node.leaf)	return;
	var query = getQuery(node.text);
	var logsUrl = "/_s_/dyn/pro/DBReports?sql=" + encodeURIComponent(query);
	addTab(node,logsUrl, "log");
   }
   
   function isSingleSession() {
	   return getPlaybackMode() == "singlesession";
   }
   
   function appendBrowserToLogsInfo(logsInfo, browser) {
	   var newLogsInfo = "";
	   var logsInfoArr = logsInfo.split(",");
	   for(var i=0; i<logsInfoArr.length; i++){
		   var logInfo = logsInfoArr[i];
		  
		   var index = logInfo.indexOf(":");
		   var type;
		   var logDir;
		  
		   if (index == -1) { // Reports location not specified.
			   newLogsInfo += logInfo + ",";
		   } else {
			   newLogsInfo += (logInfo.lastIndexOf("/") == logInfo.length - 1 ? logInfo + browser + "," : logInfo + "/" + browser + ",");
		   }
	   }
	   
	   newLogsInfo = newLogsInfo.slice(0,-1)
	   
	   return newLogsInfo;
   }
   
   function open(node){
	   	 if(!node.leaf)	return;
	   	 if(node.path.match(".s.csv$") == ".s.csv" || node.path.match(".xls$") == ".xls" || node.path.match(".xlsx$") == ".xlsx"){
			 var editURL = "spreadsheet/spreadsheet.html?dir=" + encodeURIComponent(node.scriptDir) + "&file=" + encodeURIComponent(node.path);
		 }
		 else if(node.path.match(".dd.csv$") == ".dd.csv"){
			 var editURL = "spreadsheet/ddcsv_spreadsheet.html?dir=" + encodeURIComponent(node.scriptDir) + "&file=" + encodeURIComponent(node.path);
		 }
		 else{
			 var editURL = "refactor/refactor.htm?dir=" + encodeURIComponent(node.scriptDir) + "&file=" + encodeURIComponent(node.path);
		 }   
    addTab(node,editURL);
   }
   
   function runs(){
    jQuery('#mm').menu('hide');
    jQuery('#mm2').menu('hide');
	if(running > 0){
		var b = confirm("Some scripts are already running.\nDo you want to continue?");
		if(!b) return;
	}
    window.setTimeout(runs2, 1);
   }
   
   function runs2(){
	   var runId = generateId();
	   var browsers = jQuery('#browserTxt').combo('getText');
	   
	   var browserArr = browsers.split(",");
	   var multipleBrowsers = (browserArr.length > 1);
	   for (var i=0; i<browserArr.length; i++) {
		   var browser = sahiTrim(browserArr[i]);
		   var node = jQuery('#tt').tree('getSelected');
			var path = (node.scriptDir + "/" + node.path).replace(/\\/g, "/");
			var url = "";
			var runDistributed = isDrun();
			var id = null;
			if(runDistributed){
				id = formDrunURL(node.scriptDir, node.path, browser, multipleBrowsers, runId, i==0);
				if(id === null) return;
				running = running + 1;
				
				var diffMasterChecked = $('usedifferentmaster').checked;
				if (diffMasterChecked) {
					var diffMasterHost = jQuery('#diffmasterhost').textbox('getText');
					var diffMasterPort = jQuery('#diffmasterport').textbox('getText');
					
					// We need to query the status from a different Master. This is not allowed since the response does not
					// contain the "Access-Control-Allow-Origin" header. Hence we call EditorUI.getStatus which internally
					// queries the status from the different Master.
					url = "/_s_/dyn/in.co.sahi.command.EditorUI_getStatus?suiteId=" + id + "&host=" + diffMasterHost + "&port=" + diffMasterPort;
				} else {
					url = "/_s_/dyn/in.co.sahi.command.Master_getStatus?suiteId=" + id;				
				}
			}
			else{
				id = formURL(path, browser, multipleBrowsers);
				if(id === null) return;
				running = running + 1;
				url = "/_s_/dyn/Suite_status?sahisid=" + id;
			}
			var timer = setInterval(getShowStatus(node.path, url, browser, id), 1000);
			statusTimer[id] = timer;
	   }
   }
   
   function formURL(path, browser, multipleBrowsers){
		var baseURL = jQuery('#startURLTxt').combo('getText');
		saveURL(baseURL);
		var threads = jQuery('#threads').numberspinner('getValue');
		var extraParamValue = $("extraParams").value;
		port = getPort();
		var sendemail = $('sendEmail').checked;
		var emailtrigger = jQuery('#e_trigger').combo('getText');
		var emailproperties = jQuery('#email_prop').textbox('getText');
		var tags = encodeURIComponent(jQuery('#tagsTextId').textbox('getText'));
		if (extraParamValue.charAt(0) != '&') extraParamValue = '&' + extraParamValue;
		var userDefinedId = jQuery('#userDefinedIdTextId').textbox('getText');
		var logsInfo = $("reportsInfo").value;
		
		if (browser == "" || baseURL == ""){
			alertForBlankPlaybackField();
		} 
		else if(sendemail && emailproperties == ""){
			alertEmailPropertiesFile();
		}
		else {
			var url = "/_s_/dyn/Suite_start?a=a&port="+port+"&isSingleSessionS=" + isSingleSession() + "&browserPath=null&host=" + location.hostname
			 + "&test=" + encodeURIComponent(path) + "&threads=" + threads + "&suitePath=" + encodeURIComponent(path)
			 + "&baseURL=" + encodeURIComponent(baseURL) + "&browserType=" + browser + extraParamValue;
			if(sendemail){
				url += "&sendEmail=" + sendemail + "&emailTrigger=" + encodeURIComponent(emailtrigger) + "&emailProperties=" + encodeURIComponent(emailproperties)
			  		 + "&emailPasswordHidden=" + emailPasswordHidden;
			}
			if(tags != ""){
				url += "&tags=" + tags;
			}
			if (userDefinedId != "") {
				url += "&userDefinedId=" + userDefinedId;
			}
			if (logsInfo != "") {
				if (multipleBrowsers) {
					logsInfo = appendBrowserToLogsInfo(logsInfo, browser);
				}
				url += "&logsInfo=" + logsInfo;
			}
			
			return sahiSendToServer(url);
		}
		return null;
	}
   
   function createGuid(){
       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
           var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
           return v.toString(16);
       });
   }
   
   function generateId(){
	   return "sahi_" + createGuid().replace(/[-]/g, '0');
   }
   
   function formDrunURL(root, path, browser, multipleBrowsers, runId, syncNodes){
		var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
		saveURL(baseURL);
		var extraParamValue = $("extraParams").value;
		var diffMasterChecked = $('usedifferentmaster').checked;
		var diffMasterHost = jQuery('#diffmasterhost').textbox('getText');
		var diffMasterPort = jQuery('#diffmasterport').textbox('getText');
		port = diffMasterChecked ? diffMasterPort : getPort();
		var host = diffMasterChecked ? diffMasterHost : location.hostname;
		var sendemail = $('sendEmail').checked;
		var emailtrigger = jQuery('#e_trigger').combo('getText');
		var emailproperties = jQuery('#email_prop').textbox('getText');
		var tags = encodeURIComponent(jQuery('#tagsTextId').textbox('getText'));
		var originFolder = diffMasterChecked ? root : "";
		var origScriptsPath = diffMasterChecked ? "temp/scripts/staging/" : root;
		var userDefinedId = jQuery('#userDefinedIdTextId').textbox('getText');
		var logsInfo = $("reportsInfo").value;		
		var useNodes = $('usenodes').value;
		
		if (extraParamValue.charAt(0) != '&') extraParamValue = '&' + extraParamValue;
		if (browser == "" || baseURL == ""){
			alertForBlankPlaybackField();
		} else if(sendemail && emailproperties == ""){
			alertEmailPropertiesFile();
		} else if (useNodes == "") {
			alertForBlankDrunNodesField();
		} else if (diffMasterChecked && (diffMasterHost == "" || diffMasterPort == "")) {
			alertForBlankDiffMasterFields();
		} else {
			var suiteId = generateId();
			var nodes_history = $('extraNodes').value.split(',');
			var node_infoAr = [];
			for(var i=0; i<nodes_history.length; i++){
				if(nodes_history[i] != "" && nodes_history[i].indexOf('//') != 0){
					node_infoAr.push(nodes_history[i]);
				}
			}
			var node_info = node_infoAr.join();
			
			if (diffMasterChecked && syncNodes) { // Sync nodes if a different Master has been chosen.
				var masterNode = diffMasterHost + ":" + diffMasterPort;
				var syncurl = "/_s_/dyn/pro/EditorUI_syncNodes?1=1&origScriptsPath=" + origScriptsPath 
				 + "&nodes=" + masterNode + "&originFolder=" + originFolder;
				sahiSendToServer(syncurl);
			}
			
			var url = "/_s_/dyn/pro/EditorUI_runDistributed?1=1&host=" + host +"&port=" + port + "&originalSuitePath="
				 + (origScriptsPath + path)
				 + "&baseURL=" + (baseURL) + "&origScriptsPath=" + origScriptsPath + "&browserType=" + browser 
				 + "&suiteId=" + suiteId + "&nodesFilePath=&nodes=" + node_info
				 + "&copiedScriptsPath=" + ("temp" + "/" + "scripts" + "/" + "copied")
				 + "&suite=" + ("temp" + "/" + "scripts" + "/" + "copied" + "/" + path)
				 + "&diffMaster=" + diffMasterChecked + "&multipleBrowsers=" + multipleBrowsers + "&runId=" + runId
				 + extraParamValue;
			if(sendemail){
				url += "&sendEmail=" + sendemail + "&emailTrigger=" + encodeURIComponent(emailtrigger) + "&emailProperties=" + encodeURIComponent(emailproperties)
			  		 + "&emailPasswordHidden=" + emailPasswordHidden;
			}
			if(tags != ""){
				url += "&tags=" + tags;
			}
			if (userDefinedId != "") {
				url += "&userDefinedId=" + userDefinedId;
			}
			if (logsInfo != "") {
				if (multipleBrowsers) {
					logsInfo = appendBrowserToLogsInfo(logsInfo, browser);
				}

				url += "&logsInfo=" + logsInfo;
			}
			
			sahiSendToServer(url);
			return suiteId;
		}
		return null;
	}
   
   function getPort(){
	  if(port){
		  return port;
	  }
	  else{
		  port = location.port;
		  return port;
	  }
   }
   
   function setReadOnlyNodesInfo(){
	   var nodes_history = $('extraNodes').value.split(',');
		var node_infoAr = [];
		for(var i=0; i<nodes_history.length; i++){
			if(nodes_history[i] != "" && nodes_history[i].indexOf('//') != 0){
				node_infoAr.push(nodes_history[i]);
			}
		}
		var node_info = node_infoAr.join();
		$('usenodes').value = node_info;
   }
   
   function resizeContainer(){
	   jQuery('#container').layout('resize');
   }
   
   function alertForBlankPlaybackField(){
	   alert("Browser and Start URL cannot be blank");
	   if(jQuery('#w4').window('options').closed) 
			openWindow('w4');
	   jQuery('#browserTxt').combobox('textbox')[0].focus();
   }
   
   function showStatus(path, url, browser, id) {
      var status = sahiSendToServer(url);
      var msg = "<b class='status_" + status + "'>" + status + " on " + browser + "</b><br/><br/>" + path;
      if(status == "RUNNING"){
    	  slide("<b class='status_" + status + "'>" + status + " on " + browser + "</b><br/><br/>" + path, 1500, 'fade');
      }
      if(status != "RUNNING"){
    	  stopStatusTimer(id);
    	  slide(msg, 5000, 'slide');
      }
   }

   function stopStatusTimer(id) {
	   var timer = statusTimer[id];
       clearInterval(timer);
       delete statusTimer[id];
       running = running - 1;
   }
   
   function slide(msg, time, showType, title){
	   if(!title) title = "Playback Status";
       jQuery.messager.show({
           title:title,
           msg:msg,
           timeout:time,
           showType:showType
       });
   }
   
   function selectedCheckboxes(){
	   var nodes = jQuery('#tt').tree('getChecked');
	   for(var i=0; i<nodes.length; i++){
		   checkedNodes.push(nodes[i]);
       }
	}

	function runSelectedFilesSuite(){
		jQuery('#mm6').menu('hide');
		if(running > 0){
			var b = confirm("Some scripts are already running.\nDo you want to continue?");
			if(!b) return;
		}
		window.setTimeout(runSelectedFilesSuite2, 1);
	}
	
	function runSelectedFilesSuite2(){
		var suite = getSuiteToRun();
		var scriptDir = suite.scriptDir;
		var scriptName = suite.scriptName;
		var retVal = scriptDir + scriptName;
		var runDistributed = isDrun();
		if(scriptDir && scriptName){
			var runId = generateId();
			var browsers = jQuery('#browserTxt').combo('getText');
		   
			var browserArr = browsers.split(",");
			var multipleBrowsers = (browserArr.length > 1);
			for (var i=0; i<browserArr.length; i++) {
				var browser = sahiTrim(browserArr[i]);

				var id = null;
				var url = "";
				if(runDistributed){
					id = formDrunURL(scriptDir, scriptName, browser, multipleBrowsers, runId, i==0);
					if(id === null) return;
					running = running + 1;
					
					var diffMasterChecked = $('usedifferentmaster').checked;
					if (diffMasterChecked) {
						var diffMasterHost = jQuery('#diffmasterhost').textbox('getText');
						var diffMasterPort = jQuery('#diffmasterport').textbox('getText');
						
						// We need to query the status from a different Master. This is not allowed since the response does not
						// contain the "Access-Control-Allow-Origin" header. Hence we call EditorUI.getStatus which internally
						// queries the status from the different Master.
						url = "/_s_/dyn/in.co.sahi.command.EditorUI_getStatus?suiteId=" + id + "&host=" + diffMasterHost + "&port=" + diffMasterPort;
					} else {
						url = "/_s_/dyn/in.co.sahi.command.Master_getStatus?suiteId=" + id;				
					}				
				}
				else{
					id = formURL(retVal, browser, multipleBrowsers);
					if(id === null) return;
					running = running + 1;
					url = "/_s_/dyn/Suite_status?sahisid=" + id;
				}
				closeWindow('w4');
				var timer = setInterval(getShowStatus(scriptName, url, browser, id), 1000);
				statusTimer[id] = timer;
		   }
		}
		else {
			alert("Please select or open script/suite.");
		}
		checkedNodes = [];
	}
	
	function getShowStatus(scriptName, url, browser, id) {
		return function(){showStatus(scriptName, url, browser, id)};
	}
	
	function getSuiteToRun(){
		selectedCheckboxes();
		var runOpenTab = false;
		var scriptDir = null;
		var scriptName = null;
		var selectedTab = jQuery('#tt2').tabs('getSelected');
		if(selectedTab){
			var selectedTabTitle = selectedTab.panel('options').title;
			var hiddenInput = $(selectedTabTitle);
			var iframeId = hiddenInput.className;
			if(iframeId.indexOf("DBLogs_") == 0 || iframeId.indexOf("_superframe@temp@") == 0 || iframeId.indexOf("log") == 0){
				runOpenTab = false;
			}else{
				runOpenTab = true;
			}
		}
		if(checkedNodes.length > 0 || runOpenTab){
			if(checkedNodes.length == 1){
				scriptName = checkedNodes[0].path;
				scriptDir = checkedNodes[0].scriptDir;
			}
			else if(checkedNodes.length > 1){
				scriptDir = checkedNodes[0].scriptDir;
				var checkedNodesPath = [];
				for(var i=0; i<checkedNodes.length; i++){
					checkedNodesPath.push(checkedNodes[i].path);
				}
				var retVal = sahiSendToServer("/_s_/dyn/ControllerUI_getSuiteFile?checkedNodes="+checkedNodesPath+"&scriptDir="+encodeURIComponent(scriptDir));
				retVal = retVal.replace(/\\/g, "/");
				scriptName = "selectedScripts.suite";
				//scriptDir = retVal.substring(0, retVal.indexOf(scriptName)-1);
			}
			else{
				scriptDir = hiddenInput.name;
				scriptName = hiddenInput.value.substring(hiddenInput.value.indexOf(scriptDir) + scriptDir.length);
			}
		}
		checkedNodes = [];
		var suite = {scriptDir:scriptDir, scriptName:scriptName};
		return suite;
	}
   
   function sendToServer(url){
		var scr = document.createElement('script');
	    scr.setAttribute("type", "text/javascript");
	    scr.setAttribute("src", url);
	    document.getElementsByTagName("head")[0].appendChild(scr);
	}
   function run(node){
	if(!node.leaf)	return;
	var query = getQuery(node.text);
	var logsUrl = "/_s_/dyn/pro/DBReports?sql=" + encodeURIComponent(query);
	addTab(node,logsUrl, "log");
   }
   
   function addDbLogTab(){
	   closeWindow('w4');
	   addTab(null, "/_s_/dyn/pro/DBReports", "DBLogs");
   }
   
   function addTab(node, url, tag){
	   var root = "";
	   if(node){
		   root = node.scriptDir;
		   var commonTabTitle = node.text + '<strong>' + root + node.path + '<\/strong>';
	   }
	  if(!tag){
		  var title = commonTabTitle;
		  var frameId= '_superframe' + (node.path.replace(/\./g, '').replace(/\//g, ''));
		  var webTitle = 'Editor - ' + root + node.path;
	  }
	  else if(tag == "doc"){
		  var title = "Doc: " + commonTabTitle;
		  var frameId= tag + "_" + 'superframe'+ (node.path.replace(/\./g, '').replace(/\//g, ''));
		  var webTitle = 'Editor - ' + 'Doc Viewer - ' + root + node.path;
	  }
	  else if(tag == "DBLogs"){
		  var title = "Suites List";
		  var frameId= tag + "_" + 'superframe';
		  var webTitle = 'Editor - ' + 'Suites List';
	  }
	  else{
		  var title = "Logs: " + commonTabTitle;
		  var frameId= tag + "_" + 'superframe'+ (node.path.replace(/\./g, '').replace(/\//g, ''));
		  var webTitle = 'Editor - ' + 'Logs - ' + root + node.path;
	  }
      if (jQuery('#tt2').tabs('exists', title)){
    	  jQuery('#tt2').tabs('select', title);
      } else {
    	  addNewTab(frameId, url, title);
          createWebTitleInput(title, webTitle, root, frameId);
          changeWebTitleAndMenuVisibility();
          jQuery('#tt2').tabs('select', title);
      }
  }
   
  function addNewTab(frameId, url, title){
	  var content = '<iframe id="'+ frameId +'" scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:99%;"></iframe>';
      jQuery('#tt2').tabs('add',{
          title:title,
          content:content,
          closable:true,
          tools:[{
              iconCls:'icon-mini-refresh',
              handler:function(){
            	  if(frameId.indexOf('_superframe@temp@') != 0) {
            		  if (checkDirtyTab(title, "refresh")) {
            			  jQuery('#'+frameId).get(0).contentWindow.location.reload();
            		  }
            	  }
              }
          }]
      });
  }
  
  function openNewTabFromOpen(){
	  var fileDir = jQuery("#load_s_dir").combobox('getText');
	  var fileName = jQuery("#load_f_dir").combobox('getText');
	  openNewTab(fileDir, fileName);
  }
  
  function openNewTabFromFullPath(path){
	  var scriptDirs = getScriptDirs();
	  for (var key in scriptDirs) {
		  if (scriptDirs.hasOwnProperty(key)) {
		    var scriptDirInList = scriptDirs[key].text;
		    if(path.indexOf(scriptDirInList) == 0){
		    	var fileDir = scriptDirInList;
		    	var fileName = path.substring(scriptDirInList.length);
		    	openNewTabIfExists(fileDir, fileName);
		    	break;
		    }
		  }
	  }
  }
  
  function openNewTab(fileDir, fileName){
	 fileName = sahiTrim(fileName);
	 if(fileDir == "" || fileName == "") return;
	 closeWindow('loadDialog');
	 if(fileDir.indexOf("%2F") != -1 ){
		fileDir = decodeURIComponent(fileDir).replace("^","");
		fileName = decodeURIComponent(fileName);
	 }
	 if(!isFileExists(fileDir + fileName)){
		var msg = "File not exists!";
		alert(msg);
		return false;
	}
	 var url = getUrl(fileDir, fileName);
	 var frameId = '_superframe' + (fileName.replace(/\./g, '').replace(/\//g, ''));
	 var webTitle = 'Editor - ' + fileDir + fileName;
	 var nodeText = fileName.substring(fileName.lastIndexOf("/") + 1);
	 var title = nodeText +  '<strong>' + fileDir + fileName + '<\/strong>';
	 if (jQuery('#tt2').tabs('exists', title)){
   	  	 jQuery('#tt2').tabs('select', title);
     } else {
    	 addNewTab(frameId, url, title);
    	 createWebTitleInput(title, webTitle, fileDir, frameId);
    	 changeWebTitleAndMenuVisibility();
     }
  }
  
  function getUrl(fileDir, fileName){
	 if(fileName.match(".s.csv$") == ".s.csv" || fileName.match(".xls$") == ".xls" || fileName.match(".xlsx$") == ".xlsx"){
		var url = "spreadsheet/spreadsheet.html?dir=" + encodeURIComponent(fileDir) + "&file=" + encodeURIComponent(fileName);
	 }
	 else if(fileName.match(".dd.csv$") == ".dd.csv"){
		var url = "spreadsheet/ddcsv_spreadsheet.html?dir=" + encodeURIComponent(fileDir) + "&file=" + encodeURIComponent(fileName);
	 }
	 else{
		var url = "refactor/refactor.htm?dir=" + encodeURIComponent(fileDir) + "&file=" + encodeURIComponent(fileName);
	 }
	 return url;
  }
  
  function createWebTitleInput(id, value, name, className){
	  if(!$(id)){
		  var hiddenTitleDiv = $("titlebox");
		  var hiddenTitle = document.createElement("input");
		  hiddenTitle.name = name;
		  hiddenTitle.className = className;
		  hiddenTitle.type = "hidden";
		  hiddenTitle.id = id;
		  hiddenTitle.value = value;
		  hiddenTitleDiv.appendChild(hiddenTitle);
	  }
  }
  
  function getIframeWindowOfTab(title) {
		var hiddenInput = $(title);
		if (!hiddenInput) return null;
		var iframeId = hiddenInput.className;	  
		var el = $(iframeId); 
		return el ? el.contentWindow : null;
  }
  
  function refreshCodeMirrorforIE(title) {
	  var iframe = getIframeWindowOfTab(title);
	  if (!iframe) return;
	  if (iframe.refreshContents) iframe.refreshContents();
  }
  
  function onTabSelect(title,index) {
	  changeWebTitleAndMenuVisibility();
	  refreshCodeMirrorforIE(title);
  }
  
  function changeWebTitleAndMenuVisibility(){
	  var selectedTab = jQuery('#tt2').tabs('getSelected');
	  if(selectedTab){
		  var selectedTabTitle = selectedTab.panel('options').title;
		  if(selectedTabTitle == "Suites List" || selectedTabTitle.indexOf("Logs: ") == 0){
//			  jQuery('#saveId').splitbutton('disable');
			  makeMenuDisable('Save');
			  makeMenuDisable('Save As');
		  }
		  else if(selectedTabTitle.indexOf("Doc: ") == 0){
			  jQuery('#saveId').splitbutton('enable');
			  makeMenuEnable('Save');
			  makeMenuDisable('Save As');
			  makeMenuEnable('Save All');

		  }
		  else{
			  jQuery('#saveId').splitbutton('enable');
			  makeMenuEnable('Save');
			  makeMenuEnable('Save As');
			  makeMenuEnable('Save All');
		  }
		  if($(selectedTabTitle)){
			  document.title = $(selectedTabTitle).value;
		  }
	  } else{
		  jQuery('#saveId').splitbutton('disable');
		  makeMenuDisable('Save');
		  makeMenuDisable('Save As');
		  makeMenuDisable('Save All');
		  document.title = "Editor";
	  }
	  scrollWithTab(selectedTabTitle, false);
  }
  
  function scrollWithTab(selectedTabTitle, force){
	  var westPanelClosed = jQuery('#container').layout('panel','west').panel('options').collapsed;
	  if((force || isLinkWithEditor()) && selectedTabTitle != "Suites List" && $(selectedTabTitle) && !westPanelClosed){
		  var root = $(selectedTabTitle).name;
		  var fullNodePath = selectedTabTitle.substring(selectedTabTitle.lastIndexOf("<strong>")+"<strong>".length, selectedTabTitle.lastIndexOf("</strong>"));
		  var file = fullNodePath.substring(root.length);
		  var n1 = getNode(root, file);
		  if(!n1) return;
		  var node = jQuery('#tt').tree('find', n1.id);
		  var p = node;
		  while (jQuery('#tt').tree('getParent', p.target)) {
			p = jQuery('#tt').tree('getParent', p.target);
			if(p.state == "closed"){
				jQuery('#tt').tree('expand', p.target);
			}
		  }
		  jQuery('#tt').tree('scrollTo', node.target);
		  jQuery('#tt').tree('select', node.target);
	  }
  }
  
  function getNode(root, file){
	  for(var i=0; i<treedata1.length; i++){
		  var o = treedata1[i];
		  if(o.path != root){
			  continue;
		  }
		  o = getLeafNode(file, o);
		  return o;
	  }
  }
  
  jQuery.extend(jQuery.fn.tree.methods,{
	  getFolders: function(jq, target){
		  var nodes = [];
		  var ul = jQuery(target).length ? jQuery(target).next() : jq;
		  ul.find("div.tree-node:has(span.tree-folder)").each(function(){
			  nodes.push(jq.tree('getNode',this));
		  });
		  return nodes;
	  }
  });
  
  function getLeafNode(file, o){
	  var children = o.children;
	  if(o.leaf){
		  if(o.path == file){
			  return o;
		  }
	  }
	  else if(children){
		  for(var j=0; j<children.length; j++){
			  o = children[j];
			  o = getLeafNode(file, o);
			  if(o) return o;
		  }
	  }
	  
  }
  
  function linkWithEditor(el){
	  if(el.className.indexOf("icon-link") != -1){
		  el.className = el.className.replace("icon-link", "icon-nolink");
	  } else{
		  el.className = el.className.replace("icon-nolink", "icon-link");
	  }
  }
  
  function isLinkWithEditor(){
	  if($('linkWithE').className.indexOf("icon-nolink") != -1){
		  return true;
	  } else{
		  return false;
	  }
  }
  
  function onCloseTab(tabTitle){
	  changeWebTitleAndMenuVisibility();
	  $("titlebox").removeChild($(tabTitle));
	  var titleInput = $("titlebox").getElementsByTagName("input");
	  for(var i=0; i<titleInput.length; i++){
		  if(titleInput[i].id.indexOf("Logs: ") != 0 && titleInput[i].id != "Suites List"){
			  jQuery('#saveId').splitbutton('enable');
			  makeMenuEnable('Save All');
			  break;
		  }
		  if(i == titleInput.length -1 ){
			  makeMenuDisable('Save All');
			  jQuery('#saveId').splitbutton('disable');
		  }
	  }
	  writeHistoryData();
  }
  
  function writeHistoryData2(){
	  setTimeout(writeHistoryData, 3000);
  }
  
  function writeHistoryData(){
	  createHistoryData();
	  jQuery.ajax({
		  url: "/_s_/dyn/pro/EditorUI_createEditorHistory?value="+e_history,
		  context:document.body
	  });
  }
  
  function makeLinkButtonDisable(id, b){
	  jQuery(id).linkbutton({disabled:b});
  }
  
  function makeMenuDisable(item){
	  var item = jQuery('#mm4').menu('findItem', item);
	  jQuery('#mm4').menu('disableItem', item.target);
  }
  
  function makeMenuEnable(item){
	  var item = jQuery('#mm4').menu('findItem', item);
	  jQuery('#mm4').menu('enableItem', item.target);
  }
  
  function removePanel(tab){
	  if(!tab){
		  tab = jQuery('#tt2').tabs('getSelected');
	  }
      if (tab){
          var index = jQuery('#tt2').tabs('getTabIndex', tab);
          jQuery('#tt2').tabs('close', index);
      }
  }
  
  function removePanels(tabsTitle){
	  for(var i=0; i<tabsTitle.length; i++){
		  var tab = jQuery('#tt2').tabs('getTab', tabsTitle[i]);
		  removePanel(tab);
	  }
  }
  
  function qs() {
		var query = window.location.search.substring(1);
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0,pos);
				var val = parms[i].substring(pos+1);
				qsParm[key] = val;
			}
		}
	}
  
  jQuery(function(){
	  jQuery('#saveId').splitbutton('disable');
	  qs();
	  var search = (typeof qsParm["search"] == "undefined") ? "all" : qsParm["search"];
	  for(var i=0; i<filterData.length; i++){
		  if(search == filterData[i].value){
			  search = filterData[i].text;
			  break;
		  }
	  }
	  var tb = jQuery('#filter_id').combobox('textbox');
	  if(search != "All")
		  tb[0].value=search;
	  tb.bind('keyup',function(e){
		  if (__queuedKeyupTimer) window.clearTimeout(__queuedKeyupTimer);
		  __queuedKeyupTimer = window.setTimeout('showCustomSearch('+ '"' + tb[0].value + '"' +')', 200);
	  });
	  openCookieOpenTabs();
	  var dir = (typeof qsParm["dir"] == "undefined") ? undefined : qsParm["dir"];
	  var file = (typeof qsParm["file"] == "undefined") ? undefined : qsParm["file"];
	  if(dir && file){
		  openNewTab(decodeURIComponent(dir), decodeURIComponent(file));
	  }
	  imageShadow();
	  viewSetting();
	  var browser = readHistory('browser');
	  if(browser && browser != "")
		  jQuery('#browserTxt').combobox('setValues', browser.split(','));
	  var baseURL = readHistory('baseURL');
	  if(baseURL && baseURL != "")
		  jQuery('#startURLTxt').combobox('setValue', decodeURIComponent(baseURL));
	  var threads = readHistory('threads');
	  if(threads && threads != "")
		  jQuery('#threads').numberspinner('setValue', threads);
	  var extraParamValue = readHistory('extraParamValue');
	  if(extraParamValue && extraParamValue != "")
		  $("extraParams").value = extraParamValue;
	  var reportsInfo = readHistory('reportsInfo');
	  if(reportsInfo && reportsInfo != "")
		  $("reportsInfo").value = reportsInfo;
	  setPlaybackMode(readHistory('playbackMode'));
	  var useDifferentMaster = readHistory('useDifferentMaster');
	  if(useDifferentMaster && useDifferentMaster != "") {
		  $("usedifferentmaster").checked = ("true" == useDifferentMaster);
	  }
	  var diffMasterInfo = readHistory('diffMasterInfo');
	  if(diffMasterInfo && diffMasterInfo != "") {
		  var hostProp = diffMasterInfo.split(":");
		  jQuery('#diffmasterhost').textbox('setText', hostProp[0]);
		  jQuery('#diffmasterport').textbox('setText', hostProp[1]);
	  } else {
		  jQuery('#diffmasterport').textbox('setText', getPort());
	  }
	  var linkWithEditor = readHistory('linkWithEditor');
	  if(linkWithEditor && linkWithEditor == "true")
		  $('linkWithE').className = $('linkWithE').className.replace("icon-link", "icon-nolink");
	  var tags = readHistory('tags');
	  if(tags && tags != "")
		  jQuery("#tagsTextId").textbox('setText', tags);
	  var userDefinedId = readHistory('userDefinedId');
	  if(userDefinedId && userDefinedId != "")
		  jQuery("#userDefinedIdTextId").textbox('setText', userDefinedId);
	  var sendEmail = readHistory('sendEmail');
	  if(sendEmail && sendEmail != ""){
		  sendEmail = "true" == sendEmail;
		  $('sendEmail').checked = sendEmail;
		  showSendEmailProperties(sendEmail);
	  }
	  var emailTrigger = readHistory('emailTrigger');
	  if(!emailTrigger){
		  jQuery('#e_trigger').combobox('setValues', ["success","failure"]);
	  }
	  else if(emailTrigger != ""){
		  jQuery('#e_trigger').combobox('setValues', emailTrigger.split(','));
	  }
	  var emailProp = getEmailPropertiesFile();
	  jQuery('#email_prop').textbox('setValue', emailProp);
	  var advancedSettings = readHistory('advancedSettings');
	  //console.log(advancedSettings);
	  if(advancedSettings == "none"){
		  $('advancedSettingsTable').style.display = 'none';
			$('advancedSettings').innerHTML = 'Show advanced settings';
		  
		}
		else{
			$('advancedSettingsTable').style.display = 'inline';
			jQuery('#threads').numberspinner();
			$('advancedSettings').innerHTML = 'Hide advanced settings';
	  }
  });
  
  function getEmailPropertiesFile(){
	  return sahiSendToServer("/_s_/dyn/pro/EditorUI_getEmailProperties");
  }
  
  function makeTreeObj(json, search){
	  if (search == null) search = "all";
	  var re = null;
	  if (search.indexOf("*") != -1) {
		  re = new RegExp(search.replace(/[*]/g, '.*'), 'gi');
	  }
	  for (var scriptDir in json) {
		  if (json.hasOwnProperty(scriptDir)) {
			var scriptDirText = "";
			scriptDirTemp = scriptDir.split("/");
			if(scriptDirTemp[scriptDirTemp.length - 1] != "") scriptDirText = scriptDirTemp[scriptDirTemp.length - 1];
			else scriptDirText = scriptDirTemp[scriptDirTemp.length - 2];
			var treeObj = {id:0, text:scriptDirText, leaf: false, path:scriptDir, children:[], leafNames:{}};
			var scripts = json[scriptDir];
			for (var j=0; j<scripts.length; j++) {
				if((search == "all") || (re && re.test(scripts[j])) || (scripts[j].toLowerCase().indexOf(search.toLowerCase()) != -1)){
					addToTree(scripts[j].replace(scriptDir, ""), treeObj, scriptDir);
				}				
			}
			treedata1.push(treeObj)
		  }
	  }
  }
  
  var treedata1 = [];
  jQuery(function(){
	  jQuery.ajax({
		  url: "/_s_/dyn/pro/EditorUI_allScriptsListJSON?suites=true",
		  context: document.body
	  }).done(function(data) {
		  qs();
		  var search = (typeof qsParm["search"] == "undefined") ? "all" : qsParm["search"];
		  var json = eval("(" + data + ")");
		  makeTreeObj(json, search);
		  renderTree();
		  if(readHistory('linkWithEditor') && readHistory('linkWithEditor') == "true"){
			  var selectedTab = jQuery('#tt2').tabs('getSelected');
			  if(selectedTab){
				  var selectedTabTitle = selectedTab.panel('options').title;
				  scrollWithTab(selectedTabTitle, true);
			  }
		  }
	  });
	  jQuery('#load_f_dir').combobox('loadData',getScripts());
  });
  
  jQuery(function(){
	  readjustPlaybackFields();
  });
  
  jQuery(function(){
	  jQuery('#paramEditor').tooltip({
		  hideEvent: 'none',
          showEvent: 'none',
    	  content: function(){
              return jQuery('#p_editor');
          },
          deltaX:adjustDeltaX,
          onShow: function(){
              editExtraParam();
              preventDelete();
          }
      });
	  jQuery('#reportsEditor').tooltip({
		  hideEvent: 'none',
          showEvent: 'none',
    	  content: function(){
              return jQuery('#r_editor');
          },
          deltaX:adjustReportsDeltaX,
          onShow: function(){
              editReportsInfo();
              preventDelete();
          }
      });	  
	  jQuery('#nodesEditor').tooltip({
		  hideEvent: 'none',
          showEvent: 'none',
    	  content: function(){
              return jQuery('#nodes_editor');
          },
          deltaX:adjustNodesDeltaX,
          onShow: function(){
              editNodesParam();
              preventDelete();
        }
      });
//	  jQuery('#useavailable').tooltip({
//		  position: 'top',
//		  content: 'Use available nodes',
//		  onShow: function(){
//			  jQuery(this).tooltip('tip').css({
//				  backgroundColor: '#FFFFCC',
//		          borderColor: '#CC9933'
//		      });
//		  }
//	  });
	  jQuery('#threadsSpan').tooltip({
		  position: 'top',
		  content: "Threads are used for parallel playback on single machine runs.<br/>In Distributed run, capacity from browser_types.xml determines<br/>how many browsers are run in parallel on each participating machine.",
		  onShow: function(){
			  jQuery(this).tooltip('tip').css({
				  backgroundColor: '#FFFFCC',
		          borderColor: '#CC9933'
		      });
		  }
	  });
	  preventDelete();
	  createXmlCMEditor("antTargetText", true);
	  jQuery('#filter_id').combobox('textbox')[0].title = "Filter";
  });
  
  function reloadNavigator(){
	  var tb = jQuery('#filter_id').combobox('textbox');
	  search = tb[0].value;
	  if(!search || search == "") search = "all";
	  showCustomSearch(search);
  }
  
  function showCustomSearch(search){
	  jQuery.ajax({
		  url: "/_s_/dyn/pro/EditorUI_allScriptsListJSON?suites=true",
		  context: document.body
	  }).done(function(data) {
		  if(!search || search == "") search = "all";
		  for(var i=0; i<filterData.length; i++){
			  if(search == filterData[i].text){
				  search = filterData[i].value;
				  break;
			  }
		  }
		  treedata1 = [];
		  var json = eval("(" + data + ")");
		  makeTreeObj(json, search);
		  jQuery('#tt').tree({
			  data:treedata1
		  });
	  });
  }
	
	function addToTree(s, treeObj, dir){
		s = s.replace(/\\/g, "/");
		var ar = s.split("/");
		var parent = treeObj;
		for (var i=0; i<ar.length; i++) {
			var leaf = addLeaf(parent, ar[i],(i == ar.length - 1), s, dir);
			parent = leaf;
		}
	}
	function addLeaf(parent, s, isLeafNode, path, dir){
		var leaf = parent.leafNames[s];
		if (!leaf) {
			leaf = {id:counter++, text:s, path: path, leaf: isLeafNode, children:[], leafNames:{}, scriptDir: dir};
			parent.children.push(leaf);
			parent.leafNames[s] = leaf;
		}	
		return leaf;
	}
	
  function getFolderRelativePath(node){
	  var folderPath = "";
	  if(node.scriptDir){
		  folderPath = node.text;
		  var p = node;
		  var roots = jQuery('#tt').tree('getRoots');
		  while (jQuery('#tt').tree('getParent', p.target)) {
			p = jQuery('#tt').tree('getParent', p.target);
			var isRoot = false;
			for(var i=0; i<roots.length; i++){
				var root = roots[i];
				if(p == root) isRoot = true;
			}
			if(!isRoot)
				folderPath = p.text + "/" + folderPath;
		  }
	  }
	  return folderPath;
  }

  function renderTree(){
	  for(var i=0; i<treedata1.length; i++){
		  removeLeafNames(treedata1[i]);
	  }
	  jQuery('#tt').tree({
              onClick:function(node){
                 open(node);     
              },
              animate:false,
              checkbox:true,
              onlyLeafCheck:true,
              data:treedata1,
              formatter:function(node){
		                  var s = node.text;
		                  if (node.children && node.children.length > 0){
		                      s += '&nbsp;<span style=\'color:blue\'>(' + node.children.length + ')</span>';
		                  }
		                  return s;
		              },
              onBeforeEdit:function(node){
            	  isTreeInEditMode = true;
            	  if(node.leaf) beforeEditIsFile = true;
            	  beforeEditText = node.text;
            	  if(!node.scriptDir){
            		  beforeEditRoot = node.path;
            		  beforeEditFile = "";
            	  }
	          	  else {
	          		beforeEditRoot = node.scriptDir;
	          	  }
            	  if(beforeEditIsFile){
            		  beforeEditFile = node.path;
            	  }
            	  else{
            		  beforeEditFile = getFolderRelativePath(node);
            	  }
              },
		      onAfterEdit:function(node){
		    	  isTreeInEditMode = false;
		    	  afterEditFile = node.text;
            	  renameAction(node, afterEditFile);     
              },
              onCancelEdit:function(node){
		    	  isTreeInEditMode = false;
              },
              onContextMenu: function(e, node){
                e.preventDefault();
           	    jQuery('#tt').tree('select', node.target);
            	if(node.leaf){
                      if(node.path.indexOf('.sah', node.path.length - '.sah'.length) == -1){
                    	  jQuery('#mm2').menu('show', {
	                          left: e.pageX,
	                          top: e.pageY
		                  });
	                  } else {
	                	  jQuery('#mm').menu('show', {
	                		  left: e.pageX,
	                		  top: e.pageY
	                	  });
	                  }
              	}
            	else{
            		var item1 = jQuery('#mm5').menu('findItem', 'Rename');
            		var item2 = jQuery('#mm5').menu('findItem', 'Delete');
            		if(!node.scriptDir){
            			jQuery('#mm5').menu('disableItem', item1.target);
            			jQuery('#mm5').menu('disableItem', item2.target);
            		}
            		else{
            			jQuery('#mm5').menu('enableItem', item1.target);
            			jQuery('#mm5').menu('enableItem', item2.target);
            		}
            		jQuery('#mm5').menu('show', {
                        left: e.pageX,
                        top: e.pageY
	                  });
            	}
              }
      });
  }
  
  function editor_tooltip(id){
	  if(!jQuery('#' + id).tooltip('tip') || jQuery('#' + id).tooltip('tip')[0].style.display == "none"){
		  jQuery('#' + id).tooltip('show');
	  } else{
		  jQuery('#' + id).tooltip('hide');
	  }
  }
  
  function removeLeafNames(tree) {
	  if (tree.leafNames) 
		  delete tree.leafNames;
	  if (!tree.children) return;
	  for (var i=0; i<tree.children.length; i++) {
		  removeLeafNames(tree.children[i]);
	  }
  }
  
  var filterData = [{
	    "id":1,
	    "text":"Suites",
	    "value":".suite"
	},{
	    "id":2,
	    "text":"Scripts",
	    "value":".sah"
	},{
	    "id":3,
	    "text":"All",
	    "value":"all"
	}];
  
  function deleteAction(node){
	  var isFile = false;
	  if(node.leaf) isFile = true;
	  jQuery('#mm').menu('hide');
	  jQuery('#mm2').menu('hide');
	  jQuery('#mm5').menu('hide');
	  var confirmMsg = "Are you sure you want to permanently delete the " + ((isFile) ? "file" : "folder") + "?";
	  var r = confirm(confirmMsg);
	  if(!r) return;
	  var deleteRoot = "";
	  var deleteFile = "";
	  if(!node.scriptDir){
		  deleteRoot = node.path;
		  deleteFile = "";
	  }
  	  else {
  		deleteRoot = node.scriptDir;
  	  }
	  if(isFile){
		  deleteFile = node.path;
	  }
	  else{
		  deleteFile = getFolderRelativePath(node);
	  }
	  var deleted = ("true" == actualDelete(deleteRoot + deleteFile, isFile));
	  if(!deleted){
		  return;
	  }
	  jQuery('#tt').tree('remove', node.target);
	  removeTabs(deleteRoot, deleteFile, isFile);
	  changeWebTitleAndMenuVisibility();
  }
  
  function renameAction(node, afterEditText){
	  if(beforeEditText == afterEditText){
		  resetEditTreeInfo();
		  return;
	  }
	  var source = beforeEditRoot + beforeEditFile;
	  var dest = replaceLast(source, beforeEditText, afterEditText);
	  if(isFileExists(dest)){
		  alert("Already exists!");
		  node.text = beforeEditText;
		  jQuery('#tt').tree('update', {
				target: node.target,
				text: node.text
			});
		  resetEditTreeInfo();
		  return;
	  }
	  node.path = replaceLast(node.path, beforeEditText, afterEditText);
	  var renamed = ("true" == actualRename(source, dest, beforeEditIsFile));
	  if(!renamed){
		  reloadNavigator();
		  return;
	  }
	  updateOpenedTabs(beforeEditText, afterEditText);
	  if(!beforeEditIsFile){
		reloadNavigator();
		var dirs = jQuery('#tt').tree('getFolders');
		for(var i=0; i<dirs.length; i++){
			var dir = dirs[i];
			if(dir.scriptDir && dir.scriptDir == beforeEditRoot){
				if(dir.path.substring(0, dir.path.lastIndexOf("/")) == afterEditFile){
					jQuery('#tt').tree('scrollTo', dir.target);
					jQuery('#tt').tree('select', dir.target);
					break;
				}
			}
		}
	  }
	  changeWebTitleAndMenuVisibility();
	  resetEditTreeInfo();
  }
  
  function removeTabs(deleteRoot, deleteFile, isFile){
	  var totalTabs = jQuery('#tt2').tabs('tabs').length;
	  var tabsTitle = [];
	  for(var i=0; i<totalTabs; i++){
		  var p = jQuery('#tt2').tabs('getTab', i);
		  var tt = p.panel('options').title;
		  var hiddenInput = $(tt);
		  if((hiddenInput.className).indexOf("_superframe@temp@") == 0){
			  continue; 
		  }
		  if(hiddenInput.name == deleteRoot){
			  if(isFile){
				  if(hiddenInput.value.substring(hiddenInput.value.indexOf(deleteRoot) + deleteRoot.length) == deleteFile){
					  tabsTitle.push(tt);
				  }
			  }
			  else{
				  if(hiddenInput.value.substring(hiddenInput.value.indexOf(deleteRoot) + deleteRoot.length).indexOf(deleteFile + "/") == 0){
					  tabsTitle.push(tt);
				  }
			  }
		  }
	  }
	  removePanels(tabsTitle);
  }
  
  function updateOpenedTabs(beforeEditText, afterEditText){
	var totalTabs = jQuery('#tt2').tabs('tabs').length;
	for(var i=0; i<totalTabs; i++){
		var p = jQuery('#tt2').tabs('getTab', i);
		  var tt = p.panel('options').title;
		  var hiddenInput = $(tt);
		  if((hiddenInput.className).indexOf("_superframe@temp@") == 0){
			  continue; 
		  }
		  if(hiddenInput.name == beforeEditRoot){
			var isDoc = false;
			if(tt.indexOf("Doc: ") == 0) isDoc = true;
			if(beforeEditIsFile){
				if(hiddenInput.value.substring(hiddenInput.value.indexOf(beforeEditRoot) + beforeEditRoot.length) != beforeEditFile){
					continue;
				}
				var afterEditFile = replaceLast(beforeEditFile, beforeEditText, afterEditText);
				if(isDoc){
					var url = "/_s_/spr/editor/docview/docviewer.htm?dir=" + encodeURIComponent(beforeEditRoot) + "&file=" + encodeURIComponent(afterEditFile);
					var title = "Doc: " + afterEditText + '<strong>' + beforeEditRoot + afterEditFile + '<\/strong>';
					var frameId = "doc_" + '_superframe' + (afterEditFile.replace(/\./g, '').replace(/\//g, ''));
					var webTitle = "Editor - Doc Viewer - " + beforeEditRoot + afterEditFile;
				}
				else{
					var url = getUrl(beforeEditRoot, afterEditFile);
					var title = afterEditText + '<strong>' + beforeEditRoot + afterEditFile + '<\/strong>';
					var frameId = '_superframe' + (afterEditFile.replace(/\./g, '').replace(/\//g, ''));
					var webTitle = "Editor - " + beforeEditRoot + afterEditFile;
				}
			}
			else{
				if(hiddenInput.value.substring(hiddenInput.value.indexOf(beforeEditRoot) + beforeEditRoot.length).indexOf(beforeEditFile + "/") != 0){
					continue;
				}	
				var afterEditFile = replaceLast(beforeEditFile, beforeEditText, afterEditText);
				var afterEditFile2 = beforeEditFile;
				afterEditFile2 = afterEditFile2.substring(0, afterEditFile2.lastIndexOf("/") + 1) + afterEditText;
				afterEditFile2 = afterEditFile2 + "/" +hiddenInput.value.substring(hiddenInput.value.lastIndexOf("/") + 1);
				if(isDoc){
					var url = "/_s_/spr/editor/docview/docviewer.htm?dir=" + encodeURIComponent(beforeEditRoot) + "&file=" + encodeURIComponent(afterEditFile2);
					var title = "Doc: " + afterEditText + '<strong>' + beforeEditRoot + afterEditFile2 + '<\/strong>';
					var frameId = "doc_" + '_superframe' + (afterEditFile2.replace(/\./g, '').replace(/\//g, ''));
					var webTitle = "Editor - Doc Viewer - " + beforeEditRoot + afterEditFile2;
				}
				else{
					var url = getUrl(beforeEditRoot, afterEditFile2);
					var title = hiddenInput.value.substring(hiddenInput.value.lastIndexOf("/") + 1) + '<strong>' + beforeEditRoot + afterEditFile2 + '<\/strong>';
					var frameId = '_superframe' + (afterEditFile2.replace(/\./g, '').replace(/\//g, ''));
					var webTitle = "Editor - " + beforeEditRoot + afterEditFile2;
				}
			}
			updateWebTitleInput(hiddenInput, frameId, title, webTitle);
			updateTab(p, i, url, title, frameId);
		  }
	}
  }
  
  function updateWebTitleInput(el, className, id, value){
	  el.className = className;
	  el.id = id;
	  el.value = value;
  }
  
  function updateTab(tab, tabIndex, url, title, frameId){
	  var content = '<iframe id="'+ frameId +'" scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:99%;"></iframe>';
	  jQuery('#tt2').tabs('update', {
			tab: tab,
			options: {
				title: title,
				content:content,
				closable:true,
		          tools:[{
		              iconCls:'icon-mini-refresh',
		              handler:function(){
		            	  if(frameId.indexOf('_superframe@temp@') != 0){
		            		  jQuery('#'+frameId).get(0).contentWindow.location.reload();
		            	  }
		              }
		          }]
			}
		});
	  
	  var updatedTab = jQuery('#tt2').tabs('getTab', tabIndex);
	  updatedTab.panel('refresh');
  }
  
  function replaceLast(source, beforeEditText, afterEditText){
	  return source.substring(0, source.lastIndexOf(beforeEditText)) + afterEditText + source.substring(source.lastIndexOf(beforeEditText) + beforeEditText.length);
  }
  
  function actualRename(source, dest, isFile){
	  return sahiSendToServer("/_s_/dyn/pro/EditorUI_rename?source="+source+"&dest="+dest+"&isFile="+isFile);
  }
  
  function actualDelete(source, isFile){
	  return sahiSendToServer("/_s_/dyn/pro/EditorUI_delete?source="+source+"&isFile="+isFile);
  }
  
  function resetEditTreeInfo(){
	  beforeEditRoot = null;
	  beforeEditFile = null;
	  beforeEditIsFile = false;
	  beforeEditText = null;
  }
  
  function onFilterSelect(f) {
//    top.location.href='editor.html?search=' + f.value;
	  showCustomSearch(f.value);
  }
  
  function winHeight(){
	  return jQuery(window).height();
  }
  
  function winWidth(){
	  return jQuery(window).width();
  }
  

  function imageShadow() {
	try {
		jQuery('#infoId').mouseover(function() {
			this.style.boxShadow = "2px 2px 1em gray";
			// this.style.cursor = "pointer";
		})

		jQuery('#infoId').mouseout(function() {
			// this.style.boxShadow = null; //not working in IE
			this.style.removeProperty('box-shadow'); // not working till IE8
		})
	} catch (ie8etc) {
	}
}
  
  function schedulePlayback(){
	  makeLinkButtonDisable("#schedulePlayback", true);
	  window.setTimeout(schedulePlayback2, 1);
  }
  
  function isDrun() {
	  return getPlaybackMode() == "distributed";
  }
  
  function schedulePlayback2(){
	  var dateTime = jQuery('#datetimebox').datetimebox('textbox')[0].value;
	  var dateObj = new Date(dateTime);
	  var currentDate = new Date();
	  if(dateTime == ""){
		  alert("Date and Time field cannot be blank");
		  jQuery('#datetimebox').datetimebox('textbox')[0].focus();
		  makeLinkButtonDisable("#schedulePlayback", false);
		  return;
	  }
	  else if(dateObj == "Invalid Date"){
		  alert("Date and Time format is not correct");
		  jQuery('#datetimebox').datetimebox('textbox')[0].focus();
		  makeLinkButtonDisable("#schedulePlayback", false);
		  return;
	  }
	  else if(currentDate >= dateObj){
		  alert("Please Enter Date time Greater than Current Date time");
		  makeLinkButtonDisable("#schedulePlayback", false);
		  return;
	  }
	  var useDrun = isDrun();
	  var usenodes = $('usenodes').value;
	  if(useDrun && usenodes == ""){
		  alert("Nodes information cannot be blank for distributed run. ");
		  makeLinkButtonDisable("#schedulePlayback", false);
		  return;
	  }
	  var scriptDir = $('s_dir').value;
	  var scriptName = $('s_file').value;
	  if(scriptDir == "" || scriptName == ""){
		  alert("Please select or open script/suite.");
		  makeLinkButtonDisable("#schedulePlayback", false);
		  return;
	  }
	  var runId = generateId();
	  var sendemail = $('sendEmail').checked;
	  var emailtrigger = jQuery('#e_trigger').combo('getText');
	  var emailproperties = jQuery('#email_prop').textbox('getText');
	  var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
	  var threads = jQuery('#threads').numberspinner('getValue');
	  var extraParamValue = $("extraParams").value;
	  var description = $('description').value;
	  var diffMasterChecked = $('usedifferentmaster').checked;
	  var diffMasterHost = jQuery('#diffmasterhost').textbox('getText');
	  var diffMasterPort = jQuery('#diffmasterport').textbox('getText');	  
	  var host = diffMasterChecked ? diffMasterHost : location.hostname;
	  var tags = encodeURIComponent(jQuery('#tagsTextId').textbox('getText'));//.replace(/&/g,"&amp;");
	  port = diffMasterChecked ? diffMasterPort : getPort();
	  var userDefinedId = jQuery('#userDefinedIdTextId').textbox('getText');

	  var browsers = jQuery('#browserTxt').combo('getText');
	  var browserArr = browsers.split(",");
	  var multipleBrowsers = (browserArr.length > 1);
	  for (var i=0; i<browserArr.length;i++) {
		  var browser = browserArr[i];

		  if(useDrun){
			  var suiteId = generateId();
			  var originFolder = diffMasterChecked ? scriptDir : "";
			  var origScriptsPath = diffMasterChecked ? "temp/scripts/staging/" : scriptDir;		  
			  var originalSuitePath = origScriptsPath + "/" + scriptName;
			  var copiedScriptsPath = "temp" + "/" + "scripts" + "/" + "copied" ;
			  var suite = copiedScriptsPath + "/" + scriptName;
			  var suitePathParam = "&origScriptsPath=" + encodeURIComponent(origScriptsPath) + "&originalSuitePath=" + encodeURIComponent(originalSuitePath)
			  					   + "&copiedScriptsPath=" + encodeURIComponent(copiedScriptsPath) + "&suite=" + encodeURIComponent(suite) + "&suiteId=" + suiteId;
			  suitePathParam += "&nodes=" + encodeURIComponent(usenodes);
		  }
		  else{
			  var suitePath = scriptDir + scriptName;
			  var suitePathParam = "&suitePath=" + encodeURIComponent(suitePath);
			  suitePathParam += "&isSingleSessionS=" + isSingleSession();
		  }
		  var url = "/_s_/dyn/pro/EditorUI_schedulePlayback?browserType=" + browser + "&baseURL=" 
		  			+ encodeURIComponent(baseURL) + "&threads=" + threads + "&dateTime=" + encodeURIComponent(dateTime)
		  			+ "&host=" + host + "&port=" + port	+ "&description=" + encodeURIComponent(description) + "&useDrun=" 
		  			+ useDrun + "&diffMaster=" + diffMasterChecked + "&originFolder=" + originFolder + "&runId=" + runId
		  			+ "&multipleBrowsers=" + multipleBrowsers
		  			+ suitePathParam + extraParamValue;
		  if(sendemail){
			  url += "&sendEmail=" + sendemail + "&emailTrigger=" + encodeURIComponent(emailtrigger) + "&emailProperties=" + encodeURIComponent(emailproperties)
			  		 + "&emailPasswordHidden=" + emailPasswordHidden;
		  }
		  if(tags != ""){
			  url += "&tags=" + tags;
		  }
		  if (userDefinedId != "") {
			  url += "&userDefinedId=" + userDefinedId;
		  }
		  var logsInfo = $("reportsInfo").value;
		  if (logsInfo != "") {
			  if (multipleBrowsers) {
				  logsInfo = appendBrowserToLogsInfo(logsInfo, browser);
			  }
			  url += "&logsInfo=" + logsInfo;
		  }

		  sahiSendToServer(url);
	  }
	  
	  closeWindow('w2');
	  makeLinkButtonDisable("#schedulePlayback", false);
	  var msg = "<b>Scheduled at " + dateTime + "</b>:<br/>" + scriptName;
	  slide(msg, 5000, 'fade', "Schedule Info");
  }
  
  function openScheduleWindow(id){
	  var browser = jQuery('#browserTxt').combo('getText');
	  var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
	  if (browser == "" || baseURL == ""){
		  alertForBlankPlaybackField();
		  return;
	  }
	  var sendemail = $('sendEmail').checked;
	  var emailproperties = jQuery('#email_prop').textbox('getText');
	  var suite = getSuiteToRun();
	  var scriptDir = suite.scriptDir;
	  var scriptName = suite.scriptName;
	  var diffMasterChecked = $('usedifferentmaster').checked;
	  var diffMasterHost = jQuery('#diffmasterhost').textbox('getText');
	  var diffMasterPort = jQuery('#diffmasterport').textbox('getText');
	  var isDistributed = isDrun();
	  var useNodes = $('usenodes').value;

	  if(!scriptDir || !scriptName){
		  alert("Please select or open script/suite.");
	  }
	  else if(sendemail && emailproperties == ""){
		  alertEmailPropertiesFile();
	  }
	  else if (isDistributed && useNodes == "") {
		  alertForBlankDrunNodesField();
	  }
	  else if (isDistributed && diffMasterChecked && (diffMasterHost == "" || diffMasterPort == "")) {
		  alertForBlankDiffMasterFields();
	  }
	  else{
		  $('s_dir').value = scriptDir;
		  $('s_file').value = scriptName;
		  openWindow(id);
	  }
  }
  
  function openAntTargetWindow(){
	  if(isDrun()){
		  $('antRunDoc').href = "/_s_/docs/using-sahi/playback-desktop.html#Distributed playback via ANT";
	  }
	  else{
		  $('antRunDoc').href = "/_s_/docs/using-sahi/playback-desktop.html#Playback via ANT";
	  }
	  var antText = getAntTargetValue();
	  if(!antText) return;
	  $("antTargetText").value = antText;
	  storeTextAreaValueInEditor("antTargetText");
	  openWindow('w3');
	  refreshInCME("antTargetText");
  }
  
  function getAntTargetValue(){
	  var runDistributed = isDrun();
	  
	  var xml = "";
	  if (runDistributed) {
		  var diffMasterChecked = $('usedifferentmaster').checked;
		  if (diffMasterChecked) {
			  xml = getDistributedDiffInitiatorAntXml();
		  } else {
			  xml = getDistributedAntXml();			  
		  }
	  } else {
		  xml = getNonDistributedAntXml();
	  }
	  
	  return xml;
  }
  
  function getNonDistributedAntXml(){
	  var browsers = jQuery('#browserTxt').combo('getText');
	  var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
	  if (browsers == "" || baseURL == ""){
		  alertForBlankPlaybackField();
		  return null;
	  }
	  var suite = getSuiteToRun();
	  var scriptDir = suite.scriptDir;
	  var scriptName = suite.scriptName;
	  if (!scriptDir || !scriptName){
		  alert("Please select or open script/suite.");
		  return null;
	  }
	  
	  var sendemail = $('sendEmail').checked;
	  var emailproperties = jQuery('#email_prop').textbox('getText');
	  
	  if (sendemail == "true"){
		  if(emailproperties == ""){
			  alertEmailPropertiesFile();
			  return null;
		  }
	  }

	  var retryTarget = $('retryTarget').checked;
	  var retryOrFailCall = "";
	  var retryTargetTemplate = "";
	  var extraParamSt = "";
	  var extraParams = $('extraParams').value;
	  var emailtrigger = jQuery('#e_trigger').combo('getText');
	  var tags = jQuery('#tagsTextId').textbox('getText').replace(/&/g,"&amp;");
	  tags = (tags != "" ? "\n\t\t\t" + "tags=\"" + tags + "\"" : ""); 
	  var userDefinedId = jQuery('#userDefinedIdTextId').textbox('getText').trim();
	  userDefinedId = (userDefinedId != "" ? "\n\t\t\t" + "userDefinedId=\"" + userDefinedId + "\"" : "");
	  var reportsInfoParams = $('reportsInfo').value;
	  
	  if (extraParams != "") {
		  extraParamSt = "\n\t\t\t<!-- Custom fields - add, edit or remove as required -->";
		  var extparamsAr = extraParams.split("&");
		  for(var i=0; i<extparamsAr.length; i++){
			  var extraParam =  extparamsAr[i];
			  if(extraParam.indexOf("=") == -1) continue;
			  extraParam = decodeURIComponent(extraParam);
			  var extparamAr = extraParam.split("=");
			  extraParamSt += "\n\t\t\t<customfield key=\"" + extparamAr[0] + "\" value=" + quoted(extparamAr[1])+"/>";
		  }
	  }
	  
	  var browserArr = browsers.split(",");
	  var multipleBrowsers = (browserArr.length > 1);
	  
	  var runtestsPrefix = "runtests";
	  var multiplerunTarget = "runmultiplebrowsers";
	  
	  var defaultTarget = multipleBrowsers ? multiplerunTarget : runtestsPrefix + browserArr[0];
	  var targets = "";
	  for (var count=0; count<browserArr.length; count++) {
		  var browser = browserArr[count];
		  var reportsInfoSt = "";
		  var reportsInfoRetrySt = "";
		  
		  var target = "";
		  
		  if (reportsInfoParams != "") {
			  reportsInfoSt = "\n\t\t\t<!-- Offline reports -->";
			  reportsInfoRetrySt = "\n\t\t\t<!-- Offline reports -->";
			  var reportsInfoParamsAr = reportsInfoParams.split(",");
			  for (var i=0; i<reportsInfoParamsAr.length; i++) {
				  var reportsParam = reportsInfoParamsAr[i];
				  
				  var index = reportsParam.indexOf(":");
				  var type;
				  var logDir;
				  
				  if (index == -1) { // Reports location not specified.
					  type = reportsParam;
					  logDir = "";
				  } else {
					  type = reportsParam.substring(0, index);
					  logDir = reportsParam.substring(index+1);
					  logDir = (multipleBrowsers ? logDir + "/" + "${browser}" : logDir);
				  }
				  
				  reportsInfoSt += (logDir && logDir != "") ? "\n\t\t\t<report type=\"" + type + "\" logdir=\"" + logDir +"\"/>" 
						  : "\n\t\t\t<report type=\"" + type + "\"/>";
				  reportsInfoRetrySt += (logDir && logDir != "") ? "\n\t\t\t<report type=\"" + type + "\" logdir=\"" + logDir + "/retry\"/>"
						  : "\n\t\t\t<report type=\"" + type + "\"/>";					  
			  }
		  }
		  
		  var threads = jQuery('#threads').numberspinner('getValue');
		  target = getAntSahiTargetTemplate().replace("$threads", threads);

		  var failedSuite = scriptName;
		  if(/\.dd\.csv$/.test(failedSuite)){
			  failedSuite = replaceLast(failedSuite, '.dd.csv', '_failed_' + "${browser}" + '.dd.csv');
		  }
		  else if(/\.suite$/.test(failedSuite)){
			  failedSuite = replaceLast(failedSuite, '.suite', '_failed_' + "${browser}" + '.suite');
		  }
		  target = target.replace("$failedSuite", failedSuite);

		  var failsahiTargetTemplate = "";
		  if(retryTarget){
			  retryOrFailCall = "\n\t\t<antcall target=\"retryfailed$browser\"/>";
			  retryTargetTemplate = "\n\n" + getAntSahiTargetRetryTemplate();
			  target = target.replace("$retryTarget", retryTargetTemplate);
			  target = target.replace("$reportsRetryInfo", reportsInfoRetrySt);
			  failsahiTargetTemplate = "\n\n" + getAntSahiFailTargetRetryTemplate();
		  } else {
			  retryOrFailCall = "\n\t\t<antcall target=\"failsahi$browser\"/>";
			  target = target.replace("$retryTarget", "");
			  failsahiTargetTemplate = "\n\n" + getAntSahiFailTargetTemplate();
		  }
		  
		  target = target.replace("$failTarget", failsahiTargetTemplate).replace("$retryOrFailCall", retryOrFailCall).replace(/\$scriptDir/g, scriptDir).replace(/\$scriptName/g, scriptName).replace(/\$browser/g, browser).replace(/\$baseURL/g, baseURL)
			.replace(/\$port/g, getPort()).replace(/\$extraParam/g, extraParamSt).replace(/\$host/g, location.hostname).replace(/\$sendemail/g, sendemail)
			.replace(/\$emailtrigger/g, emailtrigger).replace(/\$emailproperties/g, emailproperties).replace(/\$emailPasswordHidden/g, emailPasswordHidden)
			.replace(/\$tags/g, tags).replace(/\$userDefinedId/g, userDefinedId).replace("$reportsInfo", reportsInfoSt).replace("$runtarget", runtestsPrefix + browser)
			.replace(/\$singlesession/g, isSingleSession());
		  
		  targets += "\n" + target;
	  }
	  
	  var xml = getAntXmlTemplate();
	  var callParallelTargets = "";
	  if (multipleBrowsers) {
		  var parallelTargets = "";
		  for (var i=0; i<browserArr.length; i++) {
			  parallelTargets += "\n\t\t\t<antcall target=\"" + runtestsPrefix + browserArr[i] + "\"/>";
		  }
		  
		  callParallelTargets = getAntParallelTargetsTemplate().replace("$parallelTargets", parallelTargets).replace("$multiplerunTarget", multiplerunTarget);
	  }
	  
	  xml = xml.replace("$callParallelTargets", callParallelTargets).replace("$runtestTargets", targets).replace("$defaultTarget", defaultTarget);
	  
	  return xml;
  }

  function getDistributedAntXml(){
	  var browsers = jQuery('#browserTxt').combo('getText');
	  var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
	  if (browsers == "" || baseURL == ""){
		  alertForBlankPlaybackField();
		  return null;
	  }
	  var suite = getSuiteToRun();
	  var scriptDir = suite.scriptDir;
	  var scriptName = suite.scriptName;
	  if(!scriptDir || !scriptName){
		  alert("Please select or open script/suite.");
		  return null;
	  }
	  
	  var sendemail = $('sendEmail').checked;
	  var emailproperties = jQuery('#email_prop').textbox('getText');
	  var useNodes = $('usenodes').value;
	  
	  if(sendemail == "true" && emailproperties == ""){
		  alertEmailPropertiesFile();
		  return null;
	  }
	  if (useNodes == "") {
		  alertForBlankDrunNodesField();
		  return null;
	  }
	  
	  var runId = generateId();

	  var retryTarget = $('retryTarget').checked;
	  var retryOrFailCall = "";
	  var target = "";
	  var retryTargetTemplate = "";
	  var extraParamSt = "";
	  var extraParams = $('extraParams').value;
	  var emailtrigger = jQuery('#e_trigger').combo('getText');
	  var tags = jQuery('#tagsTextId').textbox('getText').replace(/&/g,"&amp;");
	  tags = (tags != "" ? "\n\t\t\t" + "tags=\"" + tags + "\"" : ""); 
	  var userDefinedId = jQuery('#userDefinedIdTextId').textbox('getText').trim();
	  userDefinedId = (userDefinedId != "" ? "\n\t\t\t" + "userDefinedId=\"" + userDefinedId + "\"" : "");
	  var reportsInfoParams = $('reportsInfo').value;
	  
	  if(extraParams != ""){
		  extraParamSt = "\n\t\t\t<!-- Custom fields - add, edit or remove as required -->";
		  var extparamsAr = extraParams.split("&");
		  for(var i=0; i<extparamsAr.length; i++){
			  var extraParam =  extparamsAr[i];
			  if(extraParam.indexOf("=") == -1) continue;
			  extraParam = decodeURIComponent(extraParam);
			  var extparamAr = extraParam.split("=");
			  extraParamSt += "\n\t\t\t<customfield key=\"" + extparamAr[0] + "\" value=" + quoted(extparamAr[1])+"/>";
		  }
	  }
	  
	  var browserArr = browsers.split(",");
	  var multipleBrowsers = (browserArr.length > 1);
	  
	  var drunPrefix = "drun";
	  var multiplerunTarget = "drunmultiplebrowsers";
	  
	  var defaultTarget = multipleBrowsers ? multiplerunTarget : drunPrefix + browserArr[0];
	  var targets = "";
	  for (var count=0; count<browserArr.length; count++) {
		  var browser = browserArr[count];
		  var reportsInfoSt = "";
		  var reportsInfoRetrySt = "";
		  var pullLogsSt = "";

		  var target = "";
	  
		  if (reportsInfoParams != "") {
			  reportsInfoSt = "\n\t\t\t<!-- Offline reports -->";
			  reportsInfoRetrySt = "\n\t\t\t<!-- Offline reports -->";			  
			  var reportsInfoParamsAr = reportsInfoParams.split(",");
			  for(var i=0; i<reportsInfoParamsAr.length; i++){
				  var reportsParam = reportsInfoParamsAr[i];
				  
				  var index = reportsParam.indexOf(":");
				  var type;
				  var logDir;
				  
				  if (index == -1) { // Reports location not specified.
					  type = reportsParam;
					  logDir = "";
				  } else {
					  type = reportsParam.substring(0, index);
					  logDir = reportsParam.substring(index+1);
					  logDir = (multipleBrowsers ? logDir + "/" + "${browser}" : logDir);
				  }
				  
				  reportsInfoSt += (logDir && logDir != "") ? "\n\t\t\t<report type=\"" + type + "\" logdir=\"" + logDir +"\"/>" 
						  : "\n\t\t\t<report type=\"" + type + "\"/>";
				  reportsInfoRetrySt += (logDir && logDir != "") ? "\n\t\t\t<report type=\"" + type + "\" logdir=\"" + logDir + "/retry\"/>"
						  : "\n\t\t\t<report type=\"" + type + "\"/>";					  
			  }
		  }
		  
		  var nodesParamSt = "";
		  var nodesParams = $('usenodes').value;
		  if(nodesParams != ""){
			  var nodeparamsAr = nodesParams.split(",");
			  for(var i=0; i<nodeparamsAr.length; i++){
				  var nodesParam =  nodeparamsAr[i];
				  if(nodesParam.indexOf(":") == -1) continue;
				  nodesParam = decodeURIComponent(nodesParam);
				  var nodeparamAr = nodesParam.split(":");
				  nodesParamSt += "\n\t\t\t" + "<node host=" + quoted(nodeparamAr[0]) + " port=" + quoted(nodeparamAr[1]) + "/>";
			  }
		  }

		  var failedSuite = scriptName;
		  if(/\.dd\.csv$/.test(failedSuite)){
			  failedSuite = replaceLast(failedSuite, '.dd.csv', '_failed_' + "${browser}" + '.dd.csv');
		  }
		  else if(/\.suite$/.test(failedSuite)){
			  failedSuite = replaceLast(failedSuite, '.suite', '_failed_' + "${browser}" + '.suite');
		  }
		  
		  target = getAntSahiDrunTargetTemplate().replace("$nodesInfo", nodesParamSt);
		  
		  var failsahiTargetTemplate = "";
		  if (retryTarget){
			  retryOrFailCall = "\n\t<antcall target=\"retryfailed$browser\"/>";
			  retryTargetTemplate = "\n\n" + getAntSahiDrunTargetRetryTemplate();
			  target = target.replace("$retryTarget", retryTargetTemplate);
			  target = target.replace("$reportsRetryInfo", reportsInfoRetrySt);
			  failsahiTargetTemplate = "\n\n" + getAntSahiFailTargetRetryTemplate();
		  } else {
			  retryOrFailCall = "\n\t<antcall target=\"failsahi$browser\"/>";
			  target = target.replace("$retryTarget", "");
			  failsahiTargetTemplate = "\n\n" + getAntSahiFailTargetTemplate();
		  }

		  target = target.replace("$failTarget", failsahiTargetTemplate).replace("$retryOrFailCall", retryOrFailCall).replace(/\$scriptName/g, scriptName).replace(/\$browser/g, browser)
		  	.replace(/\$baseURL/g, baseURL).replace(/\$extraParam/g, extraParamSt).replace(/\$sendemail/g, sendemail)
			.replace(/\$emailtrigger/g, emailtrigger).replace(/\$emailproperties/g, emailproperties).replace(/\$emailPasswordHidden/g, emailPasswordHidden)
			.replace(/\$tags/g, tags).replace(/\$userDefinedId/g, userDefinedId).replace("$reportsInfo", reportsInfoSt).replace("$drun", drunPrefix + browser)
			.replace("$failedSuite", failedSuite);
		  
		  targets += "\n" + target;
	  }
	  
	  var xml = getAntDrunXmlTemplate();
	  var callParallelTargets = "";
	  if (multipleBrowsers) {
		  var parallelTargets = "";
		  for (var i=0; i<browserArr.length; i++) {
			  parallelTargets += "\n\t\t\t<antcall target=\"" + drunPrefix + browserArr[i] + "\"/>";
		  }
		  
		  callParallelTargets = getAntParallelTargetsTemplate().replace("$parallelTargets", parallelTargets).replace("$multiplerunTarget", multiplerunTarget);
	  }
	  
	  xml = xml.replace("$callParallelTargets", callParallelTargets).replace("$runtestTargets", targets).replace("$defaultTarget", defaultTarget);
	  xml = xml.replace(/\$host/g, location.hostname).replace(/\$port/g, getPort())
				.replace(/\$scriptDir/g, scriptDir).replace(/\$runId/g, runId);	  
	  
	  return xml;	  
  }
  
  function getDistributedDiffInitiatorAntXml(){
	  var browsers = jQuery('#browserTxt').combo('getText');
	  var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
	  if (browsers == "" || baseURL == ""){
		  alertForBlankPlaybackField();
		  return null;
	  }
	  var suite = getSuiteToRun();
	  var scriptDir = suite.scriptDir;
	  var scriptName = suite.scriptName;
	  if(!scriptDir || !scriptName){
		  alert("Please select or open script/suite.");
		  return null;
	  }
	  
	  var sendemail = $('sendEmail').checked;
	  var emailproperties = jQuery('#email_prop').textbox('getText');
	  
	  if(sendemail == "true"){
		  if(emailproperties == ""){
			  alertEmailPropertiesFile();
			  return null;
		  }
	  }

	  var diffMasterHost = jQuery('#diffmasterhost').textbox('getText');
	  var diffMasterPort = jQuery('#diffmasterport').textbox('getText');
	  
	  if (diffMasterHost == "" || diffMasterPort == "") {
			  alertForBlankDiffMasterFields();
			  return null;
	  }
	  
	  var runId = generateId();
	  
	  var retryTarget = $('retryTarget').checked;
	  var retryOrFailCall = "";
	  var target = "";
	  var retryTargetTemplate = "";
	  var extraParamSt = "";
	  var extraParams = $('extraParams').value;
	  var emailtrigger = jQuery('#e_trigger').combo('getText');
	  var tags = jQuery('#tagsTextId').textbox('getText').replace(/&/g,"&amp;");
	  tags = (tags != "" ? "\n\t\t\t" + "tags=\"" + tags + "\"" : ""); 
	  var userDefinedId = jQuery('#userDefinedIdTextId').textbox('getText').trim();
	  userDefinedId = (userDefinedId != "" ? "\n\t\t\t" + "userDefinedId=\"" + userDefinedId + "\"" : "");
	  var reportsInfoParams = $('reportsInfo').value;
	  
	  if (extraParams != ""){
		  extraParamSt = "\n\t\t\t<!-- Custom fields - add, edit or remove as required -->";
		  var extparamsAr = extraParams.split("&");
		  for(var i=0; i<extparamsAr.length; i++){
			  var extraParam =  extparamsAr[i];
			  if(extraParam.indexOf("=") == -1) continue;
			  extraParam = decodeURIComponent(extraParam);
			  var extparamAr = extraParam.split("=");
			  extraParamSt += "\n\t\t\t<customfield key=\"" + extparamAr[0] + "\" value=" + quoted(extparamAr[1])+"/>";
		  }
	  }
	  
	  var browserArr = browsers.split(",");
	  var multipleBrowsers = (browserArr.length > 1);
	  
	  var targets = "";
	  var drunPrefix = "drun";

	  for (var count=0; count<browserArr.length; count++) {
		  var browser = browserArr[count];
		  var reportsInfoSt = "";
		  var reportsInfoRetrySt = "";

		  var target = "";

		  var pullLogsSt = "";
		  var pullRetryLogsSt = "";
		  if (reportsInfoParams != "") {
			  reportsInfoSt = "\n\t\t\t<!-- Offline reports -->";
			  reportsInfoRetrySt = "\n\t\t\t<!-- Offline reports -->";			  
			  pullLogsSt = "\n\t\t<!-- Pull the logs from the Master onto the Initiator machine -->";
			  pullRetryLogsSt = "\n\t\t<!-- Pull the retry logs from the Master onto the Initiator machine -->";
			  var reportsInfoParamsAr = reportsInfoParams.split(",");
			  for(var i=0; i<reportsInfoParamsAr.length; i++){
				  var reportsParam = reportsInfoParamsAr[i];
				  
				  var index = reportsParam.indexOf(":");
				  var type = (index == -1 ? reportsParam : reportsParam.substring(0, index));
				  var logDir = (index == -1 ? "logs/" + type : reportsParam.substring(index+1));
				  logDir = (multipleBrowsers ? logDir + "/" + "${browser}" : logDir);
				  var tempLogDir = "logs/temp/" + type + "/${ts}";				  
				  tempLogDir = (multipleBrowsers ? tempLogDir + "/" + "${browser}" : tempLogDir);

				  reportsInfoSt += "\n\t\t\t<report type=\"" + type + "\" logdir=\"" + tempLogDir + "\"/>";
				  reportsInfoRetrySt += "\n\t\t\t<report type=\"" + type + "\" logdir=\"" + tempLogDir + "/retry\"/>";
				  
				  pullLogsSt += "\n\t\t<sahipull sourceHost=\"$masterhost\" sourcePort=\"$masterport\" originFolder=\"" + tempLogDir + "\""
			  		+ " destFolder=\"" + logDir + "\" ignorePattern=\".*(svn|copied).*\"/>";
				  
				  pullRetryLogsSt += "\n\t\t<sahipull sourceHost=\"$masterhost\" sourcePort=\"$masterport\" originFolder=\"" + tempLogDir + "/retry" + "\""
			  		+ " destFolder=\"" + logDir + "/retry" + "\" ignorePattern=\".*(svn|copied).*\"/>";
			  }
		  }
		  
		  var nodesParamSt = "";
		  var nodesParams = $('usenodes').value;
		  if(nodesParams != ""){
			  var nodeparamsAr = nodesParams.split(",");
			  for(var i=0; i<nodeparamsAr.length; i++){
				  var nodesParam =  nodeparamsAr[i];
				  if(nodesParam.indexOf(":") == -1) continue;
				  nodesParam = decodeURIComponent(nodesParam);
				  var nodeparamAr = nodesParam.split(":");
				  nodesParamSt += "\n\t\t\t" + "<node host=" + quoted(nodeparamAr[0]) + " port=" + quoted(nodeparamAr[1]) + "/>";
			  }
		  }

		  var failedSuite = scriptName;
		  if(/\.dd\.csv$/.test(failedSuite)){
			  failedSuite = replaceLast(failedSuite, '.dd.csv', '_failed_' + "${browser}" + '.dd.csv');
		  }
		  else if(/\.suite$/.test(failedSuite)){
			  failedSuite = replaceLast(failedSuite, '.suite', '_failed_' + "${browser}" + '.suite');
		  }

		  target = getAntSahiDrunDiffInitiatorTargetTemplate().replace("$nodesInfo", nodesParamSt);
		  var failsahiTargetTemplate = "";
		  if(retryTarget){
			  retryOrFailCall = "\n\t\t<antcall target=\"retryfailed$browser\"/>";
			  retryTargetTemplate = "\n\n" + getAntSahiDrunDiffInitiatorTargetRetryTemplate();
			  retryTargetTemplate = retryTargetTemplate.replace("$pullRetryLogs", pullRetryLogsSt).replace("$reportsRetryInfo", reportsInfoRetrySt);
			  failsahiTargetTemplate = "\n\n" + getAntSahiFailTargetRetryTemplate();
			  target = target.replace("$retryTarget", retryTargetTemplate);
		  } else {
			  retryOrFailCall = "\n\t\t<antcall target=\"failsahi$browser\"/>";
			  failsahiTargetTemplate = "\n\n" + getAntSahiFailTargetTemplate();
  			  target = target.replace("$retryTarget", "");
		  }
		  
		  target = target.replace("$failTarget", failsahiTargetTemplate).replace("$retryOrFailCall", retryOrFailCall).replace(/\$scriptName/g, scriptName).replace(/\$browser/g, browser).replace(/\$baseURL/g, baseURL)
			.replace(/\$port/g, getPort()).replace(/\$extraParam/g, extraParamSt).replace(/\$host/g, location.hostname).replace(/\$sendemail/g, sendemail)
			.replace(/\$emailtrigger/g, emailtrigger).replace(/\$emailproperties/g, emailproperties).replace(/\$emailPasswordHidden/g, emailPasswordHidden)
			.replace(/\$tags/g, tags).replace(/\$userDefinedId/g, userDefinedId).replace("$reportsInfo", reportsInfoSt).replace("$drun", drunPrefix + browser)
			.replace("$pullLogs", pullLogsSt).replace("$failedSuite", failedSuite);
		  
		  targets += "\n" + target;
	  }
	  
	  var xml = getAntDrunDiffInitiatorXmlTemplate();
	  var callRunTargets = "";
	  
	  if (multipleBrowsers) {
		  var parallelTargets = "";
		  for (var i=0; i<browserArr.length; i++) {
			  parallelTargets += "\n\t\t\t\t<antcall target=\"" + drunPrefix + browserArr[i] + "\"/>";
		  }
		  
		  callRunTargets = "\n\t\t\t<parallel>" + parallelTargets + "\n\t\t\t</parallel>";
	  } else {
		  callRunTargets = "\n\t\t\t<antcall target=\"" + drunPrefix + browserArr[0] + "\"/>";
	  }

	  xml = xml.replace("$callRunTargets", callRunTargets).replace("$runtestTargets", targets);
	  xml = xml.replace(/\$masterhost/g, diffMasterHost).replace(/\$masterport/g, diffMasterPort)
	  			.replace(/\$scriptDir/g, scriptDir).replace(/\$runId/g, runId);
	  
	  return xml;	  
  }
  
  function alertEmailPropertiesFile(){
	  alert("Email Properties File cannot be blank");
	  if(jQuery('#w4').window('options').closed) 
		  openWindow('w4');
	  jQuery('#email_prop').textbox('textbox')[0].focus();
  }
  function alertForBlankDrunNodesField(){
	   alert("Distribution nodes cannot be blank");
	   if(jQuery('#w4').window('options').closed) 
			openWindow('w4');
	   if(!jQuery('#nodesEditor').tooltip('tip') || jQuery('#nodesEditor').tooltip('tip')[0].style.display == "none")
		   editor_tooltip('nodesEditor');
  }
  function alertForBlankDiffMasterFields(){
	   alert("Master Host and Port cannot be blank");
	   if(jQuery('#w4').window('options').closed) 
			openWindow('w4');
	   
	   if (jQuery('#diffmasterhost').textbox('getText') == "") {
		   jQuery('#diffmasterhost').focus();
	   } else if (jQuery('#diffmasterport').textbox('getText') == "") {
		   jQuery('#diffmasterport').focus();
	   }
  }
  
  function changeAntTarget(){
	  var antText = getAntTargetValue();
	  if(!antText) return;
	  $("antTargetText").value = antText;
	  storeTextAreaValueInEditor("antTargetText");
	  refreshInCME("antTargetText");
  }
  
  function getAntXmlTemplate(){
	  if(xmlTemplate){
		  return xmlTemplate;
	  }
	  else{
		  xmlTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_xml_template.txt");
		  return xmlTemplate;
	  }
  }
  
  function getAntDrunXmlTemplate(){
	  if (!drunXmlTemplate){
		  drunXmlTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_drun_ant_xml_template.txt");
	  }
	  return drunXmlTemplate;
  }
  
  function getAntDrunDiffInitiatorXmlTemplate(){
	  if (!drunDiffInitiatorXmlTemplate){
		  drunDiffInitiatorXmlTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_drun_diff_initiator_ant_xml_template.txt");
	  }
	  return drunDiffInitiatorXmlTemplate;
  }
  
  function getAntParallelTargetsTemplate(){
	  if(!parallelTargetsTemplate){
		  parallelTargetsTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_parallel_targets_template.txt");
	  }
	  return parallelTargetsTemplate;
  }

  function getAntSahiTargetTemplate(){
	  if(!targetTemplate){
		  targetTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_target_template.txt");
	  }
	  return targetTemplate;
  }
  
  function getAntSahiTargetRetryTemplate(){
	  if(!targetTemplateRetry){
		  targetTemplateRetry = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_target_retry_template.txt");
	  }
	  return targetTemplateRetry;
  }
  
  function getAntSahiXmlTemplate(){
	  if(!targetTemplateRetry){
		  targetTemplateRetry = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_target_retry_template.txt");
	  }
	  return targetTemplateRetry;
  }  
  
  function getAntSahiDrunTargetTemplate(){
	  if(!targetDrunTemplate){
		  targetDrunTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_drun_ant_target_template.txt");
	  }
	  return targetDrunTemplate;
  }
  
  function getAntSahiDrunTargetRetryTemplate(){
	  if(!targetDrunTemplateRetry){
		  targetDrunTemplateRetry = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_drun_ant_target_retry_template.txt");
	  }
	  return targetDrunTemplateRetry;
  }
  
  function getAntSahiDrunDiffInitiatorTargetTemplate(){
	  if(!targetDrunDiffInitiatorTemplate){
		  targetDrunDiffInitiatorTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_drun_diff_initiator_ant_target_template.txt");
	  }
	  return targetDrunDiffInitiatorTemplate;
  }
  
  function getAntSahiDrunDiffInitiatorTargetRetryTemplate(){
	  if(!targetDrunDiffInitiatorTemplateRetry){
		  targetDrunDiffInitiatorTemplateRetry = 
			  sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_drun_diff_initiator_ant_target_retry_template.txt");
	  }
	  return targetDrunDiffInitiatorTemplateRetry;
  }
  
  function getAntSahiFailTargetRetryTemplate(){
	  if(!targetFailTemplateRetry){
		  targetFailTemplateRetry = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_retryfailsahi_target_template.txt");
	  }
	  return targetFailTemplateRetry;
  }
  
  function getAntSahiFailTargetTemplate(){
	  if(!targetFailTemplate){
		  targetFailTemplate = sahiSendToServer("/_s_/dyn/pro/EditorUI_readFileInEditor?file=" + "sahi_ant_failsahi_target_template.txt");
	  }
	  return targetFailTemplate;
  }
  
  function openWindow(id){
	  jQuery('#'+id).window('open');
  }
  
  function closeWindow(id){
	  jQuery('#'+id).window('close');
  }
  
  function resetPlaybackProp(){
	  paramEditorDisplayNone();
	  nodesEditorDisplayNone();
	  reportEditorDisplayNone();
	  jQuery('#browserTxt').combobox('setValues', []);
	  jQuery('#startURLTxt').combobox('setValue', "");
	  jQuery('#threads').numberspinner('setValue', '5');
	  setPlaybackMode("parallel");
	  onUseDiffMasterChanged($("usedifferentmaster"));
	  $("extraParams").value = "";
	  $("extraNodes").value = location.hostname + ":" + getPort();
	  setReadOnlyNodesInfo();
	  $("usedifferentmaster").checked = false;
	  jQuery('#diffmasterhost').textbox('setText', "");
	  jQuery('#diffmasterport').textbox('setText', getPort());
	  $("reportsInfo").value = "";
	  jQuery("#userDefinedIdTextId").textbox('setText', "");
	  $('sendEmail').checked = false;
	  showSendEmailProperties(false);
	  jQuery('#e_trigger').combobox('setValues', ["success","failure"]);
	  jQuery('#tagsTextId').textbox('setText', "");
  }
  
  function viewSetting(){
	  var westPanelCollapsed = jQuery('#container').layout('panel','west').panel('options').collapsed;
	  if(westPanelCollapsed){
		  $('view').onclick = returnTileView();
		  jQuery('#view').linkbutton({
		    iconCls: 'icon-window_tile'
		  });
	  }
	  else{
		  $('view').onclick = returnFullView();
		  jQuery('#view').linkbutton({
		    iconCls: 'icon-window_full'
		  });
	  }
  }
  
  function selectFull(id){
	  $(id).setSelectionRange(0, $(id).value.length)
  }
  
  function fullView(){
	  if(!jQuery('#container').layout('panel','west').panel('options').collapsed)
			jQuery('#container').layout('collapse','west');
  }
  
  function returnFullView(){
	  return function () {
		  fullView();
	  }
  }
  
  function tileView(){
	  if(jQuery('#container').layout('panel','west').panel('options').collapsed)
			jQuery('#container').layout('expand','west');
  }
  
  function returnTileView(){
	  return function () {
		  tileView();
	  }
  }
  
  function openDocTabFromIframe(url, root, file){
	  var selectedTab = jQuery('#tt2').tabs('getSelected');
	  var selectedTabTitle = selectedTab.panel('options').title;
	  var frameId = "doc_" + $(selectedTabTitle).className;
	  var oldTitle = $(selectedTabTitle).value;
	  var prefix = "Editor - ";
	  var s = oldTitle.split(prefix);
	  var webTitle = prefix + "Doc Viewer - " + s[1];
	  var title = "Doc: " + selectedTabTitle;
	  if (jQuery('#tt2').tabs('exists', title)){
    	  jQuery('#tt2').tabs('select', title);
      } else {
          addNewTab(frameId, url, title);
          createWebTitleInput(title, webTitle, root, frameId);
          changeWebTitleAndMenuVisibility();
      }
  }
  
  function checkDirtyTab(title, action) {
		if (!g_checkDirty) return true;
		var iframe = getIframeWindowOfTab(title);
		if (!iframe) return true;
		var dirty = false;
		var isDirtyFn = iframe.isDirty;
		if (isDirtyFn) 
			dirty = isDirtyFn();
		return dirty ? confirm('There are unsaved changes.\nAre you sure you want to ' + action + ' ' + title.replace(/<.*>/,'') + '?') : true;	  
  }
  
  function openCookieOpenTabs(){
	  jQuery('#tt2').tabs({
		onBeforeClose : function(title, index) {
			return checkDirtyTab(title, "close");
		}
	  });	  
	  var o = eval(decodeURIComponent(readHistory("openTabs")));
	  if(o === null) o = [];
	  var selectedTitle = null;
	  for(var i=0; i<o.length; i++){
		  var t = o[i];
		  var title = t.tabTitle;
		  var frameId = t.frameId;
		  var root = t.root;
		  var webTitle = t.webTitle;
		  if(t.selected) selectedTitle = title;
		  var tag = frameId.substring(0, frameId.indexOf("_"));
		  if(tag != "DBLogs"){
			  var fullNodePath = title.substring(title.lastIndexOf("<strong>")+"<strong>".length, title.lastIndexOf("</strong>"));
			  var nodePath = fullNodePath.substring(root.length);
		  }
		  if(tag == "log"){
			  var nodeText = title.substring("Logs: ".length, title.lastIndexOf("<strong>"));
		  }
		  if(tag == ""){
			 if(!isFileExists(root + nodePath)){
				 continue;
			 }
			 if(nodePath.match(".s.csv$") == ".s.csv" || nodePath.match(".xls$") == ".xls" || nodePath.match(".xlsx$") == ".xlsx"){
				 var url = "spreadsheet/spreadsheet.html?dir=" + encodeURIComponent(root) + "&file=" + encodeURIComponent(nodePath);
			 }
			 else if(nodePath.match(".dd.csv$") == ".dd.csv"){
				 var url = "spreadsheet/ddcsv_spreadsheet.html?dir=" + encodeURIComponent(root) + "&file=" + encodeURIComponent(nodePath);
			 }
			 else{
				 var url = "refactor/refactor.htm?dir=" + encodeURIComponent(root) + "&file=" + encodeURIComponent(nodePath);
			 }
		  } else if(tag == "doc"){
			  if(!isFileExists(root + nodePath)){
				 continue;
			  }
			  if(nodePath.indexOf('.sah', nodePath.length - '.sah'.length) == -1){
				continue;
			  }
			  var url = "/_s_/spr/editor/docview/docviewer.htm?dir=" + encodeURIComponent(root) + "&file=" + encodeURIComponent(nodePath);
		  } else if(tag == "log"){
			  var query = getQuery(nodeText);
			  var url = "/_s_/dyn/pro/DBReports?sql=" + encodeURIComponent(query);
		  } else{
			  var url = "_s_/dyn/pro/DBReports";
		  }
		  addNewTab(frameId, url, title);
          createWebTitleInput(title, webTitle, root, frameId);
	  }
	  jQuery('#tt2').tabs('select', selectedTitle);
	  changeWebTitleAndMenuVisibility();
  }

  function westPanelCollapsedStateCookie(){
	  var w = readHistory("westPanelCollapsed");
	  if(!w) return null;
	  if(w == 'true') return 'true';
	  return null;
  }
  
  window.onbeforeunload = function(e) {
	  createHistoryData();
	  createhistory(e_history);
	  var nodes_history = $('extraNodes').value;
	  createNodesHistory(nodes_history);
	  if(confirmOnUnload){
		  var message = '';
		  if (typeof e == 'undefined') {
			  e = window.event;
		  }
		  if (e) {
			  e.returnValue = message;
		  }
		  return message;
	  }
  };
  
  function createHistoryData(){
	  e_history = "";
	  var westPanelCollapsed = jQuery('#container').layout('panel','west').panel('options').collapsed;
	  e_history = "westPanelCollapsed=" + westPanelCollapsed + ";";
	  createCookieForOpenTabs();
	  var browser = jQuery('#browserTxt').combo('getText');
	  var baseURL = jQuery('#startURLTxt').combobox('textbox')[0].value;
	  var threads = jQuery('#threads').numberspinner('getValue');
	  var extraParamValue = $("extraParams").value;
	  e_history += "browser=" + browser + ";";
	  e_history += "baseURL=" + encodeURIComponent(baseURL) + ";";
	  e_history += "threads=" + threads + ";";
	  e_history += "extraParamValue=" + encodeURIComponent(extraParamValue) + ";";
	  e_history += "reportsInfo=" + $("reportsInfo").value + ";";
	  e_history += "linkWithEditor=" + isLinkWithEditor() + ";";
	  e_history += "playbackMode=" + getPlaybackMode() + ";";
	  e_history += "useDifferentMaster=" + $('usedifferentmaster').checked + ";";
	  var diffMasterInfo = jQuery('#diffmasterhost').textbox('getText') != "" && jQuery('#diffmasterport').textbox('getText') != "" ?
			  jQuery('#diffmasterhost').textbox('getText') + ":" + jQuery('#diffmasterport').textbox('getText') : "";
	  e_history += "diffMasterInfo=" + diffMasterInfo + ";";		  
	  e_history += "tags=" + encodeURIComponent(jQuery('#tagsTextId').textbox('getText')) + ";";
	  e_history += "sendEmail=" + $('sendEmail').checked + ";";
	  e_history += "emailTrigger=" + jQuery('#e_trigger').combo('getText') + ";";
	  e_history += "userDefinedId=" + encodeURIComponent(jQuery('#userDefinedIdTextId').textbox('getText')) + ";";
	  e_history += "advancedSettings=" + encodeURIComponent($('advancedSettingsTable').style.display) + ";";
  }
  
  function createhistory(v){
	  sahiSendToServer("/_s_/dyn/pro/EditorUI_createEditorHistory?value="+v);
  }
  
  function createNodesHistory(v){
	  sahiSendToServer("/_s_/dyn/pro/EditorUI_createNodesHistory?value="+v);
  }
  
  function getEditor_history(){
	  if(!getE_history){
		  getE_history = sahiSendToServer("/_s_/dyn/pro/EditorUI_getEditorHistory");
	  }
	  return getE_history;
  }
  
  function getN_info(){
	  if(!getNodes_info){
		  getNodes_info = sahiSendToServer("/_s_/dyn/pro/EditorUI_getNodesInfo");
	  }
	  return getNodes_info;
  }
  function getN_infoOnBrowser(){
	  return jQuery('#usenodes').val();
  }
  
  function getDMaster_info(){
	  if(!getDiffMaster_info){
		  getDiffMaster_info = sahiSendToServer("/_s_/dyn/pro/EditorUI_getDiffMasterInfo");
	  }
	  return getDiffMaster_info;
  }

  function getR_info(){
	  if(!getReports_info){
		  getReports_info = eval("(" + sahiSendToServer("/_s_/dyn/pro/EditorUI_getAllReportsTypes") + ")");
	  }
	  return getReports_info;
  }
  
  function createCookieForOpenTabs(){
	  var selectedTab = jQuery('#tt2').tabs('getSelected');
	  if(selectedTab){
		  var selectedTabTitle = selectedTab.panel('options').title;
	  }
	  var totalTabs = jQuery('#tt2').tabs('tabs').length;
	  var tabAr = "[";
	  for(var i=0; i<totalTabs; i++){
		  var p = jQuery('#tt2').tabs('getTab', i);
		  var tt = p.panel('options').title;
		  if(($(tt).className).indexOf("_superframe@temp@") == 0){
			  continue; 
		  }
		  var tn = $(tt).name;
		  var tc = $(tt).className;
		  var tv = $(tt).value;
		  var isSelected = false;
		  if(tt == selectedTabTitle) isSelected = true;
		  var tab = '{"tabTitle":"' + tt + '", "root":"' + tn + '", "frameId":"' + tc + '", "webTitle":"' + tv + '", "selected":' + isSelected + '}';
		  tabAr += tab;
		  if(i != totalTabs - 1) tabAr += ",";
	  }
	  tabAr += "]";
	  e_history += "openTabs=" + encodeURIComponent(tabAr) + ";";
  }
  
  function readHistory(name){
		var nameEQ = name + "=";
		var ca = getEditor_history().split(';');
		for(var i=0;i < ca.length;i++)
		{
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
  function findInObjectArray(ar, el) {
	  var len = ar.length;
	  for (var i = 0; i < len; i++) {
		  if (ar[i].text == sahiTrim(el)) return i;
	  }
	  return -1;
  };
  
  var browserData = loadBrowsers();
  function loadBrowsers(nodes) {
	  var dataAr =  [];
	  var browserList = [];
	  if(!nodes || nodes == ""){
		  dataAr =  eval("(" + sahiSendToServer("/_s_/dyn/pro/EditorUI_getBrowserList")
				  + ")");
		  browserList = dataAr;
		  var data = [];
		  for (var i=0; i<browserList.length; i++){
			  if(findInObjectArray(data,browserList[i]) == -1 && browserList[i] != 'undefined' && browserList[i] != ""){
				  var b = {};
				  b.id = browserList[i];
				  b.text = browserList[i];
				  data.push(b);
			  }
		  }
		  return data;
	  }else{
		  var selectedNodes = nodes.split(",");
		  var totalNodes = selectedNodes.length;
		  for (var i=0; i<totalNodes; i++){
			  if(selectedNodes[i] != ""){
				  jQuery.ajax({
					  url: "http://" + selectedNodes[i] + "/_s_/dyn/pro/EditorUI_getBrowserList",
					  context:document.body
				  }).done(function(value){
					  dataAr += (eval(value)) + ",";
					  browserList = dataAr.split(",");
					  var data = [];
					  for (var j=0; j<browserList.length; j++){
						  if(findInObjectArray(data,browserList[j]) == -1 && browserList[j] != 'undefined' && browserList[j] != ""){
							  var b = {};
							  b.id = browserList[j];
							  b.text = browserList[j];
							  data.push(b);
						  }
					  }
					  jQuery('#browserTxt').combobox('loadData',data);
					  removeSetBroswerFromComboIfNotExists();
				  });
			  }
		  }
	  }
  }
  
  function removeSetBroswerFromComboIfNotExists(){
	 var setBrowsers = jQuery('#browserTxt').combobox('getValues');
	 var resetSelectedBrowsersList = [];
	 for(var i=0; i<setBrowsers.length; i++){
		 var browser = setBrowsers[i];
		 if(isBrowserExistsOnBrowserList(browser)){
			 resetSelectedBrowsersList.push(browser);
		 }
	 }
	 jQuery('#browserTxt').combobox('setValues', resetSelectedBrowsersList);
  }
  
  function isBrowserExistsOnBrowserList(browser){
	  var browserlist = jQuery('#browserTxt').combobox('getData');
	  for (var key in browserlist) {
		  if (browserlist.hasOwnProperty(key)) {
		    var browserInList = browserlist[key].id;
		    if(browserInList == browser) return true;
		  }
	  }
	  return false;
  }
  
  function getPlaybackMode() {
	  return jQuery('input[name=playbackMode]:checked').val()
  }
  
  function setPlaybackMode(mode) {
	  jQuery('input[name=playbackMode][value="' + mode + '"]').prop('checked',true);
	  onPlaybackModeChange();
  }
  
  function onPlaybackModeChange(){
	  var mode = getPlaybackMode();
	  if (mode == "singlesession") {
		  toggleDistributeOptionsDisplay(false);
		  toggleThreadsDisplay(false);
		  jQuery('#browserTxt').combobox('loadData',loadBrowsers());
	  } else if (mode == "parallel") {
		  toggleDistributeOptionsDisplay(false);
		  toggleThreadsDisplay(true);
		  jQuery('#browserTxt').combobox('loadData',loadBrowsers());
	  } else if (mode == "distributed") {
		  toggleThreadsDisplay(false);
		  toggleDistributeOptionsDisplay(true);
		  loadBrowsers(getN_infoOnBrowser());
	  }
  }
  
  function toggleThreadsDisplay(show) {
	  if (show) {
		  jQuery('#threadsSpan').show();
		  jQuery('#threads').numberspinner();
	  } else {
		  jQuery('#threadsSpan').hide();
	  }
  }
  
  function toggleDistributeOptionsDisplay(show) {
	  if (show) {
		  jQuery('#playbackDistribute').show();
		  $('diffMasterDiv').style.display = 'table-row';
	  } else {
		  jQuery('#playbackDistribute').hide();
		  $('diffMasterDiv').style.display = 'none';
	  }
  }
  
  function onUseDiffMasterChanged(checkbox) {
	  if (checkbox.checked){
		  $('diffMasterTxtDiv').style.display = 'inline-block';
	  } else {
		  $('diffMasterTxtDiv').style.display = 'none';
	  }
  }

  var _historyURLs = null;
  function getURLs() {
	if (!_historyURLs) {
		_historyURLs  = loadURLs2();
	}
	return _historyURLs;
  }
  function loadURLs2() {
	return eval("(" + sahiSendToServer("/_s_/dyn/ControllerUI_getURLHistory") + ")");
  }
  var urlData = loadURLs();
  	function loadURLs() {
		var dataAr = eval("(" + sahiSendToServer("/_s_/dyn/ControllerUI_getURLHistory")
				+ ")");
		var data = [];
		for (var i=0; i<dataAr.length; i++){
			var b = {};
			b.id = i+1;
			b.text = dataAr[i];
			data.push(b);
		}
		return data;
	}
	function shouldAdd(url) {
		if (url == "" || url.value == "http://")
				return false;
			for (var i = 0; i < getURLs().length; i++) {
				if (url == _historyURLs[i])
					return false;
			}
		return true;
	}
	function saveURL(url) {
		if (shouldAdd(url)){
			_historyURLs.push(url);
			sahiSendToServer("/_s_/dyn/ControllerUI_addURLHistory?url=" + encodeURIComponent(url));
		}
	}
	
	function onWestPanelCollapse() {
	  viewSetting();
      var title = "Navigator";
      var p = jQuery('#container').layout('panel','expandWest');
      p.html('<div style="font-weight:bold;height:40px;color:#575765;-moz-transform: rotate(270deg);padding:45px 22px;-ms-transform: rotate(270deg);-webkit-transform: rotate(270deg)">'+title+'</div>');
	}
	
	function editNodesParam(){
		if(adjustNodesDeltaX != 0){
			jQuery('#nodesEditor').tooltip('options').deltaX = 0;
			adjustNodesDeltaX = 0;
		}
		var extraNodesRow = [];
		if($("extraNodes").value!=""){
			var value = $("extraNodes").value;
			var extraNodesRow = value.split(",");
			for (var i=0; i<extraNodesRow.length; i++){
				extraNodesRow[i] =  extraNodesRow[i].split(":");
				extraNodesRow[i][0] = extraNodesRow[i][0];
				extraNodesRow[i][1] = extraNodesRow[i][1];
			}
		}
		var nodesEditor = $("nodesedittbody");
		var oldExtNodesRow = nodesEditor.getElementsByTagName("tr");
		var allOldExtNodesRow = [];
		for (var c=0;c<oldExtNodesRow.length;c++){
			if(oldExtNodesRow[c].id!="nodes_header"){
				allOldExtNodesRow.push(oldExtNodesRow[c]);
			}
		}
		var totalOldExtNodesRow = [];
		for (var b=0; b<allOldExtNodesRow.length;b++){
			totalOldExtNodesRow.push(allOldExtNodesRow[b]);
		}
		for (var a=0;a<totalOldExtNodesRow.length;a++){
			nodesEditor.removeChild(totalOldExtNodesRow[a]);
		}
		var nodesEditorDiv = $("nodesedit");
		if($("nodesplus")){
			nodesEditorDiv.removeChild($("nodesplus"));			
		}
		if($("nodesupdate")){
			nodesEditorDiv.removeChild($("nodesupdate"));			
		}
		if($("nodescancel")){
			nodesEditorDiv.removeChild($("nodescancel"));			
		}
		for (var i=0; i<extraNodesRow.length; i++){
			addNodesRowWithElements(i);
			var extNodesRow = nodesEditor.getElementsByTagName("tr");
			var editorNodesRow = [];
			for (var j=0;j<extNodesRow.length;j++){
				if(extNodesRow[j].id!="nodes_header"){
					editorNodesRow.push(extNodesRow[j]);
				}
			}
			var allRowInput = editorNodesRow[i].getElementsByTagName("input");
			for (var k=0;k<allRowInput.length;k++){
				if(allRowInput[k].className=="nodes_n_field"){
					var nameField = allRowInput[k];
				}
				if(allRowInput[k].className=="nodes_v_field"){
					var valueField = allRowInput[k];
				}
				if(allRowInput[k].className=="use_field"){
					var useField = allRowInput[k];
				}
			}
			if(sahiTrim(extraNodesRow[i][0]) == ""){
				// do nothing	
			}
			else if(extraNodesRow[i][0].indexOf("//")!=0){
				nameField.value = extraNodesRow[i][0];
				useField.checked=true;
			}
			else{
				nameField.value = extraNodesRow[i][0].substring(extraNodesRow[i][0].indexOf("//")+2);
				useField.checked=false;
			}
			if(extraNodesRow[i][1]){
				valueField.value = extraNodesRow[i][1];
			}
		}
		if(extraNodesRow.length<5){
			for(var i=extraNodesRow.length;i<5;i++){
				addNodesRowWithElements(i);
			}
		}
		var totalextNodesRow = nodesEditor.getElementsByTagName("tr").length-1;
		var plus = document.createElement("input");
		plus.type = "button";
		plus.value = "+";
		plus.id = "nodesplus";
		nodesEditorDiv.appendChild(plus);
		plus.onclick = returnNodesRowWithElements(totalextNodesRow);
		var update = document.createElement("input");
		update.type = "button";
		update.value = "Update";
		update.id = "nodesupdate";
		nodesEditorDiv.appendChild(update);
		update.onclick = returnExtNodesUpdate();
		var cancel = document.createElement("input");
		cancel.type = "button";
		cancel.value = "Close";
		cancel.id = "nodescancel";
		nodesEditorDiv.appendChild(cancel);
		cancel.onclick = returnNodesdisplayDivNone();
	}
	
	function addNodesRowWithElements(rowNum) {
		var nodesEditor = $("nodesedittbody");
		var row = document.createElement("tr");
		row.id = "extnodes"+rowNum;
		nodesEditor.appendChild(row);
		var column1 = document.createElement("td");
		var column2 = document.createElement("td");
		var column3 = document.createElement("td");
		row.appendChild(column1);
		row.appendChild(column2);
		row.appendChild(column3);
		var nameField = document.createElement("input");
		nameField.type = "text";
		nameField.className = "nodes_n_field";
		var valueField = document.createElement("input");
		valueField.type = "text";
		valueField.className = "nodes_v_field";
		var maskField = document.createElement("input");
		maskField.type = "checkbox";
		maskField.className = "use_field";
		column1.appendChild(nameField);
		column2.appendChild(valueField);
		column3.appendChild(maskField);
	}
	function returnNodesRowWithElements(rowNum) {
		return function(){
			addNodesRowWithElements(rowNum);
			preventDelete();
		}
	}
	function returnNodesdisplayDivNone() {
		return function(){
			nodesEditorDisplayNone();
		}
	}
	
	function nodesEditorDisplayNone(){
		var t = jQuery('#nodesEditor')
		 t.tooltip('hide');
	}
	function returnExtNodesUpdate() {
		return function(){
			var extraNodesValue = $("extraNodes");
			extraNodesValue.value = "";
			var nodesEditor = $("nodesedittbody");
			var extNodesRow = nodesEditor.getElementsByTagName("tr");
			var editorNodesRow = [];
			for (var i=0;i<extNodesRow.length;i++){
				if(extNodesRow[i].id!="nodes_header"){
					editorNodesRow.push(extNodesRow[i]);
				}
			}
			for(var j=0; j<editorNodesRow.length;j++){
				var editorNodesRowElement = editorNodesRow[j].getElementsByTagName("input");
				if((editorNodesRowElement[0].value=="" && editorNodesRowElement[1].value=="")){
					//do nothing
				}
				else{
					var key = editorNodesRowElement[0].value;
					var value = editorNodesRowElement[1].value;
					var addUse = editorNodesRowElement[2].checked;
					extraNodesValue.value += (!addUse?"//":"") + key + ":" + value + ",";
				}	
			}
			setReadOnlyNodesInfo();
			if (isDrun()){
				var nodes = getN_infoOnBrowser();
				if(nodes == ""){
					setPlaybackMode("parallel");
					jQuery.messager.alert('Warning','Non-distributed Mode');
				}else{
					loadBrowsers(getN_infoOnBrowser());	
				}
			}else{
				jQuery('#browserTxt').combobox('loadData',loadBrowsers());
			}
			nodesEditorDisplayNone();
		}
	}
	
	function editExtraParam() {
		if(adjustDeltaX != 0){
			jQuery('#paramEditor').tooltip('options').deltaX = 0;
			adjustDeltaX = 0;
		}
		var extraParamRow = [];
		if($("extraParams").value!=""){
			var value = $("extraParams").value;
			if (value.charAt(0) != '&') value = '&' + value;
			var extraParamRow = value.split("&");
			extraParamRow.splice(0,1);
			for (var i=0; i<extraParamRow.length; i++){
				extraParamRow[i] =  extraParamRow[i].split("=");
				extraParamRow[i][0] = decodeURIComponent(extraParamRow[i][0]);
				extraParamRow[i][1] = decodeURIComponent(extraParamRow[i][1]);
			}
		}
		var paramEditor = $("paramedittbody");
		var oldExtParamRow = paramEditor.getElementsByTagName("tr");
		var allOldExtParamRow = [];
		for (var c=0;c<oldExtParamRow.length;c++){
			if(oldExtParamRow[c].id!="header"){
				allOldExtParamRow.push(oldExtParamRow[c]);
			}
		}
		var totalOldExtParamRow = [];
		for (var b=0; b<allOldExtParamRow.length;b++){
			totalOldExtParamRow.push(allOldExtParamRow[b]);
		}
		for (var a=0;a<totalOldExtParamRow.length;a++){
			paramEditor.removeChild(totalOldExtParamRow[a]);
		}
		var paramEditorDiv = $("paramedit");
		if($("plus")){
			paramEditorDiv.removeChild($("plus"));			
		}
		if($("update")){
			paramEditorDiv.removeChild($("update"));			
		}
		if($("cancel")){
			paramEditorDiv.removeChild($("cancel"));			
		}
		for (var i=0; i<extraParamRow.length; i++){
			addRowWithElements(i);
			var extParamRow = paramEditor.getElementsByTagName("tr");
			var editorParamRow = [];
			for (var j=0;j<extParamRow.length;j++){
				if(extParamRow[j].id!="header"){
					editorParamRow.push(extParamRow[j]);
				}
			}
			var allRowInput = editorParamRow[i].getElementsByTagName("input");
			for (var k=0;k<allRowInput.length;k++){
				if(allRowInput[k].className=="n_field"){
					var nameField = allRowInput[k];
				}
				if(allRowInput[k].className=="v_field"){
					var valueField = allRowInput[k];
				}
				if(allRowInput[k].className=="mask_field"){
					var maskField = allRowInput[k];
				}
			}
			if(extraParamRow[i][0].indexOf("mask_")!=0){
				nameField.value = extraParamRow[i][0];
				maskField.checked=false;
			}
			else{
				nameField.value = extraParamRow[i][0].substring(extraParamRow[i][0].indexOf("mask_")+5);
				maskField.checked=true;
			}
			if(extraParamRow[i][1]){
				valueField.value = extraParamRow[i][1];
			}
		}
		if(extraParamRow.length<5){
			for(var i=extraParamRow.length;i<5;i++){
				addRowWithElements(i);
			}
		}
		var totalextParamRow = paramEditor.getElementsByTagName("tr").length-1;
		var plus = document.createElement("input");
		plus.type = "button";
		plus.value = "+";
		plus.id = "plus";
		paramEditorDiv.appendChild(plus);
		plus.onclick = returnRowWithElements(totalextParamRow);
		var update = document.createElement("input");
		update.type = "button";
		update.value = "Update";
		update.id = "update";
		paramEditorDiv.appendChild(update);
		update.onclick = returnExtParamUpdate();
		var cancel = document.createElement("input");
		cancel.type = "button";
		cancel.value = "Close";
		cancel.id = "cancel";
		paramEditorDiv.appendChild(cancel);
		cancel.onclick = returndisplayDivNone();
	}
	function addRowWithElements(rowNum) {
		var paramEditor = $("paramedittbody");
		var row = document.createElement("tr");
		row.id = "extparam"+rowNum;
		paramEditor.appendChild(row);
		var column1 = document.createElement("td");
		var column2 = document.createElement("td");
		var column3 = document.createElement("td");
		row.appendChild(column1);
		row.appendChild(column2);
		row.appendChild(column3);
		var nameField = document.createElement("input");
		nameField.type = "text";
		nameField.className = "n_field";
		var valueField = document.createElement("input");
		valueField.type = "text";
		valueField.className = "v_field";
		var maskField = document.createElement("input");
		maskField.type = "checkbox";
		maskField.className = "mask_field";
		column1.appendChild(nameField);
		column2.appendChild(valueField);
		column3.appendChild(maskField);
	}
	function returnRowWithElements(rowNum) {
		return function(){
			addRowWithElements(rowNum);
			preventDelete();
		}
	}
	function returndisplayDivNone() {
		return function(){
			paramEditorDisplayNone();
		}
	}
	
	function paramEditorDisplayNone(){
		var t = jQuery('#paramEditor')
		 t.tooltip('hide');
	}
	function returnExtParamUpdate() {
		return function(){
			var extraParamValue = $("extraParams");
			extraParamValue.value = "";
			var paramEditor = $("paramedittbody");
			var extParamRow = paramEditor.getElementsByTagName("tr");
			var editorParamRow = [];
			for (var i=0;i<extParamRow.length;i++){
				if(extParamRow[i].id!="header"){
					editorParamRow.push(extParamRow[i]);
				}
			}
			for(var j=0; j<editorParamRow.length;j++){
				var editorParamRowElement = editorParamRow[j].getElementsByTagName("input");
				if((editorParamRowElement[0].value=="" && editorParamRowElement[1].value=="" && editorParamRowElement[2].checked==false)){
					//do nothing
				}
				else{
					var key = editorParamRowElement[0].value;
					var value = editorParamRowElement[1].value;
					var addMask = editorParamRowElement[2].checked;
					extraParamValue.value += "&" + encodeURIComponent((addMask?"mask_":"") + key) + "=" + encodeURIComponent(value);
				}	
			}
			paramEditorDisplayNone();
		}
	}

	function editReportsInfo() {
		if(adjustReportsDeltaX != 0){
			jQuery('#reportsEditor').tooltip('options').deltaX = 0;
			adjustReportsDeltaX = 0;
		}
		var allReportTypes = getR_info();
		var reportsInfoRows = [];
		var reportInfoArr = [];
		if($("reportsInfo").value!=""){
			var value = $("reportsInfo").value;
			reportsInfoRows = value.split(",");
			for (var i=0; i<reportsInfoRows.length; i++){
				var index = reportsInfoRows[i].indexOf(":");
				var reportInfo = [];
				if (index == -1) { // Reports location not specified.
					reportInfo[0] = reportsInfoRows[i];
					reportInfo[1] = "";
				} else {
					reportInfo[0] = reportsInfoRows[i].substring(0, index);
					reportInfo[1] = reportsInfoRows[i].substring(index+1);
				}

				reportInfoArr.push(reportInfo);
			}
		}
		var reportsEditor = $("reportsedittbody");
		var oldReportsRow = reportsEditor.getElementsByTagName("tr");

		var oldReportsRowCopy = [];
		for (var a=0; a<oldReportsRow.length; a++){
			if(oldReportsRow[a].id!="reports_header"){
				oldReportsRowCopy.push(oldReportsRow[a]);
			}
		}
		for (var b=0;b<oldReportsRowCopy.length;b++){
			reportsEditor.removeChild(oldReportsRowCopy[b]);
		}
		var reportsEditorDiv = $("reportsedit");
		if($("reportsupdate")){
			reportsEditorDiv.removeChild($("reportsupdate"));			
		}
		if($("reportscancel")){
			reportsEditorDiv.removeChild($("reportscancel"));			
		}
		for (var i=0; i<allReportTypes.length; i++) {
			var reportType = allReportTypes[i];
			
			var added = false;
			for (var j=0; j<reportInfoArr.length; j++){
				var usedReportInfo = reportInfoArr[j];
				if (usedReportInfo[0] == reportType) {
					addReportRowWithElements(i, reportType, usedReportInfo[1], true);
					added = true;
					break;
				}
			}
			
			if (!added) {
				addReportRowWithElements(i, reportType, "", false);				
			}
		}

		var update = document.createElement("input");
		update.type = "button";
		update.value = "Update";
		update.id = "reportsupdate";
		reportsEditorDiv.appendChild(update);
		update.onclick = returnReportInfoUpdate();
		var cancel = document.createElement("input");
		cancel.type = "button";
		cancel.value = "Close";
		cancel.id = "reportscancel";
		reportsEditorDiv.appendChild(cancel);
		cancel.onclick = returnReportInfoDisplayDivNone();
	}
	
	function addReportRowWithElements(rowNum, reportType, location, use) {
		var paramEditor = $("reportsedittbody");
		var row = document.createElement("tr");
		row.id = "report"+rowNum;
		paramEditor.appendChild(row);
		var column1 = document.createElement("td");
		var column2 = document.createElement("td");
		var column3 = document.createElement("td");
		row.appendChild(column1);
		row.appendChild(column2);
		row.appendChild(column3);
		var typeField = document.createElement("input");
		typeField.type = "text";
		typeField.value = reportType;
		typeField.className = "report_type_field";
		typeField.readOnly = true;
		var locationField = document.createElement("input");
		locationField.type = "text";
		locationField.value = location;
		locationField.className = "report_location_field";
		var useField = document.createElement("input");
		useField.type = "checkbox";
		useField.checked = use;
		useField.className = "report_use_field";
		column1.appendChild(typeField);
		column2.appendChild(locationField);
		column3.appendChild(useField);
	}

	function returnReportInfoDisplayDivNone() {
		return function(){
			reportEditorDisplayNone();
		}
	}
	
	function reportEditorDisplayNone(){
		var t = jQuery('#reportsEditor')
		 t.tooltip('hide');
	}

	function returnReportInfoUpdate() {
		return function(){
			var reportInfoValue = $("reportsInfo");
			reportInfoValue.value = "";
			var paramEditor = $("reportsedittbody");
			var reportInfoRows = paramEditor.getElementsByTagName("tr");
			for (var i=0;i<reportInfoRows.length;i++){
				if (reportInfoRows[i].id!="reports_header"){
					var reportInfoRowElements = reportInfoRows[i].getElementsByTagName("input");
					if (reportInfoRowElements[2].checked==true){
						var type = reportInfoRowElements[0].value;
						var location = reportInfoRowElements[1].value;

						var reportInfo = (location && location != "" ? type + ":" + location : type); 
						reportInfoValue.value += reportInfo + ",";
					}	
				}
			}
			
			reportInfoValue.value = reportInfoValue.value.slice(0,-1);

			reportEditorDisplayNone();
		}
	}
	
	
	function saveSelected(){
		var tab = jQuery('#tt2').tabs('getSelected');
		var selectedTabTitle = tab.panel('options').title;
		var hiddenInput = $(selectedTabTitle);
		var iframeId = hiddenInput.className;
		if(iframeId.indexOf("_superframe@temp@") == 0){
			openSaveAsModal();
		}
		else{
			saveTab(tab);
		}
	}
	
	function saveAll(){
		var allTab = jQuery('#tt2').tabs('tabs');
		var showUnSavedAlert = false;
		for(var i=0; i<allTab.length; i++){
			var tab = allTab[i];
			var tabTitle = tab.panel('options').title;
			var hiddenInput = $(tabTitle);
			var iframeId = hiddenInput.className;
			if(iframeId.indexOf("_superframe@temp@") == 0){
				showUnSavedAlert = true;
				continue;
			}
			else{
				saveTab(tab);
			}
		}
		removeModifiedSymbolOnAllTabHeader();
		if(showUnSavedAlert){
			alert("Some of the temporary open tabs are not saved.\nYou may save these tabs by using 'Save As' menu.");
		}
	}
	
	function saveTab(tab){
		var selectedTabTitle = tab.panel('options').title;
		var hiddenInput = $(selectedTabTitle);
		var iframeId = hiddenInput.className;
		var tag = iframeId.substring(0, iframeId.indexOf("_"));
		if(tag == "") {
			if(hiddenInput.value.match(".s.csv$") == ".s.csv" || hiddenInput.value.match(".xls$") == ".xls" || hiddenInput.value.match(".xlsx$") == ".xlsx"){
				$(iframeId).contentWindow.saveCSVAtSameLocation();
			}
			else if(hiddenInput.value.match(".dd.csv$") == ".dd.csv"){
				$(iframeId).contentWindow.saveCSVAtSameLocation();
			}
			else{
				$(iframeId).contentWindow.saveScript();
			}   
		}
		else if(tag == "doc"){
			$(iframeId).contentWindow.saveDescriptions();
		}
	}
	
	function $(id){
		return document.getElementById(id);
	}
	
	var loadScriptName = "";
	var loadScriptDir = null;
	function setSelectedText(text, selectedScriptDir) {
		loadScriptName = text;
		if(selectedScriptDir)
			loadScriptDir = selectedScriptDir;
		else
			loadScriptDir = null;
	}
	
	function openLoadModal() {
		jQuery('#load_f_dir').combobox('setValue', loadScriptName);
		if(loadScriptDir){
			jQuery('#load_s_dir').combobox('setValue', loadScriptDir);
			jQuery('#load_f_dir').combobox('loadData',getScripts(loadScriptDir));
		}
		openWindow('loadDialog');
	}
	
	function openSaveAsModal() {
		$('filebox2').value = "";
		openWindow('saveAsDialog');
	}
	
	function maskresize() {
    	var maskHeight = jQuery(document).height();
  		var maskWidth = jQuery(window).width();
  		jQuery('#mainContainer').css({
  			'width' : maskWidth,
  			'height' : maskHeight-28
  		});
  		resizeContainer();
    }
	
	function sahiTrim(s){
	    if (s==null) return s;
	    if ((typeof s) != "string") return s;
	    s = s.replace(/&nbsp;/g, ' ');
	    s = s.replace(/\xA0/g, ' ');
	    s = s.replace(/^[ \t\n\r]*/g, '');
	    s = s.replace(/[ \t\n\r]*$/g, '');
	    s = s.replace(/[\t\n\r]{1,}/g, ' ');
	    return s;
	} 
	
	function saveAsNewTab(){
		g_checkDirty = false;
		var fileDir = jQuery("#saveas_s_dir").combobox('getText');
		var fileName = sahiTrim($("filebox2").value);
		if(fileName == "")	return;
		var tab = jQuery('#tt2').tabs('getSelected');
		var selectedTabTitle = tab.panel('options').title;
		var hiddenInput = $(selectedTabTitle);
		var iframeId = hiddenInput.className;
		if(iframeId.indexOf("_superframe@temp@") == 0){
			closeBaseSaveAsTab = true;
		}
		var tag = iframeId.substring(0, iframeId.indexOf("_"));
		var ok = true;
		var confirmMsg = "File already exists! \n Do you want to replace it?";
		if(tag == "") {
			if(hiddenInput.value.match(".s.csv$") == ".s.csv" || hiddenInput.value.match(".xls$") == ".xls" || hiddenInput.value.match(".xlsx$") == ".xlsx"){
				if(fileName.match(".s.csv$") != ".s.csv" && fileName.match(".xls$") != ".xls" && fileName.match(".xlsx$") != ".xlsx"){
					fileName = fileName + ".s.csv";
				}
				if(isFileExists(fileDir + fileName)){
					ok = confirm(confirmMsg);
				}
				if(ok){
					$(iframeId).contentWindow.saveCsv(fileDir, fileName);
				}
			}
			else if(hiddenInput.value.match(".dd.csv$") == ".dd.csv"){
				if(fileName.match(".dd.csv$") != ".dd.csv"){
					fileName = fileName + ".dd.csv";
				}
				if(isFileExists(fileDir + fileName)){
					ok = confirm(confirmMsg);
				}
				if(ok){
					$(iframeId).contentWindow.saveCsv(fileDir, fileName);
				}
			}
			else{
				if(fileName.indexOf(".") == -1){
					fileName = fileName + ".sah";
				}
				if(isFileExists(fileDir + fileName)){
					ok = confirm(confirmMsg);
				}
				if(ok){
					$(iframeId).contentWindow.saveAsScript(fileDir, fileName);
				}
			}   
		}
		if(ok){
			closeWindow('saveAsDialog');
			window.setTimeout(openNewAndCloseOld(fileDir, fileName, tab), 10);
			close = false;
			reloadNavigator();
			var dir = jQuery("#load_s_dir").combobox('getText');
			jQuery('#load_f_dir').combobox('loadData',getScripts(dir));
		}
	}
	
	function openNewFolderModal() {
		$('filebox3').value = "";
		var parentDir = "";
		var node = jQuery('#tt').tree('getSelected');
		if(!node.scriptDir) parentDir = node.path;
		else{
			parentDir = node.scriptDir + node.path.substring(0, node.path.lastIndexOf("/")+1);
		}
		$('parentDir').value = parentDir;
		openWindow('newDialog');
	}

	function createNewFile2(){
		var fileDir = $('parentDir').value;
		var fileName = sahiTrim($("filebox3").value);
		var node = jQuery('#tt').tree('getSelected');
		if(node && node.scriptDir){
			fileName = fileDir.substring(node.scriptDir.length) + fileName;
			fileDir = fileDir.substring(0, node.scriptDir.length);
		}
		if(fileName == "")	return;
		if(fileName.indexOf(".") == -1){
			fileName = fileName + ".sah";
		}
		if(isFileExists(fileDir + fileName)){
			var msg = "File already exists! \n Provide different name.";
			alert(msg);
			return false;
		}
		closeWindow('newDialog');
		if(fileName.match(".s.csv$") == ".s.csv" || fileName.match(".xls$") == ".xls" || fileName.match(".xlsx$") == ".xlsx"){
			var data = "\"TestCase\",\"Key Word\",\"Argument 1\",\"Argument 2\"\n" + 
			",\"loadSahi\",\"$filePath\"\n" + 
			"\n" + 
			"\"My First Testcase\",\"[Documentation]\",\"My testcase description. Modify as needed\"\n" + 
			",\"myFunction\",\"my argument\",\"my argument 2\"\n";
			url = "/_s_/dyn/pro/TestCaseUI_save?filePath=" + encodeURIComponent(fileDir + fileName) + "&contents=" + encodeURIComponent(data);
			sahiSendToServer(url);
		}
		else if(fileName.match(".dd.csv$") == ".dd.csv"){
			var data = "";
			url = "/_s_/dyn/pro/TestCaseUI_save?filePath=" + encodeURIComponent(fileDir + fileName) + "&contents=" + encodeURIComponent(data);
			sahiSendToServer(url);
		}
		else{
			var data = "";
			var url = "/_s_/dyn/ControllerUI_saveScript?dir="+fixedEncodeURIComponent(fileDir) + "&file="+fixedEncodeURIComponent(fileName) + "&contents="+fixedEncodeURIComponent(data)
			sahiSendToServer(url);
		}
		openNewTab(fileDir, fileName);
		reloadNavigator();
		var dir = jQuery("#load_s_dir").combobox('getText');
		jQuery('#load_f_dir').combobox('loadData',getScripts(dir));
	}
	
	function createDirectory(parentDir, dirName){
		return sahiSendToServer("/_s_/dyn/pro/EditorUI_createDirectory?parent="+parentDir+"&dir="+dirName);
	}
	
	function openNewAndCloseOld(fileDir, fileName, oldTab){
		openNewTabIfExists(fileDir, fileName);
		if(closeBaseSaveAsTab){
			removePanel(oldTab);
			closeBaseSaveAsTab = false;
		}
		g_checkDirty = true;
	}
	
	function openNewTabIfExists(fileDir, fileName){
		if(isFileExists(fileDir + fileName) || attemptToOpenTab > 5){
			openNewTab(fileDir, fileName);
		}
		else{
			attemptToOpenTab = attemptToOpenTab + 1;
			window.setTimeout(openNewTabIfExists(fileDir, fileName), 100);
		}
	}
	
	function isFileExists(filePath){
		var isFileExisting = sahiSendToServer("/_s_/dyn/Driver_isFileExists?filePath=" + encodeURIComponent(filePath));
		if (isFileExisting == "true")
			return true;
		else
			return false;
	}
	
	function addSelectedSuiteNewTab(){
		  var frameId= '_superframe' + "@temp@" + tempTab;
		  var title = "*new " + tempTab + ".suite";
		  var webTitle = 'Editor - ' + title;
		  var root = jQuery('#tt').tree('getRoot').path;
		  selectedCheckboxes();
		  var data = "";
		  for(var i=0; i<checkedNodes.length; i++){
			  data = data + checkedNodes[i].path + "\n";
		  }
		  checkedNodes = [];
		  addNewTab(frameId, "refactor/refactor.htm?data="+encodeURIComponent(data), title);
		  tempTab = tempTab + 1;
		  createWebTitleInput(title, webTitle, root, frameId);
		  changeWebTitleAndMenuVisibility();
	  }
	
	function addSelectedDDCSVNewTab(){
		  var frameId= '_superframe' + "@temp@" + tempTab;
		  var title = "*new " + tempTab + ".dd.csv";
		  var webTitle = 'Editor - ' + title;
		  var root = jQuery('#tt').tree('getRoot').path;
		  selectedCheckboxes();
		  var data = "#script,url,tags\n";
		  for(var i=0; i<checkedNodes.length; i++){
			  data = data + checkedNodes[i].path + "\n";
		  }
		  checkedNodes = [];
		  addNewTab(frameId, "spreadsheet/ddcsv_spreadsheet.html?data="+encodeURIComponent(data), title);
		  tempTab = tempTab + 1;
		  createWebTitleInput(title, webTitle, root, frameId);
		  changeWebTitleAndMenuVisibility();
	  }
	
	function createNewFile(nTag){
		 var frameId= '_superframe' + "@temp@" + tempTab;
		  var title = "*new " + tempTab;
		  var webTitle = 'Editor - ' + title;
		  var root = jQuery('#tt').tree('getRoot').path;
		  if(!nTag){
			  var url = "refactor/refactor.htm";
		  }
		  else if(nTag == "scsv"){
			  var url = "spreadsheet/spreadsheet.html";
			  title = title + ".s.csv";
			  webTitle = webTitle + ".s.csv";
		  }
		  else{
			  var url = "spreadsheet/ddcsv_spreadsheet.html";
			  title = title + ".dd.csv";
			  webTitle = webTitle + ".dd.csv";
		  }
		  addNewTab(frameId, url, title);
		  tempTab = tempTab + 1;
		  createWebTitleInput(title, webTitle, root, frameId);
		  changeWebTitleAndMenuVisibility();
	}
	
	function preventDelete(){
		jQuery('input, textarea, select').focus(function() {
			selectedInput = this;
		}).blur(function(){
			selectedInput = null;
		});
	}
	
	function playbackWindow(){
		if(jQuery('#w4').window('options').closed){
			openPlaybackWindow();
		}
		else{
			closeWindow('w4');
		}
	}
	
	function openPlaybackWindow(){
		var suite = getSuiteToRun();
		var scriptDir = suite.scriptDir;
		var scriptName = suite.scriptName;
		if(!scriptDir || !scriptName){
			alert("Please select or open script/suite.");
			return;
		}
		$('s_dir_w4').value = scriptDir;
		$('s_file_w4').value = scriptName;
		
		openWindow('w4');
		
		readjustPlaybackFields();
		if (endsWith(scriptName, ".dd.csv")) {
			$('tagsTable').style.display = 'table-row';
		} else {
			jQuery('#tagsTextId').textbox('setValue', "");	
			$('tagsTable').style.display = 'none';
		}
	}
	
	function readjustPlaybackFields() {
		onPlaybackModeChange();
		onUseDiffMasterChanged($("usedifferentmaster"));
		removeSetBroswerFromComboIfNotExists();
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function showSendEmailProperties(b){
		if(b){
			jQuery('#sendEmailOptions').show();
			jQuery('#sendEmailFile').show();
		}
		else{
			jQuery('#sendEmailOptions').hide();
			jQuery('#sendEmailFile').hide();
		}
	}
	
	function advancedSettings(){
		if($('advancedSettingsTable').style.display == 'none'){
			$('advancedSettingsTable').style.display = 'inline';
			jQuery('#threads').numberspinner();
			$('advancedSettings').innerHTML = 'Hide advanced settings';
		}
		else{
			$('advancedSettingsTable').style.display = 'none';
			$('advancedSettings').innerHTML = 'Show advanced settings';
		}
	}
	
	function StopAll(){
		var b = confirm("All currently running scripts and suites will be stopped.\nDo you want to continue?");
		if(!b) return;
		
		// Kill all local suite runs
		var url = "/_s_/dyn/Suite_killAll";
		sahiSendToServer(url);
		
		// Kill all distributed suite runs running on the Master.
		var url = "/_s_/dyn/in.co.sahi.command.Master_killAll";
		sahiSendToServer(url);
		
	}
	
	function getTabHeader(scriptDir, scriptName){
		if(scriptDir && scriptName){
			var allTabHeader = jQuery(".tabs-inner");
			for(var i=0; i<allTabHeader.length; i++){
				var header = allTabHeader[i];
				if(header.innerHTML.indexOf('<strong>' + scriptDir + scriptName + '</strong>') != -1){
					return jQuery(header);
				}
			}
		}
		return null;
	}
	
	function removeModifiedSymbolOnAllTabHeader(){
		try {
			jQuery('.tabs-modified-file').removeClass('tabs-modified-file');
		}
		catch(err){
			
		}
	}
	
	function addModifiedSymbolOnTabHeader(scriptDir, scriptName){
		if (__queuedOnchangeTimer) window.clearTimeout(__queuedOnchangeTimer);
		__queuedOnchangeTimer = window.setTimeout('afterQueuedAddModifiedSymbolOnTabHeader('+ '"' + scriptDir + '"' + ',' + '"' + scriptName + '"' +')', 200);
	}
	
	function afterQueuedAddModifiedSymbolOnTabHeader(scriptDir, scriptName){
		try {
			var header = getTabHeader(scriptDir, scriptName);
			if(header)
				header.addClass('tabs-modified-file');
		}
		catch(err){
			
		}
	}
	
	function removeModifiedSymbolOnTabHeader(scriptDir, scriptName){
		try {
			var header = getTabHeader(scriptDir, scriptName);
			if(header)
				header.removeClass('tabs-modified-file');
		}
		catch(err){
			
		}
	}
	
