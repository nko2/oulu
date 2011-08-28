/**
 * Module dependencies.
 */

var app = module.exports = {},
    config = require('./safe-config.js'),
    express = require('express'),
    sys = require('sys'),
    params = require('express-params'),
    namespace = require('express-namespace'),
    cradle = require('cradle'),
	users_db = new(cradle.Connection)().database('users'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

require('nko')('s00YpXnmWhL4FBJi');

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

/* Setup io.sockets */
(function() {
	
	var sessions = require('./sessions.js'),
	    browsers = io.of('/client'), // Web browsers
	    shells = io.of('/shell'), // User's shell daemons (connected to local icecapd)
		gravatar = require('gravatar');
	
	// New browser event
	browsers.on('connection', function (browser) {
		console.log('DEBUG: new browser connected!');
		
		var session;
		
		// Browser requests gravator url
		browser.on('get-gravatar', function(email, options, https) {
			var url = gravatar.url(email, options, https);
			browser.emit('set-gravatar', email, url);
		});
		
		// Browser creates a new session
		browser.on('create', function() {
			console.log('Client requested new api key');
			sessions.create(function(err, sess) {
				if(err) {
					console.log('Error: ' + sys.inspect(err));
					browser.emit('error', 'Failed to create apikey');
					browser.emit('join-failed');
					browser.emit('rejected-apikey');
					return;
				}
				session = sess;
				browser.emit('joined', session.apikey);
				console.log('Sent api key ' + session.apikey);
			});
		});
		
		// Browser joins with an API key
		browser.on('join', function(apikey) {
			console.log( 'DEBUG: browser joins with apikey = ' + sys.inspect(apikey) );
			if(session) {
				console.log('Error: This browser was already joined to session.');
				browser.emit('error', 'This browser was already joined to session!');
				browser.emit('join-failed');
				return;
			}
			
			console.log('Joining...');
			sessions.fetch(apikey, function(err, sess) {
				if(err) {
					console.log('Error: Failed to validate apikey');
					browser.emit('error', 'Failed to validate apikey');
					browser.emit('join-failed');
					browser.emit('rejected-apikey');
					return;
				}
				session = sess;
				session.join(browser, 'browser');
				browser.emit('joined', session.apikey);
				console.log('Browser joined!');
			});
		});
		
		// Browser sends an icecap.command event
		browser.on('icecap.command', function(name, tokens) {
			console.log( 'DEBUG: browser.on(icecap.command): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
			session && session.shell && session.shell.emit('icecap.command', name, tokens);
		});
		
		// Browser disconnects
		browser.on('disconnect', function () {
			console.log( 'DEBUG: browser disconnected');
			session && session.browser && session.part(browser);
			console.log('session = ' + sys.inspect(session));
		});
	});
	
	// New shell event
	shells.on('connection', function (shell) {
		console.log('DEBUG: shell connected!');
		
		var session;
		
		// Shell creates a new session
		shell.on('create', function() {
			sessions.create(function(err, sess) {
				if(err) {
					console.log('Error: ' + sys.inspect(err));
					shell.emit('join-failed');
					shell.emit('rejected-apikey');
					shell.emit('error', 'Failed to create apikey');
					return;
				}
				session = sess;
				shell.emit('joined', session.apikey);
			});
		});
		
		// Shell joins with an API key
		shell.on('join', function(apikey) {
			console.log( 'DEBUG: shell joins with apikey = ' + sys.inspect(apikey) );
			if(session) {
				console.log('Error: This shell was already joined to session.');
				shell.emit('join-failed');
				shell.emit('error', 'This shell was already joined to session!');
				return;
			}
			
			console.log('Joining...');
			sessions.fetch(apikey, function(err, sess) {
				if(err) {
					console.log('Error: Failed to validate apikey');
					shell.emit('join-failed');
					shell.emit('rejected-apikey');
					shell.emit('error', 'Failed to validate apikey');
					return;
				}
				session = sess;
				session.join(shell, 'shell');
				shell.emit('joined', session.apikey);
				console.log('Shell joined!');
			});
		});
		
		// Shell sends an icecap-event, we proxy it to the browser
		shell.on('icecap-event', function(name, tokens) {
			console.log( 'DEBUG: shell.on(icecap-event): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
			session && session.browser && session.browser.emit('icecap-event', name, tokens);
			console.log('session = ' + sys.inspect(session));
		});
		
		// Shell daemon disconnects
		shell.on('disconnect', function () {
			console.log('Shell disconnects');
			session && session.shell && session.part(shell);
		});
	});

})();

/* Setup HTTP */
(function() {
	var port = config.port || 3000,
	    host = config.host;
	console.log('Port: ' + port);
	if(host) app.listen(host, port);
	else app.listen(port);
	console.log("Express server listening on port %d in %s mode",
		port, app.settings.env);
})(); // end of start HTTP

/* EOF */
