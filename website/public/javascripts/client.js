/* Client Side JavaScript */

/* Init window */
function init() {
	
	var socket = io.connect('/client'),
	    avatars = {},
	    big_avatars = {};

	/* Get avatar */
	function get_avatar(email, fn) {
		if(avatars[email] && big_avatars[email]) return fn(avatars[email], big_avatars[email]);
		function do_set_gravatar(email, url, options) {
			if(options && (options.s >= 50) ) {
				big_avatars[email] = url;
			} else {
				avatars[email] = url;
			}
			if(big_avatars[email] && avatars[email]) {
				fn(avatars[email], big_avatars[email]);
			} else {
				socket.once('set-gravatar', do_set_gravatar);
				socket.emit('get-gravatar', email, {s: '200', r: 'pg'}, false);
			}
		}
		socket.once('set-gravatar', do_set_gravatar);
		socket.emit('get-gravatar', email, {s: '32', r: 'pg'}, false);
	}
	
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
		if(name !== 'msg') return;
		
		get_avatar(data['address'], function(url, bigurl) {
			function escape(str) { return $('<span/>').text(str).html(); }
			function img() {
				if(url) return '<a class="imgurl" href="'+bigurl+'.jpg"><img src="'+url+'.jpg" title="'+escape(data['address'])+'"/></a>';
				return '';
			}
			$('#ircrows').prepend('<div class="ircrow" style="display: none;">'+img()+' '+
				escape(HHmm(data.time))+
				' &lt;'+
				escape(data.presence)+
				'&gt; '+
				make_urls(escape(data.msg))+
				'<hr/></div>');
			$('.ircrow').fadeIn('slow');
			if(url) $('.imgurl').imgPreview({ imgCSS: { width: 200 } });
			if (data.msg.match(/(.*).(jpg|gif|jpeg|png)$/)) {
				$('.imgurl').imgPreview({ imgCSS: { width: 200 } });
			};
		});
	});
	
	// send line to IRC
	$('#sendmsgform').submit(function (event) {
		event.preventDefault();
		socket.emit('icecap.command', 'msg', { 'network' : 'freenode', 'channel' : '#oulu', 'msg': $('#prompt').val() } );
		
		// clear the text field
		$('#prompt').val('');
	});

	// preferences menu
	$('#commit-button').click(function() {
		$('.modal').slideToggle('slow', function() {
			socket.emit('icecap.command', 'presence set', {'network' : 'freenode', 'mypresence' : 'dgfrtr', 'real_name' : 'derp' } );
			$.cookie('the_magic_oulu_cookie', $('#apikey').val(), { expires: 365, path: '/' });
 		});
	});
	
	$('#toggle-button').click(function() {
		$('.modal').slideToggle('slow', function() {
 		});
	});

	$('#timelinetab').click(function() {
		$('.tabcontent').hide();
		$('#ircrows').show();
		$('.tab').removeClass('active');
		$('#timelinetab').addClass('active');
	});

	$('#guidetab').click(function() {
		$('.tabcontent').hide();
		$('#guide').show();
		$('.tab').removeClass('active');
		$('#guidetab').addClass('active');
	});

}


// jquery
$(document).ready(function() {
	init();	
});

/* EOF */
