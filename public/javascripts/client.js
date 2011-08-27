/* Client Side JavaScript */

/* Shorter format */
/*function $(name) {
	return document.getElementById(name);
}*/

/* Init window */
function init() {
	
	//var socket = io.connect('http://localhost:3000');
	var socket = io.connect();
	socket.on('htmlmsg', function (data) {
		console.log('Writing to page!');
		$('#rows').append(data);
	});
	
}

// jquery
$(document).ready(function() {
	init();
	
	
});

/* EOF */
