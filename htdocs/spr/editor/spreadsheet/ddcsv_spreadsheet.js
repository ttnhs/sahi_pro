SpreadSheet = function(containerId) {
	this.containerId = containerId;
	var ss = this;
	var currentRow = null;
	var currentRowEnd = null;
	var currentCol = null;
	var currentColEnd = null;
	
	this.initProperties = function () {
		this.properties = {
			minRows : 10,
			minCols : 10,
			manualColumnResize : true,
			minSpareRows : 6,
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
				else {
					cellProperties.renderer = ss.wrap(ss.cellRenderer);
				}
				return cellProperties;
			},
			colHeaders : true,
			contextMenu : true,
			rowHeaders: true,
			afterChange : ss.wrap(ss.onCellValueChange),
			afterSelectionEnd : ss.wrap(ss.onCellSelect)
		}
	}
	
	this.onCellValueChange = function(change, source) {
		if(firstLoadOnContainer){
			return;
		}
		else{
			parent.addModifiedSymbolOnTabHeader(_scriptDir, _scriptName);
		}
	}
	
	this.onCellSelect = function (r1, c1, r2, c2) {
		currentRow = r1;
		currentRowEnd = r2;
		currentCol = c1;
		currentColEnd = c2;
	}

	this.init = function() {
		this.initProperties();
		var data = [
				[ "#script","tags" , , , ],
				[ "", , , , ],
				[ "", , , , ],
				[ "", , , , ],
				[ "", , , , ], 
				[ "", , , , ] ];
		this.container = jQuery('#' + this.containerId);
		this.properties.data = data;
		this.container.handsontable(this.properties);
		this.data = this.container.data('handsontable');
	}
	
	this.firstRowRenderer = function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.TextCell.renderer.apply(this, arguments);
		td.style.fontWeight = 'bold';
		td.style.color = 'grey';
		td.style.width = '80px';
		td.style.background = '#F4F4F4';
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
	
	this.getFileName = function (filePath) {
		if(filePath.indexOf("\\") != -1){
			filePath = filePath.replace(/\\/g, "/");
		}
		var fileName = filePath.substring(filePath.lastIndexOf("/")+1);
		return fileName;
	}
	
	this.updateData = function(data) {
		this.data.loadData(data);
		this.expandToFit();
	}
	
	this.expandToFit = function() {
		$(this.containerId).style.height = ((this.data.countRows()*30)+50)+ 'px';
		$(this.containerId).style.width = ((this.data.countCols()*150)+500)+ 'px';	
	}
	
	this.cellRenderer = function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.TextCell.renderer.apply(this, arguments);
		if (this.data && this.data.getDataAtCell(row, 0) != "" && this.data.getDataAtCell(row, 0) !== null && this.data.getDataAtCell(row, 0) !== undefined && this.data.getDataAtCell(row, 0).indexOf("//") == 0) {
			td.style.color = "#ccc";
		}
		else if (this.data && this.data.getDataAtCell(row, 0) != "" && this.data.getDataAtCell(row, 0) !== null && this.data.getDataAtCell(row, 0) !== undefined && this.data.getDataAtCell(row, 0) == "#script") {
			td.style.fontWeight = 'bold';
			td.style.color = 'grey';
			td.style.width = '80px';
			td.style.background = '#F4F4F4';
		}
	}
	
	this.wrap = function (fn) {
		var el = this;
		return function(){return fn.apply(el, arguments);};
	}
}