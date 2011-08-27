JavaScript Snippet Collection
=============================

Description
-----------

Small collection of useful small snippets for JavaScript and 
[Node.js](http://www.nodejs.org). Designed to be lightweight, independent and 
undisruptive as much as possible.

Features
--------

* is -- Check variable types
* foreach -- For each element in array or object or the element itself
* split -- Split variable into smaller chunks by regexp
* join -- Join array or object as a string with multiple seperators
* pass -- Pass vector values to a callback as arguments

Installation for Node.js
------------------------

Simplest way to install is to use [npm](http://npmjs.org/), just simply `npm install snippets`.

License
-------

MIT-style license, see [INSTALL.txt](http://github.com/jheusala/js-snippets/blob/master/LICENSE.txt).

Initializing
------------

Every feature is a property of snippets:

    var foreach = require('snippets').foreach;
    var split = require('snippets').split;
    var pass = require('snippets').pass;

See [examples/](http://github.com/jheusala/js-snippets/tree/master/examples) for full examples.

Is
--

	var is = require('snippets').is;
	var a = [1,2,3,4,5];
	if(is.array(a)) console.log("a is array");
	else if(is.object(a)) console.log("a is object");
	else console.log("a is not array nor object");

Foreach
-------

Write each array element to console:

	var a = [1,2,3,4,5];
	foreach(a).do(function(v) { console.log(v); });
  
Write each object key=value pair to console:

	a = {'foo':1,'bar':2};
	foreach(a).do(function(v, k) { console.log(k+"="+v); });

Write single value to console:

	a = 'foobar';
	foreach(a).do(function(v) { console.log(v); });

Split
-----

Splits string into smaller chunks using regexp:

	var vector = split(/: */, "One: Two:  Three:   End", 2);

Resulting `vector` will be:

	["One", "Two:  Three:   End"]

Please note: Standard JavaScript split does NOT append the rest of the string in the last element.

Join
----

Joins an array into a string with multiple separators:

	var str = join(["a","b","c"], [":","."]);

Resulting `str` will be `"a:b.c"`.

Default separator is `","`. 

To change the default, use:

	var str = join(["a","b","c"], [":"], ".");

Pass
----

Passes the values from array into the callback as arguments:

	pass(["a", "b"]).on(function(key, value) { console.log(key+"="+value); });

To parse a key-value line, we can use `pass` with `split`:

	pass(split(/ *= */, "a = b", 2)).on(function(key,value) { console.log(key+"="+value); });

Trimmers
--------

To remove white spaces:

	a = ltrim('  Hello World '); // a = 'Hello World '
	a = rtrim('  Hello World '); // a = '  Hello World'
	a = trim('  Hello World ');  // a = 'Hello World'

Padders
-------

Pad string to specific length from left:

	a = lpad('123', 5, '#'); // a = '##123';
	a = rpad('123', 5, '#'); // a = '123##';
