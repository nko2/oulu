/**
 * Module dependencies.
 */

var app = module.exports = {},
    config = require('./safe-config.js'),
    express = require('express'),
    sys = require('sys'),
    params = require('express-params'),
    namespace = require('express-namespace'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

params.extend(app);

// Helpers
//app.dynamicHelpers({'config': config});

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger({ format: ':date - :method :status :url' }));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: "keyboard cat" }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

io.configure('development', function(){
    io.set('log level', 100);
	io.set('transports', config.transports || ['websocket', 'xhr-polling']);
});

io.configure('production', function(){
    io.set('transports', config.transports);
});

// Routes

app.get('/', function(req, res) {
	res.render('index', { title : 'NKO Oulu' });
});

app.get('/setup', function(req, res) {
	res.render('setup', { title : 'Setup account - NKO Oulu' });
});

/* Temporary Database for users in memory */
(function UserDatabase() {
	
	/* Constructor */
	function UserDatabase() {
	}
	
	/* Get user record */
	UserDatabase.prototype.get = (function(key, fn) {
		
	});
	
	/* Set user record */
	UserDatabase.prototype.set = (function(key, values, fn) {
	});
	
	/* Delete user record */
	UserDatabase.prototype.del = (function(key, fn) {
		
	});
	
	return UserDatabase;
});

/* Setup io.sockets */
(function() {
	
	var users = new UserDatabase(),
	    browsers = io.of('/client'), // Web browsers
	    shells = io.of('/shell'); // User's shell daemons (connected to local icecapd)
	
	// New browser event
	browsers.on('connection', function (browser) {
		console.log('DEBUG: browser connected!');
		
		// Browser sends an icecap.command event
		browser.on('icecap.command', function(name, tokens) {
			console.log( 'DEBUG: browser.on(icecap.command): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
			
		});
		
		// Browser disconnects
		browser.on('disconnect', function () {
		});
	});
	
	// New shell event
	shells.on('connection', function (shell) {
		console.log('DEBUG: shell connected!');
		
		// Shell sends an icecap-event
		shell.on('icecap-event', function(name, tokens) {
			console.log( 'DEBUG: shell.on(icecap-event): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
			if(browsers) browsers.emit('icecap-event', name, tokens);
		});
		
		// Shell daemon disconnects
		shell.on('disconnect', function () {
		});
	});

})();

/* Setup HTTP */
(function() {
	var config = config || {},
	    port = config.port || 3000,
	    host = config.host;
	if(host) app.listen(host, port);
	else app.listen(port);
	console.log("Express server listening on port %d in %s mode",
		port, app.settings.env);
})(); // end of start HTTP

/* EOF */
