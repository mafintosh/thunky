var isError = function(err) { // inlined from util so this works in the browser
	return Object.prototype.toString.call(err) === '[object Error]';
};

var memolite = function(fn) {
	var run = function(callback) {
		var stack = [callback];

		action = function(callback) {
			stack.push(callback);
		};

		fn(function(err) {
			var args = arguments;
			var apply = function(callback) {
				if (callback) callback.apply(null, args);
			};

			action = isError(err) ? run : apply;
			while (stack.length) apply(stack.shift());
		});
	};

	var action = run;

	return function(callback) {
		action(callback);
	};
};

module.exports = memolite;