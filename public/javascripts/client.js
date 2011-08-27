/* Client Side JavaScript */

/* Init window */
function init() {
	
	//var socket = io.connect('http://localhost:3000');
	var socket = io.connect();
	/*socket.on('htmlmsg', function (data) {
		$('#ircrows').append(data);
	});*/
	
	socket.on('msg', function (data) {
		$('#ircrows').append('<div class="ircrow">&lt;'+ data.presence +'&gt; '+ data.msg +'</div>');
	});
	
	// send line to IRC
	$('#sendmsgform').submit(function (event) {
		event.preventDefault();
		socket.emit('input', $('#prompt').val());
		
		// clear the text field
		$('#prompt').val('');
	});
}

// jquery
$(document).ready(function() {
	init();	
});

/* EOF */
