#!/usr/bin/env node
/* icecapd */

var init = require('init'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    sys = require('sys'),
    config = {};

/* Read (optional) configuration file */
(function() {
	var home = process.env.HOME || __dirname,
	    dir = path.resolve(home, '.icecapd-js'),
	    file = path.resolve(dir, 'config.json');
	try {
		if(!fs.existsSync(dir)) fs.mkdirSync(dir, 0700);
		if(fs.existsSync(file)) {
			config = JSON.parse(fs.readFileSync(file, 'utf-8'));
		}
	} catch(e) {
		// Do nothing
	}
	
	if(!config.dir) config.dir = dir;

	/* Setup configurations */
	(function() {
		var arg = process.argv[2],
		    key = process.argv[3],
		    value = process.argv[4],
			changed,
			exit;
		if((arg === 'config-set') && key) {
			config[key] = value;
			changed = true;
			exit = true;
		}
		if(arg === 'config') {
			console.log('Config from file `' + file + "`:" );
			console.log(sys.inspect(config));
			exit = true;
		}
		
		if(changed) {
			fs.writeFileSync(file, JSON.stringify(config));
			console.log('Saved.');
		}
		
		if(exit) process.exit(0);
	})();
	
})();


/* Setup standard init CLI */
init.simple({
	pidfile : config.pidfile || path.resolve(config.dir, 'run.pid'),
	logfile : config.logfile && path.resolve(config.logfile),
	command : process.argv[2],
	run     : function () {
		
		// Output debug for memory usage
		setInterval(function() {
			console.log('DEBUG: Memory usage: ' + util.inspect(process.memoryUsage()));
		}, 5000);
		
		var io = require('socket.io-client'),
		    util = require('util'),
		    icecap = require('icecap').create(),
		    website_socket;
		
		function do_connection() {
			if(!website_socket) website_socket = io.connect(config.iotarget || 'http://nko-oulu.kapsi.fi/shell');
			
			function icecap_event(name, tokens) {
				//if(name !== 'msg') return;
				util.log('Sending icecap-event to website...');
				website_socket.emit('icecap-event', name, tokens);
			}
			
			// Let's log every icecap event
			//icecap.on('event', function(name, tokens) {
			//	util.log("DEBUG: icecap.on(event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
			//});
			
			// Lets handle errors
			website_socket.on('error', function(msg) {
				console.error('Error: ' + msg);
			});
			
			// Lets handle succesful connection
			website_socket.on('connect', function () {
				util.log('Connected to website and sending our apikey');
				
				// Let's handle successful join
				website_socket.once('joined', function() {
					util.log('Joined to website');
					
					icecap.on('event', icecap_event);
					
					website_socket.on('icecap.command', function(name, tokens) {
						util.log("DEBUG: website_socket.on(client-event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
						icecap.command(name, tokens);
					});
					
				});
				
				// Send join request with our apikey
				website_socket.emit('join', config.apikey);
			
			});
			
			// Lets handle succesful connection
			website_socket.once('disconnect', function () {
				util.log('Webserver disconnected!');
				// error connect joined icecap.command disconnect
				website_socket.removeAllListeners('error');
				website_socket.removeAllListeners('connect');
				website_socket.removeAllListeners('joined');
				website_socket.removeAllListeners('icecap.command');
				website_socket.removeAllListeners('disconnect');
				icecap.removeListener('event', icecap_event);
				do_connection();
			});
			
		} // do_connection
		
		do_connection();
	}
});

/* EOF */
