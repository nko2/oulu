/* Client Side JavaScript */

/* Shorter format */
function $(name) {
	return document.getElementByID(name);
}

/* Init window */
function init() {
	var socket = io.connect();
	socket.on('htmlmsg', function (data) {
		//console.log(data);
		$('rows').innerHTML += data;
	});
}

window.onload = init;

/* EOF */
