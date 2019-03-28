'use strict'

var nextTick = nextTickArgs
process.nextTick(upgrade, 42) // pass 42 and see if upgrade is called with it

module.exports = thunky

function thunky (fn) {
  var state = run
  return thunk

  function thunk (callback) {
    var promise
    if (!callback) {
      promise = new Promise((resolve, reject) => {
        callback = err => err ? reject(err) : resolve()
      })
    }
    state(callback || noop)
    return promise
  }

  function run (callback) {
    var stack = [callback]
    state = wait
    var ret = fn(done)

    if (isPromise(ret)) {
      ret.then(res => done(null, res)).catch(err => done(err))
    }

    function wait (callback) {
      stack.push(callback)
    }

    function done (err) {
      var args = arguments
      state = isError(err) ? run : finished
      while (stack.length) finished(stack.shift())

      function finished (callback) {
        nextTick(apply, callback, args)
      }
    }
  }
}

function isError (err) { // inlined from util so this works in the browser
  return Object.prototype.toString.call(err) === '[object Error]'
}

function noop () {}

function apply (callback, args) {
  callback.apply(null, args)
}

function upgrade (val) {
  if (val === 42) nextTick = process.nextTick
}

function nextTickArgs (fn, a, b) {
  process.nextTick(function () {
    fn(a, b)
  })
}

function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}
