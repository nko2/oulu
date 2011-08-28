#!/usr/bin/env node

var init = require('init');
var fs = require('fs');
var couchldap = require('./couchldap.js');
var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

init.simple({
	pidfile : config.pidfile,
	logfile : config.logfile,
	command : process.argv[2],
	run     : couchldap.run
});

