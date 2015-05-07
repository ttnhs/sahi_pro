SpreadSheet = function(containerId) {
	this.containerId = containerId;
	var ss = this;
	var currentRow = null;
	var currentRowEnd = null;
	var currentCol = null;
	var currentColEnd = null;
	this.functionsList = ["[Documentation]", "loadSahi", "loadExcel", "[CreateKeyword]", 
	                      "[Arguments]" , "[Keyword]", "[Data]", "[SetUp]", "[TearDown]"];
	
	this._filePath = "";
	this._includedFiles = [];
	this._allFunctionsData = [
	                          {keyword:"loadSahi", desc:"", param:["$filePath"]},
	                          {keyword:"loadExcel", desc:"", param:["$filePath"]},
	                          {keyword:"[Documentation]", desc:"", param:["Description"]},
	                          {keyword:"[CreateKeyword]", desc:"", param:["KeywordName"]},
	                          {keyword:"[Arguments]", desc:"", param:[]},
	                          {keyword:"[Keyword]", desc:"", param:["KeywordName"]},
	                          {keyword:"[Data]", desc:"", param:[]},
	                          {keyword:"[SetUp]", desc:"", param:[]},
	                          {keyword:"[TearDown]", desc:"", param:[]}
	                         ];
	
	this.getIncludedFiles = function (path) {
		var includedFiles = sahiSendToServer("/_s_/dyn/pro/ScriptHelper_getIncludedFiles?path="+path);
		this._includedFiles = includedFiles == "" ? [] : includedFiles.replace(/\\/g, '/').split(",");
	}
	
	this.getAllFunctions = function (allFuncData) {
//		var allFuncData = sahiSendToServer("/_s_/dyn/pro/ScriptHelper_getAllFunctionsData");
		var data2d = this.parseCSVFile(allFuncData);
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
			ff.push(key);
		}
		ff.sort();
		for (var j=0; j<ff.length; j++) {
			var funcDetail = ff[j].split(" : ");
			var functionName = funcDetail[0];
			var functionFilePath = funcDetail[1];
			var args = [];
			if (funcDetail[2] != "")  args = funcDetail[2].split(",");
			if (jQuery.inArray(functionFilePath, this._includedFiles) != -1) {
				this._allFunctionsData.splice(0,0,{keyword : functionName, desc : functionFilePath, param: args});
			} else {
				this._allFunctionsData.push({keyword : functionName, desc : functionFilePath, param: args});
			}
		}
	}
	
	this.includeFile = function (path) {
		if (path == this._filePath) return;
		if (jQuery.inArray(path, this._includedFiles) != -1) return;
		var url = "/_s_/dyn/pro/ScriptHelper_getRelativePath?path1="+path+"&path2="+this._filePath;
		var relativePath = sahiSendToServer(url).replace(/\\/g, '/');
		var loadFile = (relativePath.indexOf(".sah") != -1) ? "loadSahi" : "loadExcel";
		this.data.alter('insert_row', 1, 1);
		this.data.setDataAtCell(1, 0, "");
		this.data.setDataAtCell(1, 1, loadFile);
		this.data.setDataAtCell(1, 2, relativePath);
		this.data.selectCell(1, 2, 1, 2);
		this.data.render();
	}
	
	this.initProperties = function () {
		this.properties = {
			minRows : 5,
			minCols : 5,
			manualColumnResize : true,
			minSpareRows : 6,
			fixedColumnsLeft: 2,
			fillHandle: true,
			currentRowClassName: 'currentRow',
		    currentColClassName: 'currentCol',
			autoWrapRow : true,
			persistentState: true,
			cells : function(r, c, prop) {
				var cellProperties = {};
				if (r == 0) {
					cellProperties.renderer = ss.firstRowRenderer;
				}
				if (c == 0 && r != 0) {
					cellProperties.renderer = ss.wrap(ss.firstColumnRenderer);
				}
				if (c != 0 && r != 0) {
					cellProperties.renderer = ss.wrap(ss.cellRenderer);
				}
				return cellProperties;
			},
			colHeaders : true,
			columns : [{}, {
				type : {
					editor : Handsontable.AutocompleteEditor
				},
				source : ss.wrap(ss.getFunctions),
				strict : false,
			}],
			contextMenu : true,
			rowHeaders: true,
			contextMenu : ['row_above', 'row_below', 'hsep1', 'col_left', 'col_right', 
			               'hsep2', 'remove_row', 'remove_col', 'hsep3', 'undo', 'redo'],
			afterChange : ss.wrap(ss.onCellValueChange),
			afterSelectionEnd : ss.wrap(ss.onCellSelect),
			afterCreateCol : ss.wrap(ss.updateColumnsAfterAddCol),
			afterRemoveCol : ss.wrap(ss.updateColumnsAfterRemovCol),
			afterRemoveRow : ss.wrap(ss.updateRowsAfterRemovRow)
		}
		this.updateColumnCount(10);
	}
	
	this.updateRowsAfterRemovRow = function () {
		this.scanFullAndGetUpdatedFunctionAndParam();
	}
	
	this.updateColumnsAfterRemovCol = function(index, amount){
		this.updateColumnCount(this.properties.columns.length-1);
		this.scanFullAndGetUpdatedFunctionAndParam();
	}
	
	this.updateColumnsAfterAddCol = function(count){
		this.updateColumnCount(this.properties.columns.length+1);
		this.setCenterLayoutWidth();
		this.scanFullAndGetUpdatedFunctionAndParam();
	}
	
	this.updateColumnCount = function(count){
		var cols = this.properties.columns;
		for (var i=2; i<cols.length; i++) {
			cols.pop();
		}
		for (var i=2; i<count; i++) {
			cols[i] = {};
		}
	}

