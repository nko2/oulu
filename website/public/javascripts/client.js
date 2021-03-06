/* Client Side JavaScript */

/* Init window */
function init() {
	
	var socket = io.connect('/client'),
	    avatars = {},
	    big_avatars = {},
	    _me = {'networks':{}};
	
	function update_my_list(item, list) {
		var i=0, length=list.length;
		for(;i<length;i++) {
			if(list[i] === item) return;
		}
		list.push(item);
	}
	
	function update_me(data) {
		// Select first mypresence
		if((!_me.mypresence) && data.mypresence) {
			_me.mypresence = data.mypresence;
			_me.network = data.network;
			_me.address = data.address;
		}
		
		function setup_mypresence(network, data) {
			if(!data.mypresence) return;
			if(!network.mypresences) network.mypresences = {};
			network.mypresences[data.mypresence] = {};
		}
		
		function setup_channel(network, data) {
			if(!data.channel) return;
			if(!network.channels) network.channels = {};
			network.channels[data.channel] = {};
		}
		
		function setup_network(me, data) {
			if(!data.network) return;
			if(!me.networks) me.networks = {};
			me.networks[data.network] = {};
			setup_channel(me.networks[data.network], data);
			setup_mypresence(me.networks[data.network], data);
		}
		
		setup_network(_me, data);
	}
	
	function escape(str) { return $('<span/>').text(str).html(); }
	
	/* */
	socket.on('status-reply', function(backends) {
		var b;
		for(b in backends) if(backends.hasOwnProperty(b)) {
			$('#backends').html('<img src="/images/' + ( (backends[b]===true) ? 'green' : 'red' ) + '-ball-18x18.png" width="18" height="18" alt="'+escape(b)+'" />');
		}
	});
	
	/* Timer to update backends */
	function backends_loop() {
		socket.emit('status');
		setTimeout(backends_loop, 10000);
	}
	backends_loop();
	
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
				socket.emit('get-gravatar', email, {s: '200', d:'identicon', r: 'pg'}, false);
			}
		}
		socket.once('set-gravatar', do_set_gravatar);
		socket.emit('get-gravatar', email, {s: '32', d:'identicon', r: 'pg'}, false);
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

        function handle_msg(data) {
	    console.log("Handling new MSG.");
	    get_avatar(data['address'], function(url, bigurl) {
		function img() {
		    if(url) return '<a class="imgurl" href="'+bigurl+'"><img src="'+url+'" title="'+escape(data['address'])+'"/></a>';
		    return '';
		}
		
		update_me(data);
		
		$('#ircrows').prepend('<div class="ircrow" style="display: none;"><div style="float: left; margin-right: 8px;"'+img()+'</div> <div style="">'+ data.channel +'</div>'+
				      escape(HHmm(data.time))+
				      ' &lt;<span style="font-weight: bold; color: black;">'+
				      escape(data.presence)+
				      '</span>&gt; <span style="color: black;">'+
				      make_urls(escape(data.msg))+
				      '</span><hr/></div>');
		$('.ircrow').fadeIn('slow');
		if(url) $('.imgurl').imgPreview({ imgCSS: { width: 200 } });
		if (data.msg.match(/(.*).(jpg|gif|jpeg|png)$/)) {
		    $('.imgurl').imgPreview({ imgCSS: { width: 200 } });
		};
	    });
	}    
	
	// receive line from IRC
	socket.on('icecap-event', function (name, data) {
		console.log("icecap-event received: '" + name + "'");
		if(name == 'msg') {
		    handle_msg(data);	
		};
		if(name == 'channel_presence_added') {
			function escape(str) { return $('<span/>').text(str).html(); }
			$('#ircrows').prepend('<div class="ircrow" style="display: none; margin-left: 40px;">'+
                    escape(HHmm(data.time))+ ' '+
                    escape(data.presence)+
                    ' joined '+ data.channel +
                    '<hr/></div>');
			$('.ircrow').fadeIn('slow');
		};
		if(name == 'channel_presence_removed') {
			function escape(str) { return $('<span/>').text(str).html(); }
			$('#ircrows').prepend('<div class="ircrow" style="display: none; margin-left: 40px;">'+
                    escape(HHmm(data.time))+ ' '+
                    escape(data.presence)+
                    ' left '+ data.channel +
                    '<hr/></div>');
			$('.ircrow').fadeIn('slow');
		};
	});
	
	// send line to IRC
	$('#sendmsgform').submit(function (event) {
		event.preventDefault();
	        handle_msg({
		    'time': new Date().getTime(),
		    'presence': _me && _me.mypresence || 'Me',
		    'network' : _me && _me.network || 'freenode',
		    'address' : _me && _me.address || 'unkown@example.tld',
		    'channel' : '#node.js',
		    'msg'     : $('#prompt').val()
		});
		socket.emit('icecap.command', 'msg', { 'network' : 'freenode', 'channel' : '#node.js', 'msg': $('#prompt').val() } );
		
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

	$('#introtab').click(function() {
		$('.tabcontent').hide();
		$('#intro').show();
		$('.tab').removeClass('active');
		$('#introtab').addClass('active');
	});

}


// jquery
$(document).ready(function() {
	init();	
});

/* EOF */
