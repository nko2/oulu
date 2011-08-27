/* 
 * JavaScript Snippets -- Main Entry Library
 * https://github.com/jheusala/js-snippets
 * Version 0.0.20110727
 */

/*
 * Copyright (C) 2011 by Jaakko-Heikki Heusala <jheusala@iki.fi>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to 
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do 
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */

var foreach = require('./foreach').any;

/* */
function init(v, d) {
	var undefined;
	return (v === undefined) ? d : v;
}

/* A different implementation to join array into string. Supports multiple separators. */
function join(data, separators, def_separator) {
	var undefined, buf, separator, 
	    def_separator = init(def_separator, ",");
	
	foreach(data).do(function(value) {
		if(buf === undefined) {
			buf = value;
			return;
		}
		separator = separators.shift();
		buf += init(separator, def_separator) + value;
	});
	return buf;
}

/* A different implementation for splitting data into array. The limit parameter is different from standard JavaScript split. For example when data="a;b;c", seperator=";" and limit=2, the result will be ["a";"b;c"]. */
function split(separator, data, limit) {
	var data = ""+data,
	    results = data.split(separator);
	if(!limit) return results;
	if(results.length <= limit) return results;
	var separators = data.match(new RegExp(separator.source, "g"));
	results[limit-1] = join(results.slice(limit-1), separators.slice(limit-1));
	results.length = limit;
	return results;
}

/* */
function pass(values) {
	var obj = {
		'on':function(callback) { 
			callback.apply({}, values);
		}
	};
	return obj;
}

/* Trimmers */
function ltrim (str) { return (""+str).replace(/^\s+/g, ""); }
function rtrim (str) { return (""+str).replace(/\s+$/g, ""); }
function trim (str) { return ltrim(rtrim(str)); }

/* Padders */

/* Pad string to specific length from left */
function lpad(str, len, padstr) {
	var str = ""+str;
	if(str.length >= len) return str;
	return Array(len + 1 - str.length).join(padstr) + str;
}

/* Pad string to specific length from right */
function rpad(str, len, padstr) {
	var str = ""+str;
	if(str.length >= len) return str;
	return str + Array(len + 1 - str.length).join(padstr);
}

/* Exports */
exports.is = require('./is.js');
exports.foreach = foreach;
exports.split = split;
exports.join = join;
exports.pass = pass;
//exports.init = init;
exports.trim = trim;
exports.ltrim = ltrim;
exports.rtrim = rtrim;
exports.lpad = lpad;
exports.rpad = rpad;

/* EOF */
