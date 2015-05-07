_scriptName = null;
_filePath = null;

function isIE () {return navigator.appName == "Microsoft Internet Explorer" || (navigator.appVersion && navigator.appVersion.indexOf("Trident") != -1);}
function isIE8 (){return navigator.appVersion.match(/MSIE 8/) !== null;}
function getSelectedText(id, defaultToFull){
	try{
		if (isIE()) return getSel();
		var textarea = $(id);
		var len = textarea.value.length;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		var sel = textarea.value.substring(start, end);
		if (!sel && defaultToFull) sel = $(id).value;
		return sel;
	}catch(e){return "";}
}

function inIframe(){
	try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function addDocTabOnParent() {
	if (inIframe()) {
		var url = "/_s_/spr/editor/docview/docviewer.htm?dir="
				+ encodeURIComponent(_scriptDir) + "&file="
				+ encodeURIComponent(_scriptName);
		parent.openDocTabFromIframe(url, _scriptDir, _scriptName);
	} else {
		loadDocs();
	}
}

function openAndCenterWindow(id) {
	jQuery('#'+id).window('open');
	jQuery('#'+id).window('center');
	
}

function openRefactor(){
	openAndCenterWindow("create_function");
	refactor();
}
function closeRefactor(){	 
	jQuery('#create_function').window('close'); 
}

function maskresize() {
	var maskHeight = jQuery(document).height();
		var maskWidth = jQuery(window).width();
		jQuery('#mask').css({
			'width' : maskWidth,
			'height' : maskHeight
		});
  }

function closeModal(id) {
	$(id).style.display = 'none';
	jQuery('#mask').fadeOut(1000);
}

function masking() {
	var maskHeight = jQuery(document).height();
	var maskWidth = jQuery(window).width();
	jQuery('#mask').css({
		'width' : maskWidth,
		'height' : maskHeight
	});
	jQuery('#mask').fadeTo("fast", 0.2);
}

function getSel() {
	var txt = '';
	if (window.getSelection) {
		txt = window.getSelection();
	} else if (window.document.getSelection) {
		txt = window.document.getSelection();
	} else if (window.document.selection) {
		txt = window.document.selection.createRange().text;
	}
	return "" + txt;
}
function $(id){
	return document.getElementById(id);
}
function toggleAllParams(el){
	for (var i=0; i<g_params.length; i++){
		$("param_"+i).checked = el.checked;
		g_params[i]["enabled"] = el.checked;
	}
}
function toggleAllObjects(el){
	for (var i=0; i<g_objects.length; i++){
		$("object_"+i).checked = el.checked;
		g_objects[i]["enabled"] = el.checked;
	}
}
function toggle_param(id){
	g_params[id]["enabled"] = !g_params[id]["enabled"];
}
function toggle_object(id){
	g_objects[id]["enabled"] = !g_objects[id]["enabled"];
}
function getRefactoredContent(){
	var htmlObjects = "";
	for (var i=0; i<g_objects.length; i++){
		var obj = g_objects[i];
		if (!obj["enabled"]) continue;
		htmlObjects += obj["replacement"] + " = " + obj["original"] + ";\n"
	}
	
	var parameters = "";
	var fnName = jQuery("#fnNameBox").combobox('getText');
	if (fnName == "") fnName = "fnXXX";
	var justStarted = true;
	for (var i=0; i<g_params.length; i++){
		if (!g_params[i]["enabled"]) continue;
		if (justStarted) justStarted = false;
		else parameters += ", ";
		parameters += g_params[i]["replacement"];
	}
	var s = "function " + fnName + "(" + parameters + "){\n";
	var content = g_currentSelection;
	for (var i=0; i<g_params.length; i++){
		if (!g_params[i]["enabled"]) continue;
		var o = g_params[i]["original"];
		var r = g_params[i]["replacement"];
		if (o == r) continue;
		while (content.indexOf(o) != -1)
			content = content.replace(o, r);
	}
	for (var i=0; i<g_objects.length; i++){
		if (!g_objects[i]["enabled"]) continue;
		var o = g_objects[i]["original"];
		var r = g_objects[i]["replacement"];
		if (o == r) continue;
		while (content.indexOf(o) != -1)
			content = content.replace(o, r);
	}
	s += "\t" + content.replace(/\n/g, '\n\t');
	s += "\n}\n";

	var argToPass = "";
	var justStarted = true;
	for (var i=0; i<g_params.length; i++){
		if (!g_params[i]["enabled"]) continue;
		if (justStarted) justStarted = false;
		else argToPass += ", ";
		argToPass += g_params[i]["original"];
	}
	
	var fnDef = s;
	var fnCall = fnName + "(" + argToPass + ");\n";
	
	var token = "/* --Functions Above-- */";
	var initialContent = getEditorValue2();
	var refactored = initialContent.replace(g_currentSelection, fnCall);
	if (initialContent.indexOf(token) != -1){
		refactored = refactored.replace(token, s + "\n" + token);
	} else {
		refactored = fnDef + "\n" + token + "\n\n" + refactored;
	}
	
	var token = "/* --Objects Definitions Above-- */";
	var initialContent = refactored;
	if (initialContent.indexOf(token) != -1){
		refactored = refactored.replace(token, htmlObjects + "\n" + token);
	} else {
		refactored = htmlObjects + "\n" + token + "\n\n" + refactored;
	}
	
	return refactored;
}
function showPreview(){
	$("preview").value = getRefactoredContent();
}
function replaceContent(){
	var r = getRefactoredContent();
	setInputTextarea(r, false);
}
function setInputTextarea(val, clearHistory){
	if(isIE()) val = val.replace(/(\t\n|\t\r\n)/gm,"\n");
	setEditorValue("input", val, clearHistory);	
	g_history.add(getEditorValue2());
}
function undo(){
	var s = g_history.undo();
	if (s) setEditorValue("input", s);
}
function redo(){
	var s = g_history.redo();
	if (s) setEditorValue("input", s);
}
function saveOR() {
 	if ($("orFilePath").value == "") {
 		document.getElementById('orError').innerHTML = "<font color=red>Enter Accessor Repository File Path.</font>";
 		$('orError').style.display = "block";
 		$("orFilePath").focus();
 		window.setTimeout('$("orError").style.display = "none"',3000);
 		return false;
 	} 
 	else if ($('orKey').value == "" || $('orKey').value.indexOf("$") != 0) {
 		document.getElementById('orError').innerHTML = "<font color=red>Enter Accessor Repository Key starting with '$'.</font>";
 		$('orError').style.display = "block";
 		$('orKey').focus();
 		window.setTimeout('$("orError").style.display = "none"',3000);
 		return false;
 	}
 	else if ($('orValue').value == "") {
 		document.getElementById('orError').innerHTML = "<font color=red>Enter Accessor Repository Value.</font>";
 		$('orError').style.display = "block";
 		$('orValue').focus();
 		window.setTimeout('$("orError").style.display = "none"',3000);
 		return false;
 	}
 	var filePath = $("orFilePath").value;
	var fileExist = sahiSendToServer("/_s_/dyn/Driver_isFileExists?filePath="+ filePath);
	var oldValue = "OR key-value pair is not in the file.";
	if (fileExist == "true") {
		var orKey = $('orKey').value;
		oldValue = sahiSendToServer("/_s_/dyn/Recorder_getORValue?filepath="+filePath+"&orkey="+orKey).toString();
		if (oldValue != "OR key-value pair is not in the file.") {
			var res = confirm("Key already exists.\nDo you want to update its value?");
		 	if (!res) return false;
		}
		var newValue = $('orKey').value + " = " + $('orValue').value;
		sahiSendToServer("/_s_/dyn/Recorder_changeOREntry?filepath="+filePath+"&oldvalue="+oldValue+"&newvalue="+newValue);
	} else {
		document.getElementById('orError').innerHTML = "<font color=red>Accessor Repository File does not exist.</font>";
 		$('orError').style.display = "block";
 		$("orFilePath").focus();
 		window.setTimeout('$("orError").style.display = "none"',3000);
	}
}

var g_queuedShowContextTimer = null;
function queuedShowContext() {
	if (g_queuedShowContextTimer) window.clearTimeout(g_queuedShowContextTimer);
	g_queuedShowContextTimer = window.setTimeout(showContext, 100);
}

function showContext() {
	populateOpenFileModal();
	populateContextModal();	
}

function populateContextModal() {
	populateORParameters();
	populateFunctionParameters();
}

function populateORParameters() {
	try {
		var orKey = getEditorSelectionValue2().replace(/^\s*|\s*$/g, '');
		if (orKey.indexOf("$") != 0) orKey = "$" + orKey;
		for (var i=1; i<_includedFiles.length; i++) {
			var orValue = sahiSendToServer("/_s_/dyn/Recorder_getORValue?filepath=" + _includedFiles[i] + "&orkey=" + orKey);
			if (orValue.indexOf("=") != -1) {
				$("orFilePath").value = _includedFiles[i];
				$("orKey").value = orKey;
				$("orValue").value = orValue.split("=")[1].replace(/^\s*|\s*$/g, '');
				break;
			}
		}
	} catch (e) {}
}

var g_currentLineNumber = 0;
var g_currentLineLength = 0;
function setCurrentLineNumberAndLength() {
	g_currentLineNumber = getCurrentLineNumber("input");
	var currentLineText = getCurrentLineText("input");
	g_currentLineLength = currentLineText.length;
}
function populateFunctionParameters() {
	try {
		var selectedText = getCurrentLineText("input");
		var ix1 = selectedText.indexOf("(");
		var ix2 = selectedText.lastIndexOf(")");
		if(ix1 == -1 || ix2 == -1) return;
		var functionName = selectedText.substring(0,ix1).replace(/^\s*|\s*$/g, ''); // trim
		var paramString = selectedText.substring(ix1+1,ix2).replace(/^\s*|\s*$/g, ''); // trim
		var params = [];
		if (paramString != "") params = paramString.split(",");
		if (functionName != "") {
			for (var i=0; i<_allFunctions.length; i++) {
				if (functionName == _allFunctions[i].label) {
					setCurrentLineNumberAndLength();
					//$("funcBox").value = functionName;
					jQuery('#funcBox').combobox('setValue', functionName);
					var path = _allFunctions[i].desc;
					populateFunctionPath(path);
					if (jQuery.inArray(_allFunctions[i].desc, _includedFiles) == -1) {
						$("funcFilePath").style.color = "red";
					} else {
						$("funcFilePath").style.color = "black";
					}
					refactorInsertFuncArgs(functionName, _allFunctions[i].param);
					for (var j=0; j<_allFunctions[i].param.length; j++) {
						var id = functionName+j;
						if (j < params.length) {
							$(id).value = params[j].replace(/^\s*|\s*$/g, '');
						} else {
							$(id).value = "";
						}
					}
					break;
				}
			}
		}
	} catch (e) {}
}

function populateOpenFileModal() {
	try {
		var selectedText = getEditorSelectionValue2();
		var url = "/_s_/dyn/pro/ScriptHelper_concatPaths?path1="+_filePath+"&path2="+selectedText;
		var filePath = sahiSendToServer(url).replace(/\\/g, '/');
		if (jQuery.inArray(filePath, _scriptFileList) == -1) {
			parent.setSelectedText("");
		} else {
			filePath = filePath.replace(_scriptDir, "");
			parent.setSelectedText(filePath, _scriptDir);
		}
	} catch (e) {}
}

function includeFile() {
	var scriptPath = _filePath;
	var includePath = $("funcFilePath").title;
	if (includePath == "") return;
	if (includePath == scriptPath) return;
	getIncludedFiles(scriptPath);
	if (jQuery.inArray(includePath, _includedFiles) != -1) return;
	_includedFiles.push(includePath);
	var relativePath = sahiSendToServer("/_s_/dyn/pro/ScriptHelper_getRelativePath?path1="+includePath+"&path2="+scriptPath);
	relativePath = "_include(\""+relativePath.replace(/\\/g, '/')+"\");\n";
	var text = relativePath+getEditorValue2();
	setEditorValue("input", text, false);
}
function isNum(s){
	try {
		return !isNaN(eval(s));
	}
	catch(e){
		return false;
	}
}
function generateFunctionCall() {
	var funcName = jQuery("#funcBox").combobox('getText').replace(/^\s*|\s*$/g, '');
	if (funcName == "") return;
    var txtToAdd = funcName+"(";
    var params = document.getElementsByName("argBox");
    for (var i=0; i<params.length; i++) {
    	var id = funcName+i;
    	var arg = $(id).value.replace(/^\s*|\s*$/g, '');
    	if ((arg.charAt(0)=="'" && arg.charAt(arg.length-1) == "'")
    		|| (arg.charAt(0)=="\"" && arg.charAt(arg.length-1) == "\"")
    		|| isNum(arg) || arg.indexOf("$") == 0 || arg == "true" || arg == "false" 
    		|| arg == "null" || arg == "undefined") {
			// do nothing
		} else if (arg == "") {
			arg = "null";
		} else {
			arg = quoted(arg);
		}
    	txtToAdd += arg;
    	if (i<params.length-1) txtToAdd += ", ";
	}
    txtToAdd += ");";
    return txtToAdd;
}
function updateFunction() {
	var text = generateFunctionCall();
	var selectedText = getEditorSelectionValue2();
	if (selectedText == "") {
		replaceLineText("input", text, g_currentLineNumber, g_currentLineLength);
	} else {
		replaceEditorSelection("input", text);
	}
}
function insertFunction() {
	var txtToAdd = generateFunctionCall();
    replaceEditorSelection("input", txtToAdd);
    includeFile();
}
function quoted(s) {
	return '"' + s.replace(/"/g, '\\"') + '"';
}
function refactorOnChange (funcName) {
	for (var i=0; i<_allFunctions.length; i++) {
		if (funcName == _allFunctions[i].label) {
			var path = _allFunctions[i].desc;
			populateFunctionPath(path)
			refactorInsertFuncArgs(funcName, _allFunctions[i].param);
			break;
		} else {
			$("funcFilePath").value = "";
			$("funcFilePath").title = "";
			document.getElementById('funcArgs').innerHTML = "";
		}
	}
}
function refactorInsertFuncArgs(funcName, param) {
	funcName = funcName.replace(/^\s*|\s*$/g, ''); // trim
	var fnView = document.getElementById('funcArgs');
	var table = "<table style='width:400px'>";
	if (param.length == undefined || param.length == 0) {
		table += "<tr><td style='width:200px'></td></tr>";
	} else {
		for (var i=0; i<param.length; i++) {
			table += "<tr><td><input value='"+ param[i] +"' style='width:185px;background-color:white;border:white;' disabled></td><td><input type='text' name='argBox' id='" + funcName+i + "' autocomplete='off' style='width:185px'></td></tr>";
		}
	}
	table += "</table>";
	fnView.innerHTML = table;
}
var _allFunctions = [];
var _includedFiles = [];
function getIncludedFiles(path) {
	_includedFiles.splice(0,_includedFiles.length);
	_includedFiles.push(_filePath);
	var data = getEditorValue2();
	
	while (data.indexOf("/*") != -1) {
		var x1 = data.indexOf("/*");
		var x2 = data.indexOf("*/", x1);
		if (x2 == -1) x2 = data.length;
		var comment = data.substring(x1,x2+2);
		data = data.replace(comment, '');
	}
	while (data.indexOf("//") != -1) {
		var index1 = data.indexOf("//");
		var index2 = data.indexOf("\n", index1);
		if (index2 == -1) index2 = data.length;
		var lineComment = data.substring(index1,index2);
		data = data.replace(lineComment, '');
	}
	
	var linesAr = data.split("\n");
	for (var i=linesAr.length-1; i>=0; i--) {
		var line = linesAr[i].replace(/^\s*|\s*$/g, ''); // trim
		if (line.indexOf("_include(") != -1 || line.indexOf("_includeOnce(") != -1) {
			var ix1 = line.indexOf("(", line.indexOf("_include"));
			var ix2 = line.indexOf(")", ix1);
			var fileName = line.substring(ix1+1,ix2).replace(/"|'/g,'');
			var url = "/_s_/dyn/pro/ScriptHelper_concatPaths?path1="+path+"&path2="+fileName;
			var filePath = sahiSendToServer(url).replace(/\\/g, '/');
			var includedFiles = sahiSendToServer("/_s_/dyn/pro/ScriptHelper_getIncludedFiles?path="+filePath);
			var includedFilesAr = includedFiles.replace(/\\/g, '/').split(",");
			if (jQuery.inArray(filePath, _includedFiles) == -1) _includedFiles.push(filePath);
			for (var j=0; j<includedFilesAr.length; j++) {
				if (jQuery.inArray(includedFilesAr[j], _includedFiles) == -1 && includedFilesAr[j] != "") {
					_includedFiles.push(includedFilesAr[j]);
				}
			}
		}
	}
}
function refreshFuncData() {
	getIncludedFiles(_filePath);
	updateFunctionsInfo();
}
function getAllFunctions(allFuncData) {
//	var allFuncData = sahiSendToServer("/_s_/dyn/pro/ScriptHelper_getAllFunctionsData");
	var data2d = parseCSVFile(allFuncData);
	var ff = [];
	for ( var i = 0; i < data2d.length; i++) {
		var row = data2d[i];
		var key = row[0];
		row.splice(0, 1);
		var row2d = [[]];
		row2d[1] = row[0].replace(/\\/g, '/');
		row.splice(0, 1);
		if(!isNaN(row[0])) row.splice(0, 1);
		row2d[0] = row;
		key += " : "+row2d[1]+" : ";
		for (var k=0; k < row.length; k++) {
			key += row[k];
			if(k<row.length-1) key += ",";
		}
		if (jQuery.inArray(key, ff) == -1)	ff.push(key);
	}
	ff.sort();
	_allFunctions.splice(0,_allFunctions.length);
	for (var j=0; j<ff.length; j++) {
		var funcDetail = ff[j].split(" : ");
		var functionName = funcDetail[0];
		var functionFilePath = funcDetail[1];
		var args = [];
		if (funcDetail[2] != "")  args = funcDetail[2].split(",");
		if (jQuery.inArray(functionFilePath, _includedFiles) != -1) {
			_allFunctions.splice(0,0,{id: j+1, label : functionName, desc : functionFilePath, param: args});
		} else {
			_allFunctions.push({id: j+1, label : functionName, desc : functionFilePath, param: args});
		}
	}
	jQuery('#funcBox').combobox('loadData', _allFunctions); 
		
	jQuery(".combobox-item").mouseenter(function(e){
		var options = jQuery('#funcBox').combobox('options'); //options
		var data = jQuery('#funcBox').combobox('getData'); //loaded data
		for(var i=0; i<data.length; i++){
			var myString = e.target.id; //id of combobox option item
			var arr = myString.split('_'); //split the id to get the combobox item valuefield +1 value
			var item = data[i];
			if(item[options.valueField]-1 == arr[4]){
				//console.log("id: " +e.target.id + " valueField: " + item[options.valueField] + " Array Index: " + arr[4] + " textField: " +item[options.textField]+ " displayed name: "+e.target.innerHTML);
				jQuery('#funcBox').combobox('select', data[arr[4]].id);
			}
		}//.for loop
		
	});
}

function parseCSVFile(contents, wordSeparator) {
	if (!wordSeparator)
		wordSeparator = ",";
	var lines = contents.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
			.split("\n");
	var data = [];
	for ( var i = 0; i < lines.length; i++) {
		if (lines[i].replace(/^\s*|\s*$/g, '') == "")
			continue;
		var words = splitUnQuoted(lines[i], wordSeparator);
		for ( var j = 0; j < words.length; j++) {
			var w = words[j];
			w = w.replace(/^\s*|\s*$/g, '');
			if (w.match(/^".*"$/)) {
				words[j] = w.substring(1, w.length - 1);
			}
		}
		data[data.length] = words;
	}
	return data;
}
function splitUnQuoted(s, wordSeparator) {
	var words = [];
	var prev = ' ';
	var startIx = 0;
	var quoted = false;
	for ( var i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if (c == '"' && prev != '\\') {
			quoted = !quoted;
		} else if (c == wordSeparator) {
			if (!quoted) {
				words[words.length] = s.substring(startIx, i);
				startIx = i + 1;
			}
		}
		prev = c;
	}
	if (startIx <= s.length)
		words[words.length] = s.substring(startIx);
	return words;
}

var g_currentSelection = "";
var g_params = [];
var g_objects = [];
function refactor(){
	jQuery('#fnNameBox').combobox('setValue', "");
	var content = getEditorSelectionValue2();
	g_currentSelection = content;
	g_params = [];
	g_objects = [];	
	var lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split("\n");
	var sbObjects = [];
	var sbParams = [];
	var duplicates = new Object();
	for (var i=0; i<lines.length; i++){
		var line = lines[i];
		if (line == "") continue;
		var lineData = new LineData(line);
		if(_actionKeyWords.indexOf(";"+lineData.action+";") == -1) continue;
		var params = lineData.params;
		var objectInLine = null;
		
		for (var j=0; j<params.length; j++){
			var param = params[j];
			param = getObjectFromParam(param);
			if(param=="true"||param=="false") continue; 
			if (duplicates[param]){
				objectInLine = param;
				continue;
			}
			var firstChar = param.charAt(0);
			if (firstChar == '"' || firstChar == '/' || firstChar == "'" || (firstChar == '$' && param.indexOf("$_") != 0)){
			} else {
				if (param == "") continue;
				duplicates[param] = param;
				var id = g_objects.length;
				var constant = makeConstant(param);
//				if (constant == param) continue;
				//g_objects[id] = {original:param, replacement: constant, enabled:$("object_all").checked};
				//sbObjects[sbObjects.length] = getTableRow(id, param, constant, "object");
				objectInLine = param;
			}
		}	
		for (var j=0; j<params.length; j++){
			var param = params[j];
			if (duplicates[param]) continue;
			var firstChar = param.charAt(0);
			if (firstChar == '"' || firstChar == '/' || firstChar == "'" || (firstChar == '$' && param.indexOf("$_") != 0)){
				if (param == "") continue;
				duplicates[param] = param;
				var id = g_params.length;
				var variable = makeParameter(param, objectInLine);
				if (variable == param) continue;
				g_params[id] = {original:param, replacement: variable, enabled:$("param_all").checked};
				sbParams[sbParams.length] = getTableRow(id, param, variable, "param");

			}
		}		
	}
	//$("objects").innerHTML = makeTable(sbObjects);
	$("params").innerHTML = makeTable(sbParams);
}
function getObjectFromParam(p){
	if (p.indexOf("_isVisible") == 0 || p.indexOf("_getText") == 0 || p.indexOf("_getValue") == 0) {
		p = p.substring(p.indexOf("(") + 1);
		p = p.substring(0, p.length - 1);
	}
	p = p.replace(/[.](value|checked)$/, '');
	return p;
}
function getTableRow(id, original, replacement, type){
	return 	'<tr><td><input type="checkbox" ' + ($(type+'_all').checked ? "checked" : "") + ' id="'+type+'_'+id+'" onclick="toggle_' + type + '('+id+')"></td>' +
			'<td><div class="originalTD" title=\'' + original.replace(/'/g, "&apos;") + '\'>' + original + '</div></td>' + 
			'<td><div class="replacementTD"><input type="text" value="'+ replacement +'" onchange="modifyVariableName('+id+', \''+type+'\', this)"></div></td></tr>';	
}
function modifyVariableName(id, type, el){
//	alert(id+ " " + type +  " " + el.value);
	eval("g_" + type + "s")[id].replacement = el.value;
}
function makeTable(ar){
	return "<table>" + ar.join("") + "</table>";
}
function makeParameter(s, objectInLine){
	if (s.charAt(0) == '$') return s;
	if (objectInLine) {
		try{
			if (objectInLine.indexOf("$_") == 0) {
				return "$" + objectInLine.replace(/[$]_[^_]*_/, '').toLowerCase();
			} else {
				s = new Parser(objectInLine).parse().params[0];
			}
		}catch(e){}
	}
	return "$" + s.replace(/_/g, '').replace(/_/g, '').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '');
}
function makeConstant(s){
	if (s.charAt(0) == '$') return s;
//	return "$_" + s.toUpperCase().replace(/_/g, '').replace(/[ \(\)\[\]"\-\/,']/g, '_').replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '')
	return "$_" + s.toUpperCase().replace(/_/g, '').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '')
		.replace(/_[^_]*_NEAR_[^_]*_/g, '_').replace(/_[^_]*_IN_[^_]*_/g, '_');
}
function selectFull(id){
	$(id).setSelectionRange(0, $(id).value.length)
}

function init(){
	var href = window.location.href;
	var u = new URLParser(href);
	if(u.parameters){
		_scriptName = u.getParameter("file");
		if (_scriptName) {
			if (_scriptName.indexOf(".") == -1) _scriptName = _scriptName + ".sah";
		}
		_scriptDir = u.getParameter("dir");
		if(_scriptDir && _scriptDir.charAt(_scriptDir.length-1) == "/"){
			_scriptFileList = refreshScriptListFile(_scriptDir);
			_filePath = _scriptDir + _scriptName;
		}else{
			_filePath = _scriptDir + "/" +_scriptName;
		}
		$("usefile").value = _filePath;
		var data = u.getParameter("data");;
	}
	if (_scriptName && (_scriptName.match(/[.]sah$/) || _scriptName.match(/[.]js$/))) {
		createCMEditor("input", true);
	} else {
		createTextCMEditor("input", true);
	}
	if(data){
		setValueInCME('input', data);
	} else {
		if (_scriptDir && _scriptName) {
			loadScript(_scriptDir, _scriptName);
		}
	}
	_keyWords = sahiSendToServer("/_s_/dyn/ControllerUI_getKeyWords?type=normal");
	_actionKeyWords = sahiSendToServer("/_s_/dyn/ControllerUI_getKeyWords?type=action");
	var allDiv = document.getElementsByTagName("DIV");
	for(var i=0; i<allDiv.length; i++){
		if(allDiv[i].className.indexOf("CodeMirror ") == 0){
			var codemirrorDiv = allDiv[i];
			break;
		}
	}
	if(codemirrorDiv){
		var editor = codemirrorDiv.CodeMirror;
		editor.focus();
	}
	
	if (_filePath && _filePath.indexOf(".suite") != -1) {
		getEstimatedRunTime(_filePath);
	}
	getAverageRunTime(_filePath);
	getIncludedFiles(_filePath);
	updateFunctionsInfo();
	onEastPanelCollapse();
	shortComboPanelHeight();
}

function shortComboPanelHeight(){
	jQuery('#funcBox').combo('options').panelHeight = 100;
	jQuery('#fnNameBox').combo('options').panelHeight = 100;
}

function onFunctionNameSelect(row) {
	jQuery("#funcBox").val(row.label);
	populateFunctionPath(row.desc);
	refactorInsertFuncArgs(row.label, row.param);
	if(jQuery.inArray(row.desc, _includedFiles) == -1) {
		$("funcFilePath").style.color = "red";
	}else{
		$("funcFilePath").style.color = "black";
	}
	return false;
}

function updateFunctionsInfo() {
	  jQuery.ajax({
		  url: "/_s_/dyn/pro/ScriptHelper_getAllFunctionsData"
	  }).done(function(data) {
		  getAllFunctions(data);
	  });
}

function getEstimatedRunTime(path) {
	jQuery.ajax({
		  url: "/_s_/dyn/pro/DBReports_getEstimatedRunTime?path="+path
	  }).done(function(data) {
		  $('estRunTime').value = millisecondsToString(parseInt(data));
		  $('estTimeTD').style.display = "table-row";
	  });
}

function millisecondsToString(ms) {
	var sec = Math.floor(ms / 1000);
	var days = Math.floor((sec % 31536000) / 86400); 
	var hours = Math.floor(((sec % 31536000) % 86400) / 3600);
	hours = hours + (days*24);
	var minutes = Math.floor((((sec % 31536000) % 86400) % 3600) / 60);
	var seconds = (((sec % 31536000) % 86400) % 3600) % 60;
	var milliseconds = ms % 1000;
	return hours + " hrs " + minutes + " mins " + seconds + " secs " + milliseconds + "ms";
}

function getAverageRunTime(path) {
	//console.log(path);
	jQuery.ajax({
		  url: "/_s_/dyn/pro/DBReports_getAverageRunTime?path="+path
	  }).done(function(data) {
		//console.log(data);
		  $('avgRunTime').value = millisecondsToString(parseInt(data));
	  });
}

/** Objects start **/
function URLParser(url){
	this.unparsed = url;
	this.parse();
}
URLParser.prototype.getParameter = function(k){
	return this.parameters[k];
}
URLParser.prototype.parse = function(){
	var qIx = this.unparsed.indexOf("?");
	if (qIx == -1) {
		this.url = this.unparsed;
		return;
	}
	this.url = this.unparsed.substring(0, qIx);
	this.qs = this.unparsed.substring(qIx+1);
	this.parameters = new Object();
	var tokens = this.qs.split("&");
	for (var i=0; i<tokens.length; i++){
		var kv = tokens[i].split("=");
		this.parameters[kv[0]] = unescape(kv[1]);
	}
}
function LineData(line){
	this.line = line;
	this.parse();
}
LineData.prototype.parse = function(){
	var o = new Parser(this.line).parse();
	this.action = o.action;
	this.params = o.params;
}
function Parser(line){
	this.line = line;
}
Parser.prototype.parse = function(){
	var startBracket = this.findNext("(");
	var endBracket = this.findNext(")", startBracket+1);
	var paramsStr = this.line.substring(startBracket+1, endBracket);
	var params = [];
	var tempStartIx = 0;
	var paramsParser = new Parser(paramsStr);
	var j=0;
	while (j++ < 10){
		var tempEndIx = paramsParser.findNext(",", tempStartIx);
		if (tempEndIx != -1){
			params[params.length] = this.trim(paramsStr.substring(tempStartIx, tempEndIx));
			tempStartIx = tempEndIx + 1;
		} else {
			params[params.length] = this.trim(paramsStr.substring(tempStartIx));
			break;
		}
	}
	var action = this.trim(this.line.substring(0, startBracket));
	return {action:action, params:params};
}
Parser.prototype.trim = function(s){
	return s.replace(/^[\s]*/, '').replace(/[\s]*$/, '');
}
Parser.prototype.findNext = function(charToFind, startIx){
	var c = ' ';
	var isVar = false;
	var escaped = false;
	var doubleQuoted = false;
	var quoted = false;
	var len = this.line.length;
	var bracket = 0;
	var square = 0;
	if (!startIx) startIx = 0;
	for (var i=startIx; i<len; i++){
		c = this.line.charAt(i);
		if (c == charToFind && !escaped && !quoted && !doubleQuoted && square == 0 && bracket == 0){
			return i;
		}
		if (c == '\\') {
			escaped = !escaped;
		} else if (c == '"') {
			if (!(escaped || quoted)) {
				doubleQuoted = !doubleQuoted;
			}
		} else if (c == "'") {
			if (!(escaped || doubleQuoted)) {
				quoted = !quoted;
			}
		} else if (c == '['){
			if (!(escaped || quoted || doubleQuoted)) {
				square++;
			}			
		} else if (c == ']'){
			if (!(escaped || quoted || doubleQuoted)) {
				square--;
			}			
		} else if (c == '('){
			if (!(escaped || quoted || doubleQuoted)) {
				bracket++;
			}			
		} else if (c == ')'){
			if (!(escaped || quoted || doubleQuoted)) {
				bracket--;
			}			
		}
		if (c != '\\') {
			escaped = false;
		}
	}
	return -1;		
}

/* Script Load start */
var _scriptDir = null;
var _selectedScript = null;
var _scriptFileList = null;
var _functionNameList = null;
var _selectedFunctionName = null;
var firstLoadOnCME = true;
var g_lineSeparator = "\n"; // osx and linux use \n. old macs used \r. Not considering them.

function loadScript(dir, file){
	if(dir && file){
		var textFile = sahiSendToServer("/_s_/dyn/ControllerUI_getScript?dir="+dir+"&file="+file);
		if (textFile.indexOf("\r\n") != -1) g_lineSeparator = "\r\n";
		g_history = new History();
		setInputTextarea(textFile, true);
		firstLoadOnCME = false;
		saveHash()
	}
}

g_savedHash = jQuery.md5("");
function getHash() {
	return jQuery.md5(getEditorValue2());
}
function saveHash(){
	g_savedHash = getHash();
}
function isDirty() {
	return (g_savedHash != getHash())
}

function loadDocs(){
	location.href="/_s_/spr/docview/docviewer.htm?dir=" + encodeURIComponent(_scriptDir) + "&file=" + encodeURIComponent(_scriptName);
}

var __queuedSaveTimer = null;
function saveScript(){
	var dir = _scriptDir;
	var file = _scriptName;
	if(dir && file){
		var contents = getEditorValue2();
		sahiSendToServer("/_s_/dyn/ControllerUI_saveScript?dir="+fixedEncodeURIComponent(dir)+
				"&file="+fixedEncodeURIComponent(file)+
				"&contents="+fixedEncodeURIComponent(contents));
		saveHash();
		if (inIframe()) {
			parent.removeModifiedSymbolOnTabHeader(_scriptDir, _scriptName);
		}
		if (__queuedSaveTimer)	window.clearTimeout(__queuedSaveTimer);
		__queuedSaveTimer = window.setTimeout("refreshFuncData()", 200);
		
		$('saveAlertDiv').style.display="inline";
		$('saveAlertDiv').innerHTML = 'Saved!';
		window.setTimeout("putDelay()",3000);
	}
}

function saveAsScript(dir, file){
	if(dir && file){
		var ok = true;
			var contents = getEditorValue2();
			sahiSendToServer("/_s_/dyn/ControllerUI_saveScript?dir="+fixedEncodeURIComponent(dir)+
					"&file="+fixedEncodeURIComponent(file)+
					"&contents="+fixedEncodeURIComponent(contents));
	}
}

String.prototype.startsWith = function(str) {
    return ( str === this.substr( 0, str.length ) );
}

function trim(s) {
	if (s == null) return s;
	if ((typeof s) != "string") return s;
	s = s.replace(/\xA0/g, ' ').replace(/\s\s*/g, ' ');
	var ws = /\s/;
	var t1 = (ws.test(s.charAt(0))) ? 1 : 0;
	var t2 = (ws.test(s.charAt(s.length-1))) ? s.length-1 : s.length;
	return s.slice(t1, t2);
};

function getFunctionsNameJson(){
	var functionsNameList = refreshFunctionNameList();
	var json = "[";
	for(var i=0; i<functionsNameList.length; i++){
		var script = functionsNameList[i];
		json += "{";
		json += quoted("id") + ":" + i+1 + "," + quoted("text") + ":" + quoted(script);
		json += "}";
		if(i < functionsNameList.length-1){
			json += ",";
		}
	}
	json += "]";
	return eval("(" + json + ")");
}

function xpopulateScripts(dir) {
	_scriptFileList = refreshScriptListFile(dir);
	setSelectedScriptDir(dir);
	$('filebox').value = "";
}

function xsetSelectedScriptDir(s) {
    _scriptDir = s;
}

function xsetSelectedScript(s) {
    _selectedScript = s;
}

function setSelectedFunctionName(s){
	_selectedFunctionName = s;
}

function refreshScriptListDir(){
	return eval("(" + sahiSendToServer("/_s_/dyn/ControllerUI_scriptDirsListJSON") + ")");
}

function refreshFunctionNameList(){
	return eval("(" + sahiSendToServer("/_s_/dyn/ControllerUI_functionNameListJASON") + ")");
}

function refreshScriptListFile(dir){
	return eval("(" + sahiSendToServer("/_s_/dyn/ControllerUI_scriptsListJSON?dir="+dir) + ")");
}
/* Script Load end */

/* History start */
function History(){
	this.entries = [];
	this.index = -1;
}
History.prototype.undo = function(){
	if (this.index-1 >= 0){
		this.index--;
		return this.entries[this.index];
	}
}
History.prototype.redo = function(){
	if (this.index+1 < this.entries.length){
		this.index++;
		return this.entries[this.index];
	}
}
History.prototype.add = function(s){
	this.index++;
	this.entries[this.index] = s;
	this.entries.length = this.index + 1;
}
var g_history = new History();
/* History end */
function populateFunctionPath(path) {
	$('funcFilePath').title = path;
	if (path.length > 30) {
		path = "..." + path.substring(path.length-30);
	}
	jQuery("#funcFilePath").val(path);
}
function onEastPanelCollapse(){
		var title = "Context";
		var p = jQuery('#container').layout('panel','east');
	//var p = jQuery('#container').data('layout').panels['expandEast'];  // the west expand panel
  		p.html('<div style="font-weight:bold;height:40px;color:#575765;-moz-transform: rotate(270deg);padding:45px 22px;-ms-transform: rotate(270deg);-webkit-transform: rotate(270deg)">'+title+'</div>');
}
function showHideContextPane() {
	if (!jQuery('#container').layout('panel', 'east').panel('options').collapsed) {
		jQuery('#container').layout('collapse', 'east');
	} else {
		jQuery('#container').layout('expand', 'east');
	}
}
function refreshContents() {
	// 11-10-14: codemirror 2.x: On IE11, after page refresh, on first move to a non-selected tab, 
	// the editor is blank, till either resize or re-navigation to tab is done.
// 	12-10-14: codemirror 4.6: Can't reproduce this issue.
//	if (isIE())
//		window.setTimeout("refreshCME('input')", 200);
}
function openScriptInfo(){
	openAndCenterWindow("script_info");
}
function changeCmeHeight() {
	var h = jQuery(window).height();
	if (560 < h) {
		$('params').style.height = "196px";
		//$('objects').style.height = "196px";
		var cmeDivs = $('id1').getElementsByTagName('DIV');
		for (var i = 0; i < cmeDivs.length; i++) {
			if (cmeDivs[i].className.indexOf("CodeMirror-scroll") != -1) {
				cmeDivs[i].style.height = 566 + "px";
				break;
			}
		}
	}
}
function shortcuts(e) {
	e = !e ? window.event : e;
	var ctrlS = e.ctrlKey && e.keyCode == 'S'.charCodeAt(0);
	var altN = e.altKey && e.keyCode == 'N'.charCodeAt(0);
	var altO = e.altKey && e.keyCode == 'O'.charCodeAt(0);
	var altF2 = e.altKey && e.keyCode == '113';
	if (document.getElementById('mask').style.display != "block") {
		if (ctrlS) {
			if (e.preventDefault)
				e.preventDefault();
			if (e.stopPropogation)
				e.stopPropogation();
			window.setTimeout("saveScript();", 1);
			//window.setTimeout("document.getElementById(\"save\").onclick();", 1);
		} else if (altN) {
			if (e.preventDefault)
				e.preventDefault();
			if (e.stopPropogation)
				e.stopPropogation();
			window.setTimeout("parent.createNewFile();", 1);
		} else if (altO) {
			if (e.preventDefault)
				e.preventDefault();
			if (e.stopPropogation)
				e.stopPropogation();
			window.setTimeout("parent.openLoadModal();", 1);
		} else if (altF2) {
			if (e.preventDefault)
				e.preventDefault();
			if (e.stopPropogation)
				e.stopPropogation();
			window.setTimeout("parent.openSaveAsModal();", 1);
		}
	}
	if (e.keyCode == 27) {
		if (parent.isLoadDialogOpened()) {
			parent.closeWindow('loadDialog');
		}
		if (parent.isSaveAsDialogOpened()) {
			parent.closeWindow('saveAsDialog');
		}
	}
}

function putDelay() {
	$('saveAlertDiv').style.display = "none";
}
function putDelay2() {
	$('noContentAlertDiv').style.display = "none";
}
function testParser(){
	alert(3 + " " + (new Parser("a(b)c").findNext(')', 2)));
	alert(7 + " " + (new Parser('a(b"()")c').findNext(')', 2)));
	alert(6 + " " + (new Parser("a(b\\)c)d").findNext(')', 2)));
	alert(5 + " " + (new Parser("a(b())c").findNext(')', 2)));
	alert(5 + " " + (new Parser("a(b[])c").findNext(')', 2)));
	alert(1 + " " + (new Parser("a(b[])c").findNext('(', 0)));
	alert(10 + " " + (new Parser("a(b(), 'x')c").findNext(')', 2)));
}

function onEastPanelCollapse() {
    var title = "Context";
    p = jQuery('#container').layout('panel','expandEast');
    if(p)
    	p.html('<div style="font-weight:bold;color:#575765;-moz-transform: rotate(90deg);padding:6px 2px;-ms-transform: rotate(90deg);-webkit-transform: rotate(90deg)">'+title+'</div>');
}

function onCMEChange() {
	if (!inIframe()) return;
	if(firstLoadOnCME){
		parent.removeModifiedSymbolOnTabHeader(_scriptDir, _scriptName);
	}
	else{
		parent.addModifiedSymbolOnTabHeader(_scriptDir, _scriptName);
	}
}

function openIncludeFile(){
	var path = $('funcFilePath').title;
	if (!inIframe()) return;
	parent.openNewTabFromFullPath(path);
}

function getEditorValue2() {
	return getEditorValue("input", g_lineSeparator);
}

function getEditorSelectionValue2() {
	return getEditorSelectionValue("input", false, g_lineSeparator)
}