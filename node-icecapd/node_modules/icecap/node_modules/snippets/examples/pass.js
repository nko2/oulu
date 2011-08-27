
var pass = require('snippets').pass,
    sys = require('sys');

pass(['foo', 'bar']).on(function(key, value) { console.log(key+" = "+value); });
