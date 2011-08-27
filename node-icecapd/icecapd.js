/* icecapd */

var init = require('init'),
    sys = require('sys'),
    config = require('./config.js'),
    pidfile = config.pidfile || './myprog.pid',
    logfile = config.logfile,
    io = require('socket.io-client'),
    socket = io.connect('http://localhost:3000/shell'),
    icecap = require('icecap').create();

init.simple({
	pidfile : pidfile,
	logfile : logfile,
	command : process.argv[3],
	run     : function () {
		socket.on('connect', function () {
			console.log('DEBUG: Connection !');
			
			icecap.on('event', function(name, tokens) {
				console.log("DEBUG: icecap.on(event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
				socket.emit('icecap-event', name, tokens);
			});
			
			socket.on('icecap.command', function(name, tokens) {
				console.log("DEBUG: socket.on(client-event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
				icecap.command(name, tokens);
			});
	
		});
	}
});

/* EOF */
