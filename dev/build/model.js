'use strict';

module.exports = function () {
  var model = Object.create(null),
      listeners = [];

  model.addListener = function (listener) {
    if (listeners.some(function (l) {
      return l === listener;
    }) === true) {
      console.log('addListener: the listener has been already added');
      return;
    }
    listeners.push(listener);
  };

  model.removeListener = function (listener) {
    var new_listeners = listeners.filter(function (l) {
      return l !== listener;
    });
    if (new_listeners.length === listeners.length) console.log('removeListener: cannot remove unknown listener');else listeners = new_listeners;
  };

  model.update = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(undefined, args);
    });
  };

  model.listenersNumber = function () {
    return listeners.length;
  };

  return model;
};