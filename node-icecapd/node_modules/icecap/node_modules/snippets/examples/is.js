
var is = require('snippets').is;

var a = [1,2,3,4,5];
if(is.array(a)) console.log("a is array");
else if(is.object(a)) console.log("a is object");
else console.log("a is not array or object");

var b = {'foo':1, 'bar':2};
if(is.array(b)) console.log("b is array");
else if(is.object(b)) console.log("b is object");
else console.log("b is not array nor object");

var c = 2;
if(is.array(c)) console.log("c is array");
else if(is.object(c)) console.log("c is object");
else console.log("c is not array nor object");

