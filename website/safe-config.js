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

/* EOF */
