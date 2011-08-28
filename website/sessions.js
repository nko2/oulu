/**
 * Module dependencies.
 */

/* Temporary in memory database for User Sessions */
var _sessions = [];
var lib = module.exports = {};


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


/* Create new apikey or get the registered key */
lib.create = (function(apikey) {
	var undefined;
	if(_sessions[apikey] === undefined) return _sessions[apikey] = new Session(apikey);
	return _sessions[apikey];
});

/* Check if session exists */
lib.exists = (function(apikey) {
	var undefined;
	return (_sessions[apikey] === undefined) ? false : true;
});

/* EOF */
