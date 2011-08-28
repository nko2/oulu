/* Project Configuration File */
/* Rename to config.js */

var config = module.exports = {};

// set socket.io transports
config.transports = ['xhr-polling'];
config.port = 3000; // Shell service will use 3001 by default

/*
config.website = { 'port': 3000 };
config.shell   = { 'port': 3001 };
*/

/*

config.couchdb = {
    'options': {
        'auth': {
            'username':'admin',
            'password':'bU7qVSgy'
        }
    }
};

*/
