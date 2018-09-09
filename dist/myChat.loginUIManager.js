'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var $loginButton = $('.login-button');
var $loadingWindow = $('.loading-window');
$loginButton.on('click', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          FirebaseAPI.setOnLoadingWindowChanged(function () {
            // $loadingWindow.removeClass('display-none');
            // $loadingWindow.addClass('display-block');
            $loadingWindow.css('display', 'block');
          });
          FirebaseAPI.setOnChangeWindowChanged(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return window.location.replace('/myChat');

                  case 2:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          })));

          _context2.next = 4;
          return FirebaseAPI.signIn();

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
})));