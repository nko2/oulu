/* Common app.js */

var app = module.exports = {},
    config = require('./safe-config.js'),
	website_app = require('./website_app.js');
website_app.config(config);
website_app.listen(config);

/* EOF */
