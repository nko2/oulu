/* Client Side JavaScript */

/* Init window */
function init() {
	
	var socket = io.connect('/client');

	// set cookie if/when receiving api key
	socket.on('joined', function (apikey) {
		$.cookie('the_magic_oulu_cookie', apikey, { expires: 365, path: '/' });
		console.log('Magic cookie set with apikey '+ apikey);
	});
	
	// request api key if cookie not found
	if (! $.cookie('the_magic_oulu_cookie')) {
		console.log('Requesting api key from server');
		socket.emit('create');
	} else {
		console.log('Existing cookie found, sending apikey to server');
		socket.emit('join',  $.cookie('the_magic_oulu_cookie'));
	};
	
	// receive line from IRC
	socket.on('icecap-event', function (name, data) {
		console.log("icecap-event received: '" + name + "'");
		$('#ircrows').append('<div class="ircrow">test</div>');
		if(name !== 'msg') return;
		$('#ircrows').append('<div class="ircrow">'+ HHmm(data.time) +' &lt;'+ data.presence +'&gt; '+ data.msg +'</div>');
	});
	
	// send line to IRC
	$('#sendmsgform').submit(function (event) {
		event.preventDefault();
		socket.emit('icecap.command', 'msg', { 'presence': 'jheusala2', 'msg': $('#prompt').val() } );
		
		// clear the text field
		$('#prompt').val('');
	});

	// set nick
	$('#loginform').submit(function (event) {
		event.preventDefault();
		socket.emit('login', $('#nick').val());
	});
}

// Convert unix-timestamp to HH:MM format
function HHmm(time) {
	var dt = new Date(time * 1000);
	
	var hours = dt.getHours();
	var minutes = dt.getMinutes();
	
	if ( minutes < 10) {
		minutes = "0"+minutes;
	};
	if ( hours < 10) {
		hours = "0"+hours;
	};
	
	return hours +":"+ minutes;
};

// jquery
$(document).ready(function() {
	init();	
});

/* EOF */
