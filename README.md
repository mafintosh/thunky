# memolite

Extremely simple memoizing for async functions.
It is available through npm

	npm install memolite

## Usage

memolite memoizes async functions on the form `function(callback) { ... }`

``` js
var memolite = require('memolite');
var fs = require('fs');

var random = memolite(function(callback) {
	console.log('I am only called once');
	setTimeout(function() {
		callback(Math.random());
	}, 1000);
});

random(function(num) {
	console.log(num); // prints a random number after 1s
});

random(function(num) {
	console.log(num); // prints the same number as above
});
```

If you wanted to do a file reader that only read files once and remembered the result you would do

``` js
var memolite = require('memolite');
var fs = require('fs');

var fileReader = function(filename) {
	return memolite(function(callback) {
		console.log('reading '+filename);
		fs.readFile(filename, callback);
	});
};

var readReadme = fileReader('README.md');

readReadme(function(err, data) { // prints 'reading README.md'
	console.log('README is '+data);
});

readReadme(function(err, data) { // memolite will wait for the read to finish and return the data
	console.log('README is '+data);
});
```

If an error is passed to the callback then memolite will not remember the result

``` js
var run = memolite(function(callback) {
	console.log('running');
	callback(new Error('bad things'));
});

run(function(err) { // 'running' is printed
	console.log(err);
});

run(function(err) { // 'running' is printed again
	console.log(err);
});
```

A great usecase for memolite is doing lazy operations.

``` js
var makeFolder = memolite(function(callback) {
	fs.mkdir('/tmp/my-folder', callback);
});

var writeFile = function(filename, data, callback) {
	makeFolder(function(err) {
		if (err) return callback(err);
		fs.writeFile('/tmp/my-folder/'+filename, data, callback);
	});
};
```

Calling `writeFile` multiple times would result in `fs.mkdir(...)` being called only once (if there are no errors).

## License

MIT