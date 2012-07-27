/*
 *		GLOBAL
 *
 */
var win = window;

var getKeyProps = function(obj){
	var keys = [],
		k;
		
	for (k in obj) {
		if (Object.prototype.hasOwnProperty.call( obj, k)) {
			//console.log(k + " : " + obj[k]);
			keys.push(k);
		}
	}
	return keys;
};