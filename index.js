var isError = function(err) { // inlined from util so this works in the browser
	return Object.prototype.toString.call(err) === '[object Error]';
};

var thunky = function(fn) {
	var run = function(callback) {
		var stack = [callback];

		state = function(callback) {
			stack.push(callback);
		};

		fn(function(err) {
			var args = arguments;
			var apply = function(callback) {
				if (callback) callback.apply(null, args);
			};

			var applyNextTick = function(callback) {
				if (callback) process.nextTick(function () { callback.apply(null, args); });
			};

			state = isError(err) ? run : applyNextTick;
			while (stack.length) apply(stack.shift());
		});
	};

	var state = run;

	return function(callback) {
		state(callback);
	};
};

module.exports = thunky;
