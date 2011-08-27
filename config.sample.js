/* Project Configuration File */
var config = module.exports = {};

/* Rename to config.js */

/* Bind to these settings */
//config.host = 'zeta1';
config.port = 3000;

// set socket.io transports
config.transports = ['websocket', 'xhr-polling'];
