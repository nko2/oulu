var username='g2005';
var config = { 'create_user_script':'/etc/create-user.sh' };
var spawn = require('child_process').spawn;
var createScript = spawn(config.create_user_script, [username]);
console.log('Triggering user creation of '+username);

