
var cradle = require('cradle');

// Default localhost
var db = new(cradle.Connection)().database('users');

//
// Query users/list which returns all api keys
//
db.view('users/list', function (err, res) {
	res.forEach(function(apikey) {
		console.log('API key: <'+apikey+'>');
	});
});


//
// Query users/all which returns all documents with type=='user'
//
db.view('users/all', function (err, res) {
	res.forEach(function(user) {
		console.log('User apikey: '+user._id+' type: '+user.type);
	});
});


//
// New user.
// Use apikey as _id.
// Add type='user' field.
//
db.save('123456789abcdef0', {
	type: 'user'
}, function(err,res) {
	console.log(res)
});

db.save('0123456789abcdef', {
	type: 'user'
}, function(err,res) {
	console.log(res)
});
