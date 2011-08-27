
var s = require('snippets');

console.log('"' + s.ltrim('  Hello World ') + '"');
console.log('"' + s.rtrim('  Hello World ') + '"');
console.log('"' + s.trim('  Hello World ') + '"');
console.log('"' + s.lpad('123', 5, '#') + '"');
console.log('"' + s.rpad('123', 5, '#') + '"');