/*
	this.makeReadOnlyAll = function(){
		var cols = this.properties.columns;
		for (var i=0; i<cols.length; i++) {
			cols[i].readOnly = true;
		}
	}

	this.makeEnableAll = function(){
		var cols = this.properties.columns;
		for (var i=0; i<cols.length; i++) {
			cols[i].readOnly = false;
		}
	}
*/
	
	this.init = function() {
		this.initProperties();
		var data = [
				[ "TestCase", "Key Word", "Argument 1", "Argument 2"],
				[ "", "loadSahi", "$filePath",],
				[ "", , ,],
				[ "My First Testcase", "[Documentation]",
						"My testcase description. Modify as needed",],
				[ "", "myFunction", "my argument", "my argument 2"], [ "", , ,] ];
		this.container = jQuery('#' + this.containerId);
		this.properties.data = data;
		this.container.handsontable(this.properties);
		this.data = this.container.data('handsontable');
	}
	
	this.updateData = function(data) {
		this.updateColumnCount(data[0].length+10);
		this.data.loadData(data);
		var href = window.location.href;
		var u = new URLParser(href);
		if(u.parameters){
			var file = u.getParameter("file");
			var dir = u.getParameter("dir");
			if (dir && file) {
				dir = dir.replace(/\\/g, '/');
				file = file.replace(/\\/g, '/');
				this._filePath = dir+file;
			}
		}
		
		this.getAverageRunTime(this._filePath);
		this.getIncludedFiles(this._filePath);
		this.updateFunctionsInfo();
		this.expandToFit();
		//this.getAllFunctions();
		//this.scanFullAndGetUpdatedFunctionAndParam();
	}
	
	this.refreshFunctionsData = function() {
		this.getIncludedFiles(this._filePath);
		this.updateFunctionsInfo();
	}
	
	this.getAverageRunTime = function(path) {
		jQuery.ajax({
			  url: "/_s_/dyn/pro/DBReports_getAverageRunTime?path="+path
		  }).done(function(data) {
			  $('avgRunTime').value = ss.millisecondsToString(parseInt(data));
		  });
	} 
	
	this.millisecondsToString = function (ms) {
		var sec = Math.floor(ms / 1000);
		var days = Math.floor((sec % 31536000) / 86400); 
		var hours = Math.floor(((sec % 31536000) % 86400) / 3600);
		hours = hours + (days*24);
		var minutes = Math.floor((((sec % 31536000) % 86400) % 3600) / 60);
		var seconds = (((sec % 31536000) % 86400) % 3600) % 60;
		var milliseconds = ms % 1000;
		return hours + " hrs " + minutes + " mins " + seconds + " secs " + milliseconds + "ms";
	}
	
	this.updateFunctionsInfo = function () {
		  jQuery.ajax({
			  url: "/_s_/dyn/pro/ScriptHelper_getAllFunctionsData",
			  context: this
		  }).done(function(data) {
			  this.getAllFunctions(data);
			  this.scanFullAndGetUpdatedFunctionAndParam();
		  });
	}
	
	this.firstRowRenderer = function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.TextCell.renderer.apply(this, arguments);
		td.style.fontWeight = 'bold';
		td.style.color = 'grey';
		td.style.width = '80px';
		td.style.background = '#F4F4F4';
		if (row == 0 && col == 0) {
			td.style.fontFamily = 'Courier New';
		}
	}

	this.firstColumnRenderer = function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.TextCell.renderer.apply(this, arguments);
		if (this.data && this.data.getDataAtCell(row, 0) != "" && this.data.getDataAtCell(row, 0) !== null && this.data.getDataAtCell(row, 0) !== undefined && this.data.getDataAtCell(row, 0).indexOf("//") == 0) {
			td.style.color = "#ccc";
		}
		td.style.fontFamily = "Courier New";
		td.style.width = '80px';
	}
	
	this.functionName = "";
	this.cellRenderer = function (instance, td, row, col, prop, value, cellProperties) {
		//if(value === undefined || value === null || value == "") return;
		Handsontable.TextCell.renderer.apply(this, arguments);
		if (col == 1) {
			Handsontable.AutocompleteCell.renderer.apply(this, arguments);
			if(value === undefined || value === null || value == "") return;
			this.functionName = value;
			td.style.fontStyle = 'italic';
			td.title = 'Type to show the list of options';
			value = value.replace(/^\s*|\s*$/g, ''); // trim
			if(value.indexOf("=") == -1){
				if (!this.isValidFunction(value) && !this.isSahiApi(value)) { 
					td.style.color = 'red'; 
				} else if (!this.isFunctionIncluded(value) && !this.isSahiApi(value)){
					td.style.color = 'orange';
				}
			}
			else if(value.indexOf("=") != value.length - 1){
				var extractFnName = value.substring(value.indexOf("=")+1);
				extractFnName = this.resolveFnName(extractFnName);
				if (!this.isValidFunction(extractFnName) && !this.isSahiApi(extractFnName)) { 
					td.style.color = 'red'; 
				} else if (!this.isFunctionIncluded(extractFnName) && !this.isSahiApi(value)){
					td.style.color = 'orange';
				}
			}
		}
		if (this.data && this.data.getDataAtCell(row, 0) != "" && this.data.getDataAtCell(row, 0) !== null && this.data.getDataAtCell(row, 0) !== undefined && this.data.getDataAtCell(row, 0).indexOf("//") == 0) {
			td.style.color = "#ccc";
		} else {
			if (col > 1) {
				if(this.functionName === undefined || this.functionName === null || this.functionName == "")	return;
				this.functionName = this.functionName.replace(/^\s*|\s*$/g, ''); // trim
				if(this.functionName == "[Data]" && this.data){
					if(!this.isValidAssociatedArgument(row, col)){
						td.style.color = 'red';
					}
				}
				else if(this.functionName.indexOf("=") != -1){
					if(this.functionName.indexOf("=") == this.functionName.length - 1){
						if(col > 2)
							td.style.color = 'red';
					}
					else{
						var extractFnName2 = this.functionName.substring(this.functionName.indexOf("=")+1);
						extractFnName2 = this.resolveFnName(extractFnName2);
						if(this.isSahiApi(extractFnName2)){
							// do nothing 
						}
						else if (!this.isValidFunction(extractFnName2)) { 
							td.style.color = 'red'; 
						}
						else if(!this.isValidArgument(row, col, extractFnName2)){
							if(!(extractFnName2 == "[Documentation]" || extractFnName2 == "[Arguments]")){
								td.style.color = 'red';
							}
						}
					}
				}
				else if (!this.isValidArgument(row, col, this.functionName)) {
					if(!(this.functionName == "[Documentation]" || this.functionName == "[Arguments]" || this.isSahiApi(this.functionName))){
						td.style.color = 'red';
					}
				}
			}
			if (col >= 1 && this.data && this.data.getDataAtCell(row, 1) != "" && this.data.getDataAtCell(row, 1) !== null && this.data.getDataAtCell(row, 1) !== undefined) {
				var funAr = ["[Documentation]", "[CreateKeyword]", "[Arguments]" , "[Keyword]", "[Data]", "[SetUp]", "[TearDown]"];
				if (this.isValidArgument(row, col, this.functionName) && funAr.indexOf(this.functionName) == -1) td.style.backgroundColor = "#FAFAFA" //"#F2F2F2"
				if (this.functionName == "[Documentation]") td.style.color = 'green';
			}
			if (col == 2 && (this.functionName == "loadSahi" || this.functionName == "loadExcel")) {
				if(currentPath){
					if (!this.isValidLoadSahiFile(row, col, value)) {
						td.style.color = 'red'; 
					}
				}
				else{
					td.style.color = 'red'; 
				}
			}
			else if (col == 2 && this.functionName == "[Keyword]") {
				if(!this.isValidFunction(value))
					td.style.color = 'red'; 
			}
		}
	}
	
	this.isValidAssociatedArgument = function(row, col){
		var keywordFound = false;
		for(var i=row-1; i>=0; i--){
			if(this.data.getDataAtCell(i, 1) == "[Keyword]"){
				if(this.data.getDataAtCell(i, 0) !== null && this.data.getDataAtCell(i, 0) !== undefined){
					if(this.data.getDataAtCell(i, 0).indexOf("//") == 0){
						continue;
					}
				}
				keywordFound = true;
				if(this.isValidArgument(row, col, this.data.getDataAtCell(i, 2))){
					return true;
				}
				return false;
			}
		}
		return keywordFound;
	}
	
	this.getAssociatedParams = function(row, col){
		var keywordFound = false;
		var associatedParams = [];
		for(var i=row-1; i>=0; i--){
			if(this.data.getDataAtCell(i, 1) == "[Keyword]"){
				if(this.data.getDataAtCell(i, 0) !== null && this.data.getDataAtCell(i, 0) !== undefined){
					if(this.data.getDataAtCell(i, 0).indexOf("//") != 0){
						keywordFound = true;
						break;
					}
				}
			}
		}
		if(keywordFound){
			associatedParams = this.getParams(this.data.getDataAtCell(i, 2));
			return associatedParams;
		}
	}
	
	this.isValidLoadSahiFile = function(r, c, loadSahiFile){
		if(loadSahiFile === null || loadSahiFile === undefined || loadSahiFile == "") return false;
		loadSahiFile = loadSahiFile.replace(/\\/g, "/");
		var isFullPath = sahiSendToServer("/_s_/dyn/pro/TestCaseUI_isFileExists?filePath=" + encodeURIComponent(loadSahiFile));
		if (isFullPath == "true") return true;
		var cPath = currentPath.replace(/\\/g, "/");
		cPath = cPath.substring(0,cPath.lastIndexOf("/")+1);
		if((loadSahiFile.charAt(0)=="\"" && loadSahiFile.charAt(loadSahiFile.length-1)=="\"") || (loadSahiFile.charAt(0)=="'" && loadSahiFile.charAt(loadSahiFile.length-1)=="'")){
			loadSahiFile = loadSahiFile.substring(1, loadSahiFile.length-1);
		}
		loadSahiFile = cPath + loadSahiFile;
		var isLoadSahiFile = sahiSendToServer("/_s_/dyn/pro/TestCaseUI_isFileExists?filePath=" + encodeURIComponent(loadSahiFile));
		if (isLoadSahiFile == "true")
			return true;
		else
			return false;
	}
	
	this.getFunctions = function () {
		return this.functionsList;
	}
	
	this.setSortedFunctionsList = function () {
		var keys = [];
		for (var i=0; i<this._allFunctionsData.length; i++) {
			if(this._allFunctionsData[i].keyword != "") keys.push(this._allFunctionsData[i].keyword);
		}
		keys.sort();
		this.functionsList = keys;
	}
	
	this.onCellValueChange = function(change, source) {
		if(firstLoadOnContainer){
			return;
		}
		else{
			parent.addModifiedSymbolOnTabHeader(_scriptDir, _scriptName);
		}
		if (source === 'loadData') {
			return; // don't save this change
		}
		var modifiedCell = change[0];
		var cellRowIx = modifiedCell[0];
		var cellColIx = modifiedCell[1];
		var oldValue = modifiedCell[2];
		var newValue = modifiedCell[3];

		if ((oldValue === undefined && newValue == "") || (oldValue == "" && newValue == ""))
			return;
		if (cellColIx > 1 && this.data.getDataAtCell(cellRowIx, 1) == "[Arguments]") {
			this.scanFullAndGetUpdatedFunctionAndParam();
		}
		if (cellColIx == 1) {
			//this.getFunctionAndParamData(cellRowIx);
			if ((oldValue == "loadSahi" && newValue != "loadSahi") || (oldValue != "loadSahi" && newValue == "loadSahi")
					|| (oldValue == "loadExcel" && newValue != "loadExcel") || (oldValue != "loadExcel" && newValue == "loadExcel")
					|| (oldValue == "[CreateKeyword]" && newValue != "[CreateKeyword]") || (oldValue != "[CreateKeyword]" && newValue == "[CreateKeyword]")
					|| (oldValue == "[Arguments]" && newValue != "[Arguments]") || (oldValue != "[Arguments]" && newValue == "[Arguments]")) {
				this.scanFullAndGetUpdatedFunctionAndParam();
			}
		} else if (cellColIx == 2) {
			this.getUpdatedFunctionAndParam(cellRowIx);
		}
		else if (cellColIx == 0 && (this.data.getDataAtCell(cellRowIx, 1) == "[CreateKeyword]" 
									|| this.data.getDataAtCell(cellRowIx, 1) == "loadSahi" 
									|| this.data.getDataAtCell(cellRowIx, 1) == "loadExcel")) {
			this.scanFullAndGetUpdatedFunctionAndParam();
		}
	}
	
	this.getFileName = function (filePath) {
		if(filePath.indexOf("\\") != -1){
			filePath = filePath.replace(/\\/g, "/");
		}
		var fileName = filePath.substring(filePath.lastIndexOf("/")+1);
		return fileName;
	}
	
	this.getFileNameAndPathRelative = function (filePath) {
		var filePathAndName = sahiSendToServer("/_s_/dyn/pro/TestCaseUI_breakPath?filePath="
				+ encodeURIComponent(filePath));
		filePathAndName = eval("(" + filePathAndName + ")");
		return filePathAndName;
	}
	
	this.setCenterLayoutHeight = function () {
		$('centerLayout').style.height = ((this.data.countRows()*27.5)+50)+ 'px';
	}
	
	this.setCenterLayoutWidth = function(){
		$(this.containerId).style.width = ((this.data.countCols()*100)+500)+ 'px';
		this.data.forceFullRender = true
		this.data.render();
		this.data.forceFullRender = false;
	}
	
	this.expandToFit = function() {
		$(this.containerId).style.height = ((this.data.countRows()*30)+50)+ 'px';
		$(this.containerId).style.width = ((this.data.countCols()*150)+500)+ 'px';		
	}
	
	this.onCellSelect = function (r1, c1, r2, c2) {
		currentRow = r1;
		currentRowEnd = r2;
		currentCol = c1;
		currentColEnd = c2;
		
		var selectedText = this.data.getDataAtCell(r1, c1);
		var url = "/_s_/dyn/pro/ScriptHelper_concatPaths?path1="+this._filePath+"&path2="+selectedText;
		var filePath = sahiSendToServer(url).replace(/\\/g, '/');
		var exists = sahiSendToServer("/_s_/dyn/pro/TestCaseUI_isFileExists?filePath=" + encodeURIComponent(filePath));
		if (exists == "false") {
			parent.setSelectedText("");
		} else {
			filePath = filePath.replace(_selectedScriptDir, "");
			parent.setSelectedText(filePath);
		}
		
		if(c2 == 1){
			this.setCenterLayoutHeight();
		}
		var fnViewTableRow = $('fnViewDiv').getElementsByTagName('TR');
		for(var i=0; i<fnViewTableRow.length; i++){
			var fnViewAllCell = fnViewTableRow[i].getElementsByTagName('TD');
			for (var j=0; j<fnViewAllCell.length; j++){
				if(fnViewAllCell[j].style.backgroundColor){
					fnViewAllCell[j].style.removeProperty('background-color');
				}
			}
		}
		var fnName = this.data.getDataAtCell(r2, 1);
		if(fnName !== undefined && fnName !== null && fnName != ""){
			fnName = fnName.replace(/^\s*|\s*$/g, ''); // trim
			if(fnName.indexOf("=") != -1 && fnName.indexOf("=") != fnName.length -1){
				var fnName = fnName.substring(fnName.indexOf("=")+1);
			}
			fnName = this.resolveFnName(fnName);
		}
		else return;
		var fnView = document.getElementById('fnViewDiv');
		if(fnName === undefined || fnName == null || fnName == "" || !(this.isValidFunction(fnName) || this.isSahiApi(fnName))) return;
		if(fnName == "[Data]"){
			var params = this.getAssociatedParams(r2, c2);
		}
		else{
			var params = this.getParams(fnName);
		}
		var functionsAndParamsFilePath = this.getFunctionsAndParamsFilePath(fnName);
		functionsAndParamsFilePath = functionsAndParamsFilePath.toString();
		var refactorFilePathAndName = this.getFileNameAndPathRelative(functionsAndParamsFilePath);
		var refactorFileName = refactorFilePathAndName["file"];
		var refactorFilePath = refactorFilePathAndName["path"];
		var onlyFileName = this.getFileName(functionsAndParamsFilePath);
		var table = "<table>";
		var linkHref = "";
		if(refactorFileName.indexOf(".sah")!=-1){
			linkHref = "/_s_/spr/editor/refactor/refactor.htm?dir=" + encodeURIComponent(refactorFilePath) + "&file=" + encodeURIComponent(refactorFileName);
		}else if(refactorFileName.indexOf(".xls")!=-1){
			linkHref = "/_s_/spr/editor/spreadsheet/spreadsheet.html?dir=" + encodeURIComponent(refactorFilePath) + "&file=" + encodeURIComponent(refactorFileName);
		}
		if(functionsAndParamsFilePath.indexOf('http') == 0){
			linkHref = functionsAndParamsFilePath;
		}
		if(fnName == "loadSahi" || fnName == "loadExcel" || fnName == "[Arguments]" || fnName == "[Keyword]" || fnName == "[Data]"){
			table += "<tr><td colspan='3'>Sahi keyword</td></tr>";
		}
		else if(fnName == "[SetUp]" || fnName == "[TearDown]"){
			var setupType = this.data.getDataAtCell(r2, 0);
			setupType = setupType==undefined ? "" : setupType;
			table += "<tr>";
			table += "<td>Sahi function:</td>";
			table += "<td colspan='2' onclick='ss.data.selectCell(" + r2 + "," + 0 + ")'>" + setupType + "</td>";
			table += "</tr>";
		}
		else if(fnName == "[Documentation]"){
			var tcName = this.data.getDataAtCell(r2, 0);
			tcName = tcName==undefined ? "" : tcName;
			table += "<tr><td>TestCase:</td><td colspan='2' onclick='ss.data.selectCell(" + r2 + "," + 0 + ")'>" + tcName + "</td></tr>";
		}
		else if(fnName == "[CreateKeyword]"){
			var ckDes = this.data.getDataAtCell(r2, 0);
			ckDes = ckDes==undefined ? "" : ckDes;
			table += "<tr><td>Create Keyword Description:</td><td colspan='2' onclick='ss.data.selectCell(" + r2 + "," + 0 + ")'>" + ckDes + "</td></tr>";
		}
		else if(this.isSahiApi(fnName)){
			var sApi = this.data.getDataAtCell(r2, 0);
			sApi = sApi==undefined ? "" : sApi;
			table += "<tr><td>Sahi Api</td><td colspan='2' onclick='ss.data.selectCell(" + r2 + "," + 0 + ")'>" + sApi + "</td></tr>";
		}
		else{
			if(functionsAndParamsFilePath == "Keywords created on the fly in sheet")
				table += "<tr><td>File:</td><td colspan='2'>" + functionsAndParamsFilePath + "</td></tr>";
			else{
				if(functionsAndParamsFilePath.indexOf('http') != 0){
					if (!this.isFunctionIncluded(fnName)) 
						table += "<tr><td>File:</td><td style='background-color:#F2F5A9' colspan='1'>" + "<a href=#" + " onClick='addFileTabOnParent(" + this.quoted(refactorFilePath) + "," + this.quoted(refactorFileName) + ")' title='" + functionsAndParamsFilePath + "'>" + onlyFileName + "</a>" + "</td><td><button onClick='ss.includeFile(\""+ functionsAndParamsFilePath +"\");'>Include</button></td></tr>";
					else
						table += "<tr><td>File:</td><td colspan='1'>" + "<a href=#" + " onClick='addFileTabOnParent(" + this.quoted(refactorFilePath) + "," + this.quoted(refactorFileName) + ")' title='" + functionsAndParamsFilePath + "'>" + onlyFileName + "</a>" + "</td><td><button onClick='ss.includeFile(\""+ functionsAndParamsFilePath +"\");'>Include</button></td></tr>";
				} else{
					if (!this.isFunctionIncluded(fnName))
						table += "<tr><td>File:</td><td style='background-color:#F2F5A9' colspan='1'>" + "<a href=#" + " onClick='addFileTabOnParent(" + this.quoted(linkHref) + ")' title='" + functionsAndParamsFilePath + "'>" + onlyFileName + "</a>" + "</td><td><button onClick='ss.includeFile("+functionsAndParamsFilePath+");'>Include</button></td></tr>";
					else
						table += "<tr><td>File:</td><td colspan='1'>" + "<a href=#" + " onClick='addFileTabOnParent(" + this.quoted(linkHref) + ")' title='" + functionsAndParamsFilePath + "'>" + onlyFileName + "</a>" + "</td><td><button onClick='ss.includeFile("+functionsAndParamsFilePath+");'>Include</button></td></tr>";
				}
			}
		}
		table += "<tr><td width='100px;'>Function Name:</td><td colspan='2' onclick='ss.data.selectCell(" + r2 + "," + 1 + ")'>" + fnName +"</td></tr>";
		if (params.length == 0 && fnName != "[Arguments]") {
			table += "<tr><td>Arguments:</td><td>-</td></tr>";
		} else {
			for (var i=0; i<params.length; i++) {
				var celldata = this.data.getDataAtCell(r2, (i+2));
				if((celldata!=null)&&(celldata!=undefined)&&(celldata!="")){
					if((celldata.indexOf(".sah")!=-1)||(celldata.indexOf(".xls")!=-1)||(celldata.indexOf(".xlsx")!=-1)){
						celldata = celldata.replace(/"/g,"");
						celldata = celldata.replace(/\\/g, "/");
						var isFullPath = sahiSendToServer("/_s_/dyn/pro/TestCaseUI_isFileExists?filePath=" + encodeURIComponent(celldata));
						if (isFullPath == "true") {
							refactorFilePathAndName = this.getFileNameAndPathRelative(celldata);
						} else {
							refactorFilePathAndName = this.getFileNameAndPathRelative(path + celldata);
						}
						refactorFileName = refactorFilePathAndName["file"];
						refactorFilePath = refactorFilePathAndName["path"];
						linkHref = "/_s_/spr/editor/";
						linkHref += (celldata.indexOf(".sah")!=-1)? "refactor/refactor.htm?dir=" : "spreadsheet/spreadsheet.html?dir=" ;
						linkHref += encodeURIComponent(refactorFilePath) + "&file=" + encodeURIComponent(refactorFileName);
						celldata = "<a href=#" + " onClick='addFileTabOnParent(" + this.quoted(refactorFilePath) + "," + this.quoted(refactorFileName) + ")' title='" + refactorFilePath + refactorFileName + "'>" + celldata + "</a>";
					}
				}
				celldata = celldata != undefined ? celldata : "";
				table += "<tr><td>" + (i==0?"Arguments:":"") + "</td><td onclick='ss.data.selectCell(" + r2 + "," + (i+2) + ")'>" + params[i] + "</td><td onclick='ss.data.selectCell(" + r2 + "," + (i+2) + ")'>" + celldata + "</td></tr>";
			}
		}
		if(fnName == "[Documentation]" || fnName == "[Arguments]"){
			table += "<tr><td colspan='3'> Keyword [Documentation] and [Arguments] can have any number of arguments."
		}
		table += "</table>";
		fnView.innerHTML = table;
		if(c2 == 1){
			var fnViewTableCell = fnViewTableRow[c2].getElementsByTagName('TD')[1];
			fnViewTableCell.style.backgroundColor = '#F2F5A9';
		}
		else if(c2 == 0 && (fnName == "[Documentation]" || fnName == "[CreateKeyword]" || fnName == "[SetUp]" || fnName == "[TearDown]")){
			var fnViewTableCell = fnViewTableRow[c2].getElementsByTagName('TD')[1];
			fnViewTableCell.style.backgroundColor = '#F2F5A9';
		}
		else if(c2 > 1 && c2 < params.length+2){
			var fnViewTableCell1 = fnViewTableRow[c2].getElementsByTagName('TD')[1];
			var fnViewTableCell2 = fnViewTableRow[c2].getElementsByTagName('TD')[2];
			fnViewTableCell1.style.backgroundColor = '#F2F5A9';
			fnViewTableCell2.style.backgroundColor = '#F2F5A9';
		}
	}
	
	this.isFunctionIncluded = function (fnName) {
		var ar = ["[Documentation]", "loadSahi", "loadExcel", "[CreateKeyword]", 
		          "[Arguments]" , "[Keyword]", "[Data]", "[SetUp]", "[TearDown]"];
		if (jQuery.inArray(fnName, ar) != -1) return true;
		for (var i=0; i<this._allFunctionsData.length; i++) {
			if (jQuery.inArray(this._allFunctionsData[i].desc, this._includedFiles) != -1 
					&& this._allFunctionsData[i].keyword == fnName) {
				return true;
			}
		}
		return false;
	}
	
	this.isValidFunction = function (fnName) {
		var fnList = this.getFunctions();
		for (var i=0; i<fnList.length; i++){
			if(this.isFunctionMatch(fnName, fnList[i])){
				return true;
			}
		}
		return false;
	}

	this.isFunctionMatch = function (fnName, fnStored){
		if(fnName === undefined || fnName === null || fnName == "")	return;
		if(/\s/g.test(fnName)){
			fnName = this.resolveFnName(fnName);
		}
		return (fnName == fnStored);
	}
	
	this.resolveFnName = function (fnName){
		fnName = fnName.replace(/^\s*|\s*$/g, ''); // trim
		var arr = fnName.split(/\s/);
		 for(var i=0; i<arr.length; i++) {
			if(i!=0){
				arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
			}
		 }
		 fnName = arr.join("");
		 return fnName;
	}
	
	this.isValidArgument = function (row, col, functionName) {
		if (functionName == "" || functionName === undefined || functionName == null || !this.isValidFunction(functionName) || this.getParams(functionName) === undefined) {
			return false;
		}
		else{
			var params = this.getParams(this.resolveFnName(functionName));
			var paramLength = params.length + 1;
			if(col <= paramLength){
				return true	;
			}
			return false;
		}
		return false;
	}
	
	this.getUpdatedFunctionAndParam = function (indexRow) {
		if (this.data.getDataAtCell(indexRow, 1) == "loadSahi" || this.data.getDataAtCell(indexRow, 1) == "loadExcel" || this.data.getDataAtCell(indexRow, 1) == "[CreateKeyword]") {
			this.scanFullAndGetUpdatedFunctionAndParam();
		}
	}

	/*
	this.getFunctionAndParamData = function (row) {
		var key = this.data.getDataAtCell(row, 1);
		var params = this.getParams(key);
		if (params == null) return;
		//for ( var i = 0; i < params.length; i++) {
			// do not delete
			// $("#example").handsontable('setDataAtCell', row, (i+2), params[i]);
		//}
	}
	*/
	
	this.scanFullAndGetUpdatedFunctionAndParam = function () {
		this.setCenterLayoutHeight();
		var isArgumentNeeded = false;
		this._includedFiles = [];
		for ( var i = 0; i < this.data.countRows(); i++) {
			var isLoadFile = true;
			if (this.data.getDataAtCell(i, 0) !== null && this.data.getDataAtCell(i, 0) !== undefined 
					&& this.data.getDataAtCell(i, 0).indexOf("//") != 0 
					&& (this.data.getDataAtCell(i, 1) == "loadSahi" || this.data.getDataAtCell(i, 1) == "loadExcel")) {
				var file = this.data.getDataAtCell(i, 2);
				if (file == "$filePath" || file == null || file == "" || file === undefined)//(file == null || file == "" || file == "$filePath")
					isLoadFile = false;
				else if((file.charAt(0)=="\"" && file.charAt(file.length-1)=="\"") || (file.charAt(0)=="'" && file.charAt(file.length-1)=="'")){
					file = file.substring(1, file.length-1);
				}
				if(isLoadFile == true){
					var url = "/_s_/dyn/pro/ScriptHelper_concatPaths?path1="+this._filePath+"&path2="+file;
					var filePath = sahiSendToServer(url).replace(/\\/g, '/');
					var includedFiles = sahiSendToServer("/_s_/dyn/pro/ScriptHelper_getIncludedFiles?path="+filePath);
					var included = includedFiles == "" ? [] : includedFiles.replace(/\\/g, '/').split(",");
					this._includedFiles = this._includedFiles.concat(included);
					this._includedFiles.push(filePath);
					var funcData = [{keyword : "", desc : "", param: []}];
					for (var j=0; j<this._allFunctionsData.length; j++) {
						if (jQuery.inArray(this._allFunctionsData[j].desc, this._includedFiles) != -1) {
							funcData.splice(0,0,{keyword : this._allFunctionsData[j].keyword, desc : this._allFunctionsData[j].desc, param: this._allFunctionsData[j].param});
						} else {
							funcData.push({keyword : this._allFunctionsData[j].keyword, desc : this._allFunctionsData[j].desc, param: this._allFunctionsData[j].param});
						}
					}
					this._allFunctionsData = funcData;
					
				}
			}
			
			if (this.data.getDataAtCell(i, 1) == "[CreateKeyword]") {
				if(this.data.getDataAtCell(i, 0) !== null && this.data.getDataAtCell(i, 0) !== undefined){
					if(this.data.getDataAtCell(i, 0).indexOf("//") == 0)
						continue;
				}
				var keywordName = this.data.getDataAtCell(i, 2);
				if (keywordName == null || keywordName == "" || keywordName === undefined)
					continue;
				keywordName = this.resolveFnName(keywordName);
				isArgumentNeeded = true;
			}
			if (this.data.getDataAtCell(i, 1) == "[Arguments]" && isArgumentNeeded == true) {
				var argumentsTemp1 = this.data.getDataAtRow(i);
				var argumentsTemp = [];
				for (var k = 0; k < argumentsTemp1.length; k++) {
					argumentsTemp.push(argumentsTemp1[k]);
				}
				argumentsTemp.splice(0, 2);
				var arguments = [];
				for (var j = 0; j < argumentsTemp.length; j++) {
				    if (argumentsTemp[j] !== "" && argumentsTemp[j] !== null && argumentsTemp[j] !== undefined)
				    	arguments.push(argumentsTemp[j]);
				}
				this._allFunctionsData.push({keyword : keywordName, desc : "Keyword created on the fly in sheet", param: arguments});
				isArgumentNeeded = false;
			}
			
		}
		this.setSortedFunctionsList();
		this.data.render();
	}
	
	this.getParams = function (key) {
		for (var i=0; i<this._allFunctionsData.length; i++) {
			if (this._allFunctionsData[i].keyword == key) return this._allFunctionsData[i].param;
		}
		return false;
	}
	
	this.getFunctionsAndParamsFilePath = function (key) {
		for (var i=0; i<this._allFunctionsData.length; i++) {
			if (this._allFunctionsData[i].keyword == key) return this._allFunctionsData[i].desc;
		}
		return false;
	}
	
	this.getDataAsCSV = function(){
		var csvWordSeperator = sahiSendToServer("/_s_/dyn/Configuration_getCSVWordSeparator");
		var ar2d = this.data.getData();
		var quotedAr = [];
		for (var i=0; i<ar2d.length; i++) {
			var row = ar2d[i];
			var quotedRow = [];
			for (var j=0; j<row.length; j++) {
				quotedRow[j] = this.quoteForCSV(row[j]);
			}
			quotedAr.push(quotedRow);
		}

		var rowStrs = [];
		for (var i=0; i<ar2d.length; i++) {
			var row = quotedAr[i];
			var rowStr = row.join(csvWordSeperator);
			var re = new RegExp("["+csvWordSeperator+"]+$");
			rowStr = rowStr.replace(re, '');
			rowStrs.push(rowStr);
		}
		return rowStrs.join("\n");
	}
	
	this.quoted = function (s) {
		if (s == null || s == "") return "";
		return '"' + s.replace(/"/g, '\\"') + '"';
	}

	this.quoteForCSV = function (s) {
		if (s == null || s == "") return "";
		return '"' + s.replace(/"/g, '""') + '"';
	}

	this.parseCSVFile = function(contents, wordSeparator) {
		if (!wordSeparator)
			wordSeparator = ",";
		var lines = contents.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
				.split("\n");
		var data = []; // new Array();
		for ( var i = 0; i < lines.length; i++) {
			if (lines[i].replace(/^\s*|\s*$/g, '') == "")
				continue;
			var words = this.splitUnQuoted(lines[i], wordSeparator); // lines[i].split(",");
			for ( var j = 0; j < words.length; j++) {
				var w = words[j];
				w = w.replace(/^\s*|\s*$/g, '');
				if (w.match(/^".*"$/)) {
					// words[j] = eval(w);
					words[j] = w.substring(1, w.length - 1);
				}
			}
			data[data.length] = words;
		}
		return data;
	}
	
	this.splitUnQuoted = function(s, wordSeparator) {
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
	
	this.setContentForTestCaseAndFocus = function(r){
		this.data.setDataAtCell(r, 0, "Testcase Name");
		this.data.setDataAtCell(r, 1, "[Documentation]");
		this.data.setDataAtCell(r, 2, "Testcase Description");
		this.data.selectCell(r, 0, r, 2);
	}
	
	this.addTestCase = function(){
		if(currentRow === null){
			var firstBlankRow = this.data.countRows() - this.data.countEmptyRows(true);
			if(firstBlankRow == 1){
				this.data.alter('insert_row', firstBlankRow, 1);
				this.setContentForTestCaseAndFocus(firstBlankRow);
			}
			else{
				this.data.alter('insert_row', firstBlankRow, 2);
				this.setContentForTestCaseAndFocus(firstBlankRow+1);
			}
		}
		else if (this.data.isEmptyRow(currentRow) && (this.data.isEmptyRow(currentRow-1) || currentRow == 1)){
			if(currentRow == 1)
				this.data.alter('insert_row', currentRow, 1);
			this.setContentForTestCaseAndFocus(currentRow);
		}
		else if(this.data.isEmptyRow(currentRow) && !this.data.isEmptyRow(currentRow-1)){
			this.data.alter('insert_row', currentRow, 2);
			this.setContentForTestCaseAndFocus(currentRow+1);
		}
		else{
			this.data.alter('insert_row', currentRow, 2);
			if(this.data.isEmptyRow(currentRow-1)){
				this.setContentForTestCaseAndFocus(currentRow);
			}
			else{
				if(currentRow == 1)
					this.setContentForTestCaseAndFocus(currentRow);
				else
					this.setContentForTestCaseAndFocus(currentRow+1);
			}
		}
		this.data.render();
	}
	
	this.setContentForLoadSahiAndFocus = function(r){
		this.data.setDataAtCell(r, 0, "");
		this.data.setDataAtCell(r, 1, "loadSahi");
		this.data.setDataAtCell(r, 2, "$filePath");
		this.data.selectCell(r, 2, r, 2);
	}

	this.LoadSahiLib = function(){
		if(currentRow === null){
			var firstBlankRow = this.data.countRows() - this.data.countEmptyRows(true);
			this.data.alter('insert_row', firstBlankRow, 1);
			this.setContentForLoadSahiAndFocus(firstBlankRow);
		}
		else{
			this.data.alter('insert_row', currentRow, 1);
			this.setContentForLoadSahiAndFocus(currentRow);
		}
	}
	
	this.showFnInfoDiv = function() {
		jQuery('#fnInfoDiv').window('open');
		if (currentRow == null) {
			$('fnViewDiv').innerHTML = "<div>Click on any cell to view its details.</div>";
		}
	}
	
	this.showImportCSVDiv = function() {
		jQuery('#importCSVDiv').window('open');
	}
	
	this.setContentForImportCSV = function(r, text2D){
		var row = r;
		for (var i=0; i<text2D.length; i++) {
			this.data.alter('insert_row', row, 1);
			var line = text2D[i];
			for (var j=0; j<line.length; j++) {
				var cellValue = line[j];
				if (cellValue!=null) cellValue = cellValue.replace(/^\s*|\s*$/g, '')
				this.data.setDataAtCell(row, j, cellValue);
			}
			row++;
		}
	}
	
	this.importAsCSV = function() {
		var text = $("importText").value;
		var lines = text.split('\n');
		var text2D = [];
		for (var i=0; i<lines.length; i++) {
			var ar = [];
			var fName = lines[i].substring(0, lines[i].indexOf('('));
//			if (fName == "") return;
			if (fName.indexOf("//") == 0) {
				ar.push("//");
				ar.push(fName.substring(2));
			} else {
				ar.push("");
				ar.push(fName);
			}
			if (fName.indexOf("_") == 0) {
				var paramAr = lines[i].substring(lines[i].indexOf('(')+1, lines[i].lastIndexOf(')'));
			} else {
				var paramAr = lines[i].substring(lines[i].indexOf('(')+1, lines[i].lastIndexOf(')')).split(",");
			}
			ar = ar.concat(paramAr);
			text2D.push(ar);
		}
		if (currentRow === null) {
			var firstBlankRow = this.data.countRows() - this.data.countEmptyRows(true);
			this.setContentForImportCSV(firstBlankRow, text2D);
		} else {
			this.setContentForImportCSV(currentRow, text2D);
		}
	}
	
	this.addRowAbove = function(){
		if(currentRow == null)	return;
		this.data.alter('insert_row', currentRow, 1);
	}
	
	this.addRowBelow = function(){
		if(currentRow == null)	return;
		this.data.alter('insert_row', currentRow+1, 1);
	}
	
	this.deleterow = function(){
		if(currentRow == null)	return;
		var numOfSelectedRow = Math.abs(currentRow - currentRowEnd) + 1;
		if (currentRowEnd >= currentRow){
			this.data.alter('remove_row', currentRow, numOfSelectedRow);
			this.data.selectCell(currentRow, currentCol, currentRow, currentCol);
		}
		else{
			this.data.alter('remove_row', currentRowEnd, numOfSelectedRow);
			this.data.selectCell(currentRowEnd, currentCol, currentRowEnd, currentCol);
		}
	}
	
	this.commentUncomment = function(){
		if(currentRow == null)	return;
		var loopStart;
		var loopEnd;
		var doComment = false;
		var dataAtFirstCol;
		if (currentRowEnd >= currentRow){
			loopStart = currentRow;
			loopEnd = currentRowEnd + 1;
		}
		else{
			loopStart = currentRowEnd;
			loopEnd = currentRow + 1;
		}
		for(var i=loopStart; i<loopEnd; i++){
			dataAtFirstCol = this.data.getDataAtCell(i, 0);
			if(dataAtFirstCol == "" || dataAtFirstCol === null || dataAtFirstCol === undefined || this.data.getDataAtCell(i, 0).indexOf("//") != 0){
				doComment = true;
				break;
			}
		}
		if(doComment){
			for(var i=loopStart; i<loopEnd; i++){
				dataAtFirstCol = this.data.getDataAtCell(i, 0);
				if(this.data.getDataAtCell(i, 0) === null || dataAtFirstCol === undefined || dataAtFirstCol == ""){
					this.data.setDataAtCell(i, 0, "//");
				}
				else{
					this.data.setDataAtCell(i, 0, "//" + dataAtFirstCol);
				}
			}
		}
		else{
			for(var i=loopStart; i<loopEnd; i++){
				dataAtFirstCol = this.data.getDataAtCell(i, 0);
				this.data.setDataAtCell(i, 0, dataAtFirstCol.substring(2));
			}
		}
	}
	
	this.getAllApi = function() {
		if (!this.allAPIs) {
			var allSahiApi = sahiSendToServer("/_s_/dyn/pro/SahiAPIHelper_getAllSahiApi");
			this.allAPIs = eval(allSahiApi);
		} 
		return this.allAPIs;
	}
	
	this.isSahiApi = function(api){
		return jQuery.inArray(api, this.getAllApi()) != -1;
	}
	
	this.wrap = function (fn) {
		var el = this;
		return function(){return fn.apply(el, arguments);};
	}
}

function URLParser (url){
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
