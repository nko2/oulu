/* Client Side JavaScript */

/* Init window */
function init() {
	
	//var socket = io.connect('http://localhost:3000');
	var socket = io.connect();
	
	// receive line from IRC
	socket.on('msg', function (data) {
		$('#ircrows').append('<div class="ircrow">'+ mmss(data.time) +' &lt;'+ data.presence +'&gt; '+ data.msg +'</div>');
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

function mmss(time) {
	var dt = new Date(time * 1000);
	return dt.getHours() +":"+ dt.getMinutes();
};

// jquery
$(document).ready(function() {
	init();	
});

/* EOF */
