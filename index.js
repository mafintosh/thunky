'use strict'
module.exports = thunky

function thunky (fn) {
  var state = run
  return thunk

  function thunk (callback) {
    state(callback || noop)
  }

  function run (callback) {
    var stack = [callback]
    state = wait
    fn(done)

    function wait (callback) {
      stack.push(callback)
    }

    function done (err) {
      var args = arguments
      var apply = applier(args)

      state = isError(err) ? run : apply
      while (stack.length) stack.shift().apply(null, args)
    }
  }
}

function applier (args) {
  return args.length ? applyArgs : applyNoArgs

  function applyArgs (callback) {
    process.nextTick(function () {
      callback.apply(null, args)
    })
  }

  function applyNoArgs (callback) {
    process.nextTick(callback)
  }
}

function isError (err) { // inlined from util so this works in the browser
  return Object.prototype.toString.call(err) === '[object Error]'
}

function noop () {}
