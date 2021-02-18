// JavaScript: The Definitive Guide, 6th Edition
// Example 8-5. A Function.bind() method for ECMAScript 3
if (!Function.prototype.bind) {
  Function.prototype.bind = function(o /*, args */ ) {
    // Save the this and arguments values into variables so we can
    // use them in the nested function below.
    var self = this, boundArgs = arguments;
    // The return value of the bind() method is a function
    return function() {
      // Build up an argument list, starting with any args passed
      // to bind after the first one, and follow those with all args
      // passed to this function.
      var args = [], i;
      for (i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);
      for (i = 0; i < arguments.length; i++) args.push(arguments[i]);
      // Now invoke self as a method of o, with those arguments
      return self.apply(o, args);
    };
  };
}

(function (window, document, undefined) {
  'use strict';

  var entries = {
    'value': [],
    'add': function (event) {
      var key = event.target.textContent;
      this['value'].push(key);
    },
    'get': function () {
      return this['value'].join('');
    },
    'update': function (value) {
      this['value'] = [value];
    },
    'undo': function () {
      this['value'].pop();
    },
    'calculate': function () {
      var expression = this.get()
        .replace(/÷/g, '/')
        .replace(/×/g, '*');
      try {
        var evaluatingExpression = (
          new Function('return ' + expression)()
        );
        this.update(evaluatingExpression);
      } catch (error) {
        this.update('error');
        var self = this;
        setTimeout(function () {
          self.undo();
        }, 500);
      }
    }
  };

  var display = {
    'element': document.querySelector('#calc-display'),
    'getValue': function() {
      return entries.get();
    },
    'update': function () {
      var value = this.getValue();
      this['element'].value = value;
    }
  };

  (function enableKeys () {
    var keys = Array.prototype.slice.call(document.querySelectorAll('.key'));
    var keyCe = document.querySelector('#key-ce');
    var keyEqual = document.querySelector('#key-equal');
    keyCe.addEventListener('click', entries.undo.bind(entries));
    keyCe.addEventListener('click', display.update.bind(display));
    keyEqual.addEventListener('click', entries.calculate.bind(entries));
    keyEqual.addEventListener('click', display.update.bind(display));
    keys.map(function (key) {
      key.addEventListener('click', entries.add.bind(entries));
      key.addEventListener('click', display.update.bind(display));
    });
  })();

})(window, document);