#!/usr/bin/env node
/* icecapd */

var init = require('init'),
    fs = require('fs'),
    path = require('path'),
    sys = require('sys'),
    config = {};

/* Read (optional) configuration file */
(function() {
	var home = process.env.HOME || __dirname,
	    dir = path.resolve(home, '.icecapd-js'),
	    file = path.resolve(dir, 'config.json');
	try {
		if(!path.existsSync(dir)) fs.mkdirSync(dir, 0700);
		if(path.existsSync(file)) {
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
	logfile : config.logfile,
	command : process.argv[2],
	run     : function () {
		
		var io = require('socket.io-client'),
		    util = require('util'),
		    website_socket = io.connect(config.iotarget || 'http://localhost:3000/shell'),
		    icecap = require('icecap').create();
		
		// Let's log every icecap event
		//icecap.on('event', function(name, tokens) {
		//	util.log("DEBUG: icecap.on(event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
		//});
		
		// Lets handle succesful connection
		website_socket.on('connect', function () {
			util.log('Connected to website and sending our apikey');
			
			function on_error(msg) {
				console.error('Error: ' + msg);
			}
			
			// Lets handle errors
			website_socket.on('error', on_error);
			
			// Let's handle successful join
			website_socket.once('joined', function() {
				util.log('Joined to website');
				
				function on_event(name, tokens) {
					if(name !== 'msg') return;
					util.log('Sending icecap-event to website...');
					website_socket.emit('icecap-event', name, tokens);
				}
				
				function on_command(name, tokens) {
					util.log("DEBUG: website_socket.on(client-event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
					icecap.command(name, tokens);
				}
				
				icecap.on('event', on_event);
				website_socket.on('icecap.command', on_command);
				
				website_socket.once('disconnect', function() {
					icecap.removeListener('event', on_event);
					website_socket.removeListener('icecap.command', on_command);
				});
			});
			
			// Lets handle succesful connection
			website_socket.once('disconnect', function () {
				util.log('Webserver disconnected!');
				website_socket.removeListener('error', on_error);
			});
			
			// Send join request with our apikey
			website_socket.emit('join', config.apikey);
			
		});
		
	}
});

/* EOF */
