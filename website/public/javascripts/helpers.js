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
	var regex = /(https?:\/\/[^\s]+)/g;
	
	return text.replace(regex, function(url) {
		if (url.match(/(.*).(jpg|gif|jpeg|png)$/)) {
			return '<a class="imgurl" href="' + url + '" target="_blank">' + url + '</a>';
		} else {
			return '<a href="' + url + '" target="_blank">' + url + '</a>';
		};
	});
};
