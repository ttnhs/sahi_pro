jQuery.fn.combobox.defaults.filter = function(q,row){
	q = q.toLowerCase();
	var opts = jQuery(this).combobox('options');
	return row[opts.textField].toLowerCase().indexOf(q) != -1;
};
	
jQuery.fn.combobox.defaults.keyHandler.enter = function(e){
	jQuery(this).combobox('hidePanel');
};