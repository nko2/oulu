/**
 * Module dependencies.
 */

/* Temporary in memory database for User Sessions */
var _sessions = [],
    lib = module.exports = {},
    sys = require('sys'),
    config = require('./safe-config.js'),
	cradle, cradle_con, users_db, db_name;

if(config.couchdb) {
	console.log('Enabling CouchDB...');
	cradle = require('cradle');
	cradle_con = new(cradle.Connection)(config.couchdb.host, config.couchdb.port, config.couchdb.options);
	db_name = config.couchdb.db || 'users';
	
	function setup(call) {
		var undefined, db = cradle_con.database(db_name);
		db.exists(function(err, exists) {
			if(err) return call(err);
			console.log('CouchDB database ' + db_name + ': ' + (exists ? 'exists' : 'MISSING') );
			if(!exists) {
				console.log('Creating new database...');
				db.create();
			}
			call(undefined, db);
		});
	}
	
	setup(function(err, db) {
		if(err) {
			console.log('Error: ' + sys.inspect(err));
			return;
		}
		if(db) {
			console.log('CouchDB ready. Relax.');
			users_db = db;
			return;
		}
		console.log('Error: Missing database?');
	});
}

/* Session constructor */
function Session (apikey) {
	this.apikey = apikey;
}

lib.Session = Session;

/* Join a socket to this session */
Session.prototype.join = (function(socket, type) {
	if( (type === 'browser') || (type === 'shell') ) this[type] = socket;
	return this;
});

/* Join a socket to this session */
Session.prototype.part = (function(socket) {
	if(socket === this.browser) delete this.browser;
	else if(socket === this.shell) delete this.shell;
	return this;
});

/* Get new apikey */
function get_next_free_apikey(fn) {
	
	function random_string(length) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
			length = length || 32,
			out = '',
			i=0;
		for (; i<length; i++) out += chars[Math.floor(Math.random() * chars.length)];
		return out;
	}
	
	var undefined, 
	    error,
		apikey, 
		counter = 0,
		max_counter = config.max_loop_counter || 100;
	
	// If couchdb is enabled
	if(users_db) {
		function loop(next) {
			counter++;
			if(counter >= max_counter) next(new Error('Maximum loop amount exceeded'));
			var apikey = random_string(32);
			users_db.get(apikey, function (err, doc) {
				if(err || (!doc)) next(undefined, apikey);
				else loop(next);
			});
		}
		
		loop(function(err, apikey) {
			if(err) {
				fn && fn(err);
			} else {
				fn && fn(undefined, apikey);
			}
		});
		
	// ..or memory only:
	} else {
		do {
			counter++;
			if(counter >= max_counter) {
				error = new Error('Maximum loop amount exceeded');
				break;
			}
			apikey = random_string(32);
		} while(_sessions[apikey]);
		fn && fn(error, apikey);
	}
}

/* Create new apikey */
lib.create = (function(fn) {
	// FIXME: Implement couchdb support
	var undefined;
	get_next_free_apikey(function(err, apikey) {
		if(err) {
			fn && fn(err);
			return;
		}
		// If couchdb is enabled
		if(users_db) {
			users_db.save(apikey, {'apikey':apikey}, function (err, res) {
				if(err) {
					fn&&fn(err);
					return;
				}
				
				if(_sessions[apikey] === undefined) {
					_sessions[apikey] = new Session(apikey);
				}
				
			});
		} else {
			if(_sessions[apikey] === undefined) {
				_sessions[apikey] = new Session(apikey);
			}
			fn && fn(undefined, _sessions[apikey]);
		}
	});
});

/* Fetch existing session */
lib.fetch = (function(apikey, fn) {
	// If couchdb is enabled
	if(users_db) {
		if(_sessions[apikey]) {
			fn(undefined, _sessions[apikey] );
		} else {
			users_db.get(apikey, function (err, doc) {
				if(err) {
					fn&&fn(err);
					return;
				}
				fn&&fn(undefined, new Session(apikey));
			});
		}
	} else {
		var undefined;
		if(!_sessions[apikey]) {
			fn(new Error('apikey is not defined!'));
		} else {
			fn(undefined, _sessions[apikey] );
		}
	}
});

/* EOF */
