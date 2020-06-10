export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Check if the variable is number.
 *
 * @param  any $x
 * @return bool
 */
export function isNumber(x: any): x is number {
  return typeof x === "number";
}


/**
 * Check if the variable is string.
 *
 * @param  any $x
 * @return bool
 */
export function isString(x: any): x is string {
  return typeof x === "string";
}


/**
 * Did you ever have phantom console.log - or more specifically you've no idea where it was happening?
 * Upgrading log to show where logging is happening
 * Just run this function before your code it will show you which file or function the console.log is running from
 * Inspiration: https://remysharp.com/2014/05/23/where-is-that-console-log
 */
export function debugConsoleLog() {
  ['log', 'warn'].forEach(function(method) {
    var old = console[method];
    console[method] = function() {
      var stack = (new Error()).stack.split(/\n/);
      // Chrome includes a single "Error" line, FF doesn't.
      if (stack[0].indexOf('Error') === 0) {
        stack = stack.slice(1);
      }
      var args = [].slice.apply(arguments).concat([stack[1].trim()]);
      return old.apply(console, args);
    };
  });
}