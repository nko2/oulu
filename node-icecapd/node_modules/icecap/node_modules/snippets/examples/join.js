
var join = require('snippets').join,
    sys = require('sys');

console.log(sys.inspect( join(['a', 'b', 'c'], ['.', ' / ']) ));
