'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formActionSaga = exports.createFormAction = exports.PROMISE = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _effects = require('redux-saga/effects');

var _marked = [formActionSaga].map(regeneratorRuntime.mark);

var identity = function identity(i) {
  return i;
};
var PROMISE = '@@redux-form-saga/PROMISE';
var status = ['REQUEST', 'SUCCESS', 'FAILURE'];

function createFormAction(requestAction, types) {
  var payloadCreator = arguments.length <= 2 || arguments[2] === undefined ? identity : arguments[2];

  var actionMethods = {};
  var formAction = function formAction(payload) {
    return {
      type: PROMISE,
      payload: payload
    };
  };

  // Allow a type prefix to be passed in
  if (typeof requestAction === 'string') {
    requestAction = status.map(function (s) {
      var a = requestAction + '_' + s;
      var subAction = function subAction(payload) {
        return {
          type: a,
          payload: payloadCreator(payload)
        };
      };

      // translate specific actionType to generic actionType
      actionMethods[s] = a;
      actionMethods[s.toLowerCase()] = subAction;

      return a;
    })[0];

    if (types) {
      payloadCreator = types;
    }

    types = [actionMethods.SUCCESS, actionMethods.FAILURE];
  }

  if (types.length !== 2) {
    throw new Error('Must include two action types: [ SUCCESS, FAILURE ]');
  }

  return Object.assign(function (data, dispatch) {
    return new Promise(function (resolve, reject) {
      dispatch(formAction({
        request: requestAction(data),
        defer: { resolve: resolve, reject: reject },
        types: types
      }));
    });
  }, actionMethods);
};

function formActionSaga() {
  var action, _action$payload, request, defer, types, resolve, reject, _types, SUCCESS, FAIL, winner;

  return regeneratorRuntime.wrap(function formActionSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 27;
            break;
          }

          _context.next = 3;
          return (0, _effects.take)(PROMISE);

        case 3:
          action = _context.sent;
          _action$payload = action.payload;
          request = _action$payload.request;
          defer = _action$payload.defer;
          types = _action$payload.types;
          resolve = defer.resolve;
          reject = defer.reject;
          _types = _slicedToArray(types, 2);
          SUCCESS = _types[0];
          FAIL = _types[1];
          _context.next = 15;
          return (0, _effects.put)(request);

        case 15:
          _context.next = 17;
          return (0, _effects.race)({
            success: (0, _effects.take)(SUCCESS),
            fail: (0, _effects.take)(FAIL)
          });

        case 17:
          winner = _context.sent;

          if (!winner.success) {
            _context.next = 23;
            break;
          }

          _context.next = 21;
          return (0, _effects.call)(resolve, winner.success);

        case 21:
          _context.next = 25;
          break;

        case 23:
          _context.next = 25;
          return (0, _effects.call)(reject, winner.fail);

        case 25:
          _context.next = 0;
          break;

        case 27:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

exports.PROMISE = PROMISE;
exports.createFormAction = createFormAction;
exports.formActionSaga = formActionSaga;
exports.default = formActionSaga;