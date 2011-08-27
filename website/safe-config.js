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

if(!config.port) config.port = 3000;
if(!config.transports) config.transports = ['xhr-polling'];

if(!config.website) config.website = {};
if(!config.website.port) config.website.port = config.port;
if(!config.website.transports) config.website.transports = config.transports;

if(!config.shell) config.shell = {};
if(!config.shell.port) config.shell.port = config.website.port + 1;
if(!config.shell.transports) config.shell.transports = config.transports;

/* EOF */
