var couchldap = module.exports = {};
var ldap = require('ldapjs');
var cradle = require('cradle');
var server = ldap.createServer();
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
var db = new(cradle.Connection)().database('users');

function sendRecord(user, req, res) {
	console.log('Creating record for ' + user.name || 'unknown');

	var obj = {
		dn: 'cn=' + user.name + ', ' + config.base,
		attributes: {
			objectclass: [ 'posixAccount', 'shadowAccount', 'inetOrgPerson' ],
			sn: 'User',
			givenname: 'Generated',
			cn: user.name,
			uid: user.name,
			uidnumber: '' + user.uid,
			gidnumber: '' + config.gid,
			homedirectory: '/home/' + user.name,
			loginshell: config.shell || '/bin/bash'
		}
	};

	if (req.filter.matches(obj.attributes)) {
		console.log('Sending matching object.');
		res.send(obj);
	}
}
			

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

couchldap.run = function() {

	// Handle bind
	server.bind(config.base, function(req, res, next) {
		console.log('bind DN: ' + req.dn.toString());
		console.log('bind PW: ' + req.credentials);
		res.end();
	});

	// Handle search
	server.search(config.base, query);

	// Start the server
	server.listen(config.port, config.host, function() {
		console.log('LDAP server up and running.');
	});
};

