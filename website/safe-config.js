/* Common app.js */

var config;
try {
	config = module.exports = require('./config.js');
} catch (e) {
	config = module.exports = require('./config.sample.js');
};

if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

// Set default umask
process.umask(config.umask || 0077);

if(!config.port)       config.port = 3000;
if(!config.transports) config.transports = ['xhr-polling'];

if(config.couchdb) {
	if(!config.couchdb.host) config.couchdb.host = 'localhost';
	if(!config.couchdb.port) config.couchdb.port = 5984;
	if(!config.couchdb.options) config.couchdb.options = {};
	if(!config.couchdb.db) config.couchdb.db = 'users';
}

/* EOF */
