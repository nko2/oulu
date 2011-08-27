/* Client Side JavaScript */

/* Shorter format */
function $(name) {
	return document.getElementById(name);
}

/* Init window */
function init() {
	
	//var socket = io.connect('http://localhost:3000');
	var socket = io.connect();
	socket.on('htmlmsg', function (data) {
		console.log('Writing to page!');
		$('rows').innerHTML += data;
	});
	
}
function sendMsg() {
	
	socket.emit('msg', document.sendmsgform.msg.value);
}

window.onload = init;

/* EOF */
