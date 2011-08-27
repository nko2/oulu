
/* Foreach examples -- Automatic format */

var foreach = require('snippets').foreach;

// Foreach array
var a = [1,2,3,4,5];
foreach(a).do(function(v) { console.log(v); });

// Foreach object
a = {'foo':1,'bar':2};
foreach(a).do(function(v, k) { console.log(k+"="+v); });

// Foreach single variable
a = 'foobar';
foreach(a).do(function(v) { console.log(v); });

/* Foreach examples -- Specific format */

var foreach = require('snippets/lib/foreach');

// Foreach only arrays
a = [1,2,3,4,5];
foreach.any(a).do(function(v) { console.log(v); });

// Foreach only arrays
a = [1,2,3,4,5];
foreach.array(a).do(function(v) { console.log(v); });

// Foreach only objects
a = {'foo':1,'bar':2};
foreach.object(a).do(function(v, k) { console.log(k+"="+v); });

// Foreach only single elements
a = 'foobar';
foreach.single(a).do(function(v) { console.log(v); });

/* EOF */
