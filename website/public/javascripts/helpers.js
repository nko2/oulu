/* Helpers */


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

function make_urls(text) {
	//var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	var regex = /(https?:\/\/[^\s]+)/g;
	
	return text.replace(regex, function(url) {
		return '<a href="' + url + '">' + url + '</a>';
	});
};
