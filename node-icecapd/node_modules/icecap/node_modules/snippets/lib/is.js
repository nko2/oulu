/* 
 * JavaScript Snippets -- Functions to check types of variables
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

/* Returns true if value exists, meaning that it is not undefined. Please note that it returns true for null values, too. */
exports.defined = function is_defined(value) {
	var undefined;
	return (value===undefined) ? false : true;
}

/* Returns true if value exists and is an array */
exports.array = function is_array(value) {
	return (value && (value instanceof Array)) ? true : false;
}

/* Returns true if value exists and is an object */
exports.object = function is_object(value) {
	return (value && (typeof value === 'object')) ? true : false;
}

/* EOF */
