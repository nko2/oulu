/**
 * Module dependencies.
 */

var config;
try {
	config = require('./config.js');
} catch (e) {
	config = require('./config.sample.js');
};

if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

var express = require('express'),
    sys = require('sys'),
    params = require('express-params'),
    namespace = require('express-namespace'),
    website_app = module.exports = express.createServer(),
    io = require('socket.io').listen(website_app);

params.extend(website_app);

// Helpers
//website_app.dynamicHelpers({'config': config});

// Configuration
website_app.configure(function() {
	website_app.set('views', __dirname + '/views');
	website_app.set('view engine', 'jade');
	website_app.use(express.favicon());
	website_app.use(express.logger({ format: ':date - :method :status :url' }));
	website_app.use(express.bodyParser());
	website_app.use(express.methodOverride());
	website_app.use(express.cookieParser());
	website_app.use(express.session({ secret: "keyboard cat" }));
	website_app.use(website_app.router);
	website_app.use(express.static(__dirname + '/public'));
});

website_app.configure('development', function() {
	website_app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

website_app.configure('production', function() {
	website_app.use(express.errorHandler());
});

io.configure('development', function(){
    io.set('log level', 100);
	io.set('transports', config.transports || ['websocket', 'xhr-polling']);
});

io.configure('production', function(){
    io.set('transports', config.transports);
});

// Routes

website_app.get('/', function(req, res) {
	res.render('index', {
		title : 'Express'
	});
});

io.sockets.on('connection', function (socket) {
	
	console.log('DEBUG: CONNECTION!');
	
	socket.on('icecap-event', function(name, tokens) {
		console.log( 'DEBUG: socket.on(icecap-event): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
		socket.emit('icecap-event', name, tokens);
	});

	socket.on('icecap.command', function(name, tokens) {
		console.log( 'DEBUG: socket.on(icecap.command): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
	});

		/*
	socket.on('input', function(msg) {
		console.log("Routing message from web to icecap");
		icecap.command(
			'msg', {
				'channel':'#oulu',
	    		'network':'freenode',
	    		'msg': msg
			});
	});
		*/
	
});

/* Setup icecap */
(function() {

	console.log("Registering icecap message handler");
	
	/*
	icecap.on('msg', function(tokens) {
		console.log("Routing icecap message to web");
		
		// HTML formated msg
		//var fn = jade.compile('string of jade', options);
		
		// *;msg;id=234442;time=1314424203;network=freenode;mypresence=jheusala2;channel=#oulu;msg=Hello world ABCXXXXXX;presence=jheusala;address=jhh@jhh.me;user=jhh

		io.sockets.emit('msg', tokens); // parsitaan clientillä

		//io.sockets.emit('htmlmsg', '<div class="ircrow">&lt;'+tokens.presence + '&gt; ' + tokens.msg+'</div>');
		
	});
	*/

})(); // end of setup icecap

/* Setup process */
(function() {

	// Set default umask
	process.umask(0077);

})(); // end of setup process

/* Setup HTTP */
(function() {

	var port = config.port || 3000,
	    host = config.host;
	
	if(host) website_app.listen(host, port);
	else website_app.listen(port);
	
	console.log("Express server listening on port %d in %s mode",
		port, website_app.settings.env);

})(); // end of setup HTTP

/* EOF */
