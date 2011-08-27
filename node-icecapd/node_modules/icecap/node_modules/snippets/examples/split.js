
var split = require('snippets').split,
    sys = require('sys');

console.log(sys.inspect( split(/: */, "Hello: World", 2) ));
console.log(sys.inspect( split(/: */, "Hello: World: Hi there!", 2) ));
console.log(sys.inspect( split(/:[0-9]/, "Hello:0World:1Hi there:2Working still?", 2) ));
