/**
 * Module dependencies.
 */

var config = require('./config.js'),
    express = require('express'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);
    icecap = require('icecap').create();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
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

// Routes

app.get('/', function(req, res) {
	res.render('index', {
		title : 'Express'
	});
});

io.sockets.on('connection', function (socket) {
	
	socket.on('input', function(msg) {
		console.log("Routing message from web to icecap");
		icecap.command(
			'msg', {
				'channel':'#oulu',
	    		'network':'freenode',
	    		'msg':'Hello world'
			});
	});
	
});

/* Setup icecap */
(function() {

	console.log("Registering icecap message handler");
	
	icecap.on('msg', function(tokens) {
		console.log("Routing icecap message to web");
		io.sockets.emit('msg', tokens);
		
		// HTML formated msg
		//var fn = jade.compile('string of jade', options);
		io.sockets.emit('htmlmsg', '<div>Hello</div>');
	
	});

})(); // end of setup icecap

/* Setup HTTP */
(function() {

	var port = config.port || 3000,
	    host = config.host;
	
	if(host) app.listen(host, port);
	else app.listen(port);
	
	console.log("Express server listening on port %d in %s mode",
		app.address().port, app.settings.env);

})(); // end of setup HTTP

/* EOF */
