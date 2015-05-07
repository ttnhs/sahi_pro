$export("yodlee.util.Nothing");
Date.prototype.setDateString = function(dateString) {
	this.dateString = dateString;
};
Date.prototype.__base__toDateString = Date.prototype.toDateString;
Date.prototype.toDateString = function() {
	return this.dateString ? this.dateString : this.__base__toDateString();
};
Date.prototype.__base__toString = Date.prototype.toString;
Date.prototype.toString = function() {
	return this.dateString ? this.dateString : this.__base__toString();
};
Date.prototype.__base__toUTCString = Date.prototype.toUTCString;
Date.prototype.toUTCString = function() {
	return this.dateString ? this.dateString : this.__base__toUTCString();
}