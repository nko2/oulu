/* Common app.js */

var app = module.exports = {},
    config = require('./safe-config.js'),
	website_app = require('./website_app.js'),
	shell_app = require('./shell_app.js');

website_app.config(config.website);
shell_app.config(config.shell);

website_app.listen( (config.website && config.website.bind) || {'port':3001} );
shell_app.listen( (config.shell && config.shell.bind) || {'port':3001} );

/* EOF */
