/* icecapd */

var init = require('init'),
    config = require('./config.js');

init.simple({
	pidfile : config.pidfile || './node-icecapd.pid',
	logfile : config.logfile,
	command : process.argv[3],
	run     : function () {
		
		var io = require('socket.io-client'),
		    sys = require('sys'),
		    socket = io.connect(config.iotarget || 'http://localhost:3000/shell'),
		    icecap = require('icecap').create();
		
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
