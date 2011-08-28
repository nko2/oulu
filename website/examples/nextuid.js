var cradle = require('cradle');
var db = new(cradle.Connection)().database('users');

//
// Query users/list which returns all api keys
//
db.view('users/nextuid', function (err, res) {
	res.forEach(function(next) {
		console.log('next: '+res[0]);
	});
});

