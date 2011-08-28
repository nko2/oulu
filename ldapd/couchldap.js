var couchldap = module.exports = {};
var ldap = require('ldapjs');
var cradle = require('cradle');
var server = ldap.createServer();
var config = require('./config.js');
var db = new(cradle.Connection)().database('users');

function sendRecord(user, req, res) {
	console.log('Creating record for ' + user.name || 'unknown');

	var obj = {
		dn: 'cn=' + user.name + ', ou=users, o=oulu',
		attributes: {
			objectclass: [ 'posixAccount', 'shadowAccount', 'inetOrgPerson' ],
			sn: 'User',
			givenname: 'Generated',
			cn: user.name,
			uid: user.name,
			uidnumber: '' + user.uid,
			gidnumber: '' + 2000,
			homedirectory: '/home/' + user.name,
			loginshell: config.shell || '/bin/bash',
			gecos: 'foo'
		}
	};

	if (req.filter.matches(obj.attributes)) {
		console.log('Sending matching object.');
		res.send(obj);
	}
}
			
server.bind('ou=users, o=oulu', function(req, res, next) {
	console.log('bind DN: ' + req.dn.toString());
	console.log('bind PW: ' + req.credentials);
	res.end();
});

function query(req, res, next) {
	console.log('Querying.');
	console.log('Filter: ' + req.filter.toString());
	console.log('DN: ' + req.dn.toString());

	db.view('users/unix', function (err, dbresult) {
		dbresult.forEach(function(user) {
			sendRecord(user, req, res);
		});
		res.end();
	});
}

// Handle ldapsearches
server.search('ou=users, o=oulu', query);

server.listen(1389, function() {
	console.log('LDAP server up and running.');
});
