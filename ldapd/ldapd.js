var init = require('init');
var config = require('config.js');
var server = require('couchldap.js');

init.simple({
	pidfile : config.pidfile || './node-ldapd.pid',
	logfile : config.logfile || './node-ldapd.log',
	command : process.argv[3],
	run     : server.run
});

