/* Client Side JavaScript */

/* Init window */
function init() {
	
	//var socket = io.connect('http://localhost:3000');
	var socket = io.connect();
	
	// receive line from IRC
	socket.on('msg', function (data) {
		$('#ircrows').append('<div class="ircrow">'+ HHmm(data.time) +' &lt;'+ data.presence +'&gt; '+ data.msg +'</div>');
	});
	
	// send line to IRC
	$('#sendmsgform').submit(function (event) {
		event.preventDefault();
		socket.emit('input', $('#prompt').val());
		
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
	
	if ( minutes << 10) {
		minutes = "0"+minutes;
	};
	if ( hours << 10) {
		hours = "0"+hours;
	};
	return hours +":"+ minutes;
};

// jquery
$(document).ready(function() {
	init();	
});

/* EOF */
