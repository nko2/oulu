/**
 * Module dependencies.
 */

/* Temporary in memory database for User Sessions */
var _sessions = [],
    lib = module.exports = {},
    config = require('./safe-config.js'),
	cradle, cradle_con, users_db;

if(config.couchdb) {
	cradle = require('cradle'),
	cradle_con = new(cradle.Connection)(config.couchdb.host, config.couchdb.port, config.couchdb.options),
	users_db = connection.database('users');
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
	
	// FIXME: Implement couchdb support
	var undefined, apikey;
	do {
		apikey = random_string(32);
	} while(_sessions[apikey]);
	fn && fn(undefined, apikey);
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
		if(_sessions[apikey] === undefined) {
			_sessions[apikey] = new Session(apikey);
		}
		fn && fn(undefined, _sessions[apikey]);
	});
});

/* Fetch existing session */
lib.fetch = (function(apikey, fn) {
	// FIXME: Implement couchdb
	var undefined;
	if(!_sessions[apikey]) {
		fn(new Error('apikey is not defined!'));
	} else {
		fn(undefined, _sessions[apikey] );
	}
});

/* EOF */
