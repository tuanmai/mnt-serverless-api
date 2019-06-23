(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./order.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./db/order.js":
/*!*********************!*\
  !*** ./db/order.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ "babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _serviceResult = __webpack_require__(/*! ./serviceResult */ "./db/serviceResult.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var query = function query(db, userId) {
  var params = {
    TableName: 'orders',
    FilterExpression: 'userId = :userId and orderStatus = :orderStatus',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':orderStatus': 'pending'
    }
  };

  return new _promise2.default(function (resolve) {
    db.scan(params, function (error, result) {
      if (error) {
        resolve((0, _serviceResult.failureResult)(error));
      }
      resolve((0, _serviceResult.successResult)(result));
    });
  });
};

var put = function put(db, data) {
  var params = {
    TableName: 'orders',
    Item: data
  };

  return new _promise2.default(function (resolve) {
    db.put(params, function (error) {
      if (error) {
        resolve((0, _serviceResult.failureResult)(error));
      }
      resolve((0, _serviceResult.successResult)(data));
    });
  });
};

exports.default = { query: query, put: put };

/***/ }),

/***/ "./db/serviceResult.js":
/*!*****************************!*\
  !*** ./db/serviceResult.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failureResult = exports.successResult = undefined;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var successResult = function successResult(data) {
  return { success: true, data: data };
};
var failureResult = function failureResult(error) {
  return { success: false, error: error };
};

exports.successResult = successResult;
exports.failureResult = failureResult;

/***/ }),

/***/ "./order.js":
/*!******************!*\
  !*** ./order.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToCard = undefined;

var _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _awsSdk = __webpack_require__(/*! aws-sdk */ "aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _uuid = __webpack_require__(/*! uuid */ "uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _response = __webpack_require__(/*! ./response */ "./response.js");

var _order = __webpack_require__(/*! ./db/order */ "./db/order.js");

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dynamoDb = new _awsSdk2.default.DynamoDB.DocumentClient();

var addToCard = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
    var data, item, pendingOrders, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = JSON.parse(event.body);
            item = {
              userId: data.userId,
              orderId: _uuid2.default.v1(),
              orderStatus: 'pending',
              createdAt: Date.now()
            };
            _context.next = 4;
            return _order2.default.query(dynamoDb, data.userId);

          case 4:
            pendingOrders = _context.sent;

            if (!(pendingOrders.count > 0)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', (0, _response.success)(pendingOrders.Items[0]));

          case 7:
            _context.next = 9;
            return _order2.default.put(dynamoDb, item);

          case 9:
            result = _context.sent;

            if (!result.success) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', (0, _response.success)(result.data));

          case 12:
            return _context.abrupt('return', (0, _response.failure)(result.error));

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function addToCard(_x) {
    return _ref.apply(this, arguments);
  };
}();

// eslint-disable-next-line
exports.addToCard = addToCard;

/***/ }),

/***/ "./response.js":
/*!*********************!*\
  !*** ./response.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failure = exports.success = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildResponse = function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: (0, _stringify2.default)(body)
  };
};

var success = function success(body) {
  return buildResponse(200, body);
};

var failure = function failure(body) {
  return buildResponse(500, body);
};

exports.success = success;
exports.failure = failure;

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/*!*******************************************************!*\
  !*** external "babel-runtime/core-js/json/stringify" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ "babel-runtime/core-js/promise":
/*!************************************************!*\
  !*** external "babel-runtime/core-js/promise" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),

/***/ "babel-runtime/helpers/asyncToGenerator":
/*!*********************************************************!*\
  !*** external "babel-runtime/helpers/asyncToGenerator" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "babel-runtime/regenerator":
/*!********************************************!*\
  !*** external "babel-runtime/regenerator" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ })

/******/ })));
//# sourceMappingURL=order.js.map