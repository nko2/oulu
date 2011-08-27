/* 
 * JavaScript Snippets -- Foreach
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

var is = require('../is.js');

/* Foreach every element in an array */
function foreach_array() {
	var a=0, args=arguments, args_length=args.length;
	function _do(f) {
		var i, length, values;
		for(; a<args_length; ++a) {
			values = args[a];
			length = values.length;
			for(i=0; i<length; ++i) f(values[i], i);
		}
	}
	return {'do':_do};
}

/* Foreach every element in an object */
function foreach_object() {
	var a=0, args=arguments, args_length=args.length;
	function _do(f) {
		var i, values;
		for(; a<args_length; ++a) {
			values = args[a];
			for(i in values) if(values.hasOwnProperty(i)) f(values[i], i);
		}
	}
	return {'do':_do};
}

/* Foreach single element */
function foreach_single() {
	var args = arguments, args_length = args.length;
	function _do(f) {
		var a=0;
		for(; a<args_length; ++a) f(args[a]);
	}
	return {'do':_do};
}

/* Foreach every element in an array or object, otherwise the element itself */
function foreach_any() {
	var args = arguments, args_length = args.length;
	function _do(f) {
		var a=0, values;
		for(; a<args_length; ++a) {
			values = args[a];
			if(is.array(values)) foreach_array(values).do(f);
			else if(is.object(values)) foreach_object(values).do(f);
			else foreach_single(values).do(f);
		}
	}
	return {'do':_do};
}

exports.any = foreach_any;
exports.object = foreach_object;
exports.array = foreach_array;
exports.single = foreach_single;

/* EOF */
