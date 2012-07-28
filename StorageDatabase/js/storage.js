"use strict";

var StorageDB = function(type) {
	// this.db = {}  = this.init(storageType);
	var db = {};
	
	if (type == 1) {
		db = win.sessionStorage;
	} else {
		db = win.localStorage;
	}
	
	return {
		create: function(args) {
			var cn = db;

			console.log(args.length);
			
			var insert = function(key, val) {
				cn.setItem(key, val);
			};
		
			var type = this.getObjectType(args);
			var len = getKeyProps(args).length;
		
			var result,
				counter = 0;
		
			if (type == 3) {
				var okey = "",
					val  = "";
				
				for (var key in args) 
				{
					okey = key;
					val = args[key];
					
					insert(okey, val);
					counter++;
				}
				result = {
					rows: this.rowsChanged(1, counter),
					success: 1
				};
			}	
		return result;
		},
		select: function(args) {
			var cn = db,
				results = {};
		
			// SINGLE
			var scalar = function(search) {
				return cn.getItem(search);
			};
		
			// BATCH
			var reader = function(arr, handler) {
			
				if (arr.length < 1) {
					return handler(1);
				};
			
				var keys = [],
					vals = [];
				
				for (var i = 0; i < arr.length; i++ ) {
					keys.push(arr[i]);
					vals.push(cn.getItem(arr[i]));
				}
				return [keys, vals];
			};
		
			switch( this.getObjectType(args) ) {
				case 1:
					results = scalar(args);
					break;
				case 3:
					results = reader(args, this.errorHandler);
					break;
				default:
					break;
			}
		
			if (!results) {
				return this.errorHandler(0);
			};
		
			if (getKeyProps(results) < 1) {
				return this.errorHandler(1);
			};
		
			return results;
		},
		clear: function(args) {
			var counter = 0;

			if (!args) {
				
				db.clear();

				console.log(db);
				
				return true;
			} else {
			
				var len = args.length;
				var sortedList = args.sort();
			
				for (var i = 0; i < len; i++) {
					db.removeItem(sortedList[i]);
					counter++;
				}
			
			return {
				rows: this.rowsChanged(0, counter),
				success: 1
			};
			
			}
			return false;
		},
		sort: function(arr) {
			return arr.sort();
		},
		len: function() {
			return db.length;
		},
		rowsChanged: function(action, num) {
			var msg  = "";
		
			if (num > 0) {
				if (action == 1) {
					return num + " rows created! ";
				} else if(action == 2) {
					return num + " rows modified!";
				} else {
					return num + " rows removed!";
				}
			}
		},
		getKey: function(value) {
			return db.key(value);
		},
		getObjectType: function(obj) {
			var action = 0;
		
			if (obj == null) {
				return action;
			}
		
			switch( typeof(obj) ) 
			{
				case "object":
					if ( obj instanceof Array ) { action = 0;} 
						else { action = 3; }
				
					action = 3
					break;
				case "string":
					action = 1;
					break;
				case "null":
				case "undefined":
				case '':
				default:
					this.errorHandler(0);
					break;
			}
			return action;
		},
		errorHandler: function(e) {
			var msg = "";
		
			switch(e) 
			{
				case 0:
					msg = "Empty Result";
					break;
				case 1:
					msg = "Empty Query";
					break;
				default:
					msg =  "Invalid Input Type";
					break;
			}
			return msg;
		},
		debugger: function(action) {
			var cn = db,
				results;
			
			/* 
			 *
			 *	UPDATED ON EVERY CHANGE TO STORAGE
			 *			NEXT VERSION
			 */
			//var settings = {};
			
			var getAll = function() {
			
				var keys = [],
					vals = [];
				
				for ( var i = 0; i <= cn.length-1; i++ ) 
				{	
					var oKey = cn.key(i);
						
					keys.push( oKey );
					vals.push( cn.getItem(oKey) );
				}
				return [keys, vals];
			};
		
			var getKeys = function() {
				return getAll()[0];
			};
		
			var getValues = function() {
				return getAll()[1];
			};
			
			/*
			 *
			 *	NEXT VERSION
			 *
			var results = {},
				oldValue = "",
				prevQuery = "";
			*/
		
			switch (action) {
				case 'keys':
					results = getKeys();
					break;
				case 'values':
					results = getValues();
					break;
				case 'all':
					results = getAll();
					break;
				default:
					results = this.errorHandler(1)
					break;
			}
			return results;
		}
	}
};
