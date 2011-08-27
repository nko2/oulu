/* Common app.js */

var app = module.exports = {};

try {
	app.config = require('./config.js');
} catch (e) {
	app.config = require('./config.sample.js');
};

if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

// Set default umask
process.umask(0077);

if(!config.port) config.port = 3000;
if(!config.shell_port) config.shell_port = 3000;



/* EOF */
