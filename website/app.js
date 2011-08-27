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
	res.render('index', {
		title : 'Express'
	});
});

/* Setup io.sockets */
(function() {
	
	var client, shell;
	
	/* Web browser -- the true client */
	client = io.of('/client');
	
	client.on('connection', function (client_socket) {
		console.log('DEBUG: client: CONNECTION!');
		
		client_socket.on('icecap.command', function(name, tokens) {
			console.log( 'DEBUG: client_socket.on(icecap.command): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
		});
		
	});
	
	/* User's shell daemon (there is icecapd) -- the true backend */
	shell = io.of('/shell');
	
	shell.on('connection', function (shell_socket) {
		console.log('DEBUG: shell: CONNECTION!');
		
		shell_socket.on('icecap-event', function(name, tokens) {
			console.log( 'DEBUG: shell_socket.on(icecap-event): ' + sys.inspect(name) + ": " + sys.inspect( tokens ) );
			if(client) client.emit('icecap-event', name, tokens);
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
