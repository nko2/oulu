
var io = require('socket.io-client');
var website_socket = io.connect('http://nko-oulu.kapsi.fi/shell');

website_socket.on('error', function(msg) {
    console.error('Error: ' + msg);
});


website_socket.on('connect', function () {
    console.log('Connected to website and sending our apikey');
    
    // Let's handle successful join
    website_socket.once('joined', function() {
	console.log('Joined to website');


	setInterval(function() {
	    console.log('Spamming!');
	    website_socket.emit('icecap-event', 'msg', {
		id: '3489',
		time: '1314553044.1',
		network: 'freenode',
		mypresence: 'jkj-nko2',
		channel: '#oulu',
		msg: 'plop',
		presence: 'jkj_',
		address: 'oh8glv@kapsi.fi',
		user: 'jkj'
	    });
	}, 1000);

	
    });
    
    // Send join request with our apikey
    website_socket.emit('join', 'VDr9PtGuwwvgwytOtHBhpF4zTJVv50Tf');    
});


// Lets handle succesful connection
website_socket.once('disconnect', function () {
    console.log('Webserver disconnected!');
    website_socket.removeAllListeners('error');
    website_socket.removeAllListeners('connect');
    website_socket.removeAllListeners('icecap.command');
});
