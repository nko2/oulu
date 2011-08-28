/* Client Side JavaScript */

/* Init window */
function init() {
	
	var socket = io.connect('/client');

	// set cookie if/when receiving api key
	socket.once('joined', function (apikey) {
		$.cookie('the_magic_oulu_cookie', apikey, { expires: 365, path: '/' });
		console.log('Client joined, magic cookie set with apikey '+ apikey);
		$('#apikey').val(apikey);
	});
	
	socket.on('rejected-apikey', function () {
		console.log('api key rejected, requesting new api key from server');
		socket.emit('create');
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
		//$('#ircrows').append('<div class="ircrow">test</div>');
		if(name !== 'msg') return;
		$('#ircrows').append('<div class="ircrow">'+ HHmm(data.time) +' &lt;'+ data.presence +'&gt; '+ make_urls(data.msg) +'</div>');
		
		if (data.msg.match(/(.*).(jpg|gif|jpeg|png)$/)) {
			$('.imgurl').imgPreview({ imgCSS: { width: 200 } });
		};
	});
	
	// send line to IRC
	$('#sendmsgform').submit(function (event) {
		event.preventDefault();
		socket.emit('icecap.command', 'msg', { 'msg': $('#prompt').val() } );
		
		// clear the text field
		$('#prompt').val('');
	});

	// set nick
	/*$('#loginform').submit(function (event) {
		event.preventDefault();
		socket.emit('login', $('#nick').val());
	});*/
}

// jquery
$(document).ready(function() {
	init();	

	$('#toggle-button').click(function() {
		$('.modal').slideToggle('slow', function() {
 		});
	});

	$('#commit-button').click(function() {
		$('.modal').slideToggle('slow', function() {
 		});
	});

});

/* EOF */
