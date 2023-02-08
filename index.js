/* eslint-disable vars-on-top, no-var, prefer-template */
var isRegExp = function (re) { 
  return re instanceof RegExp;
};
var escapeRegExp = function escapeRegExp(string) {
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
};
var isString = function (value) {
  return typeof value === 'string';
};
var flatten = function (array) {
  var newArray = [];

  array.forEach(function (item) {
    if (Array.isArray(item)) {
      newArray = newArray.concat(item);
    } else {
      newArray.push(item);
    }
  });

  return newArray;
};

/**
 * Given a string, replace every substring that is matched by the `match` regex
 * with the result of calling `fn` on matched substring. The result will be an
 * array with all odd indexed elements containing the replacements. The primary
 * use case is similar to using String.prototype.replace except for React.
 *
 * React will happily render an array as children of a react element, which
 * makes this approach very useful for tasks like surrounding certain text
 * within a string with react elements.
 *
 * Example:
 * matchReplace(
 *   'Emphasize all phone numbers like 884-555-4443.',
 *   /([\d|-]+)/g,
 *   (number, i) => <strong key={i}>{number}</strong>
 * );
 * // => ['Emphasize all phone numbers like ', <strong>884-555-4443</strong>, '.'
 *
 * @param {string} str
 * @param {RegExp|str} match Must contain a matching group
 * @param {function} fn
 * @return {array}
 */
function replaceString(str, match, fn) {
  if (str === '') {
    return str;
  } else if (!str || !isString(str)) {
    throw new TypeError('First argument to react-string-replace#replaceString must be a string');
  }

  var re = isRegExp(match) ? new RegExp(match) : new RegExp('(' + escapeRegExp(match) + ')', 'gi');
  var results = [];
  var curCharStart = 0;

  for (var result = re.exec(str), i = 0; result; result = re.exec(str), i++) {
    if (result.index > curCharStart) {
      results.push(str.slice(curCharStart, result.index));
    }

    results.push(fn(result[0], i, result.index));
    curCharStart = result.index + result[0].length;
    re.lastIndex = curCharStart;
  }

  // End fencepost
  if (str.length > curCharStart) {
    results.push(str.slice(curCharStart));
  }

  return results;
}

module.exports = function reactStringReplace(source, match, fn) {
  if (!Array.isArray(source)) source = [source];

  return flatten(source.map(function(x) {
    return isString(x) ? replaceString(x, match, fn) : x;
  }));
};
