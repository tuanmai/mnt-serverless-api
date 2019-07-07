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

var _awsSdk = __webpack_require__(/*! aws-sdk */ "aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tableName = "orders";
if (process.env.ENV == "test") {
  _awsSdk2.default.config.update({ region: "us-east-1" });
  tableName = "orders-dev";
}

var dynamoDb = new _awsSdk2.default.DynamoDB.DocumentClient();

var getAll = function getAll() {
  var params = {
    TableName: tableName
  };

  return new _promise2.default(function (resolve) {
    dynamoDb.scan(params, function (error, result) {
      if (error) {
        resolve((0, _serviceResult.failureResult)(error));
      }
      resolve((0, _serviceResult.successResult)(result));
    });
  });
};

var query = function query(userId) {
  var params = {
    TableName: tableName,
    FilterExpression: "userId = :userId and orderStatus = :orderStatus",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":orderStatus": "pending"
    }
  };

  return new _promise2.default(function (resolve) {
    dynamoDb.scan(params, function (error, result) {
      if (error) {
        resolve((0, _serviceResult.failureResult)(error));
      }
      resolve((0, _serviceResult.successResult)(result));
    });
  });
};

var put = function put(data) {
  var params = {
    TableName: tableName,
    Item: data
  };

  return new _promise2.default(function (resolve) {
    dynamoDb.put(params, function (error) {
      if (error) {
        resolve((0, _serviceResult.failureResult)(error));
      }
      resolve((0, _serviceResult.successResult)(data));
    });
  });
};

var destroy = function destroy(data) {
  var params = {
    TableName: tableName,
    Key: {
      orderId: data.orderId,
      userId: data.userId
    }
  };

  return new _promise2.default(function (resolve) {
    dynamoDb.delete(params, function (error) {
      if (error) {
        resolve((0, _serviceResult.failureResult)(error));
      }
      resolve((0, _serviceResult.successResult)(data));
    });
  });
};

exports.default = { query: query, put: put, destroy: destroy, getAll: getAll };

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
exports.addItemsToOrder = exports.getOrder = exports.cancelOrder = exports.checkout = exports.addToCard = undefined;

var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ "babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _uuid = __webpack_require__(/*! uuid */ "uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _fp = __webpack_require__(/*! lodash/fp */ "lodash/fp");

var _response = __webpack_require__(/*! ./response */ "./response.js");

var _order = __webpack_require__(/*! ./db/order */ "./db/order.js");

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addToCard = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
    var data, pendingOrder, pendingOrders, newItem, newOrder, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = JSON.parse(event.body);
            pendingOrder = null;
            _context.next = 4;
            return _order2.default.query(data.userId);

          case 4:
            pendingOrders = _context.sent;

            if (pendingOrders.data.Count > 0) {
              pendingOrder = pendingOrders.data.Items[0];
            } else {
              pendingOrder = {
                userId: data.userId,
                orderId: _uuid2.default.v1(),
                orderStatus: "pending",
                createdAt: Date.now()
              };
            }

            newItem = { itemCode: data.itemCode, itemPrice: data.itemPrice };
            newOrder = addItemsToOrder(pendingOrder, [newItem]);
            _context.next = 10;
            return _order2.default.put(newOrder);

          case 10:
            result = _context.sent;

            if (!result.success) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", (0, _response.success)(result.data));

          case 13:
            return _context.abrupt("return", (0, _response.failure)(result.error));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function addToCard(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getOrder = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(event) {
    var pendingOrder, pendingOrders;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pendingOrder = null;
            _context2.next = 3;
            return _order2.default.query(event.pathParameters.userId);

          case 3:
            pendingOrders = _context2.sent;

            console.log(pendingOrders);
            if (pendingOrders.data.Count > 0) {
              pendingOrder = pendingOrders.data.Items[0];
            } else {
              pendingOrder = {};
            }

            return _context2.abrupt("return", (0, _response.success)(pendingOrder));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getOrder(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var checkout = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(event) {
    var data, pendingOrders, pendingOrder, newOrder, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            data = JSON.parse(event.body);
            _context3.next = 3;
            return _order2.default.query(data.userId);

          case 3:
            pendingOrders = _context3.sent;

            if (!(pendingOrders.data.Count == 0)) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", (0, _response.failure)("Order not found"));

          case 6:
            pendingOrder = pendingOrders.data.Items[0];
            newOrder = (0, _extends3.default)({}, pendingOrder, {
              orderStatus: "checkouted",
              shippingCost: 0
            });
            _context3.next = 10;
            return _order2.default.put(newOrder);

          case 10:
            result = _context3.sent;

            if (!result.success) {
              _context3.next = 14;
              break;
            }

            console.log(result);
            return _context3.abrupt("return", (0, _response.sendReceipt)(result.data));

          case 14:
            return _context3.abrupt("return", (0, _response.failure)(result.error));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function checkout(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var cancelOrder = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(event) {
    var data, pendingOrders, pendingOrder, newOrder, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            data = JSON.parse(event.body);
            _context4.next = 3;
            return _order2.default.query(data.userId);

          case 3:
            pendingOrders = _context4.sent;

            if (!(pendingOrders.data.Count == 0)) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", (0, _response.failure)("Order not found"));

          case 6:
            pendingOrder = pendingOrders.data.Items[0];
            newOrder = (0, _extends3.default)({}, pendingOrder, {
              orderStatus: "canceled"
            });
            _context4.next = 10;
            return _order2.default.put(newOrder);

          case 10:
            result = _context4.sent;

            if (!result.success) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt("return", (0, _response.success)(result.data));

          case 13:
            return _context4.abrupt("return", (0, _response.failure)(result.error));

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function cancelOrder(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var addItemsToOrder = function addItemsToOrder(order, items) {
  var newOrder = (0, _extends3.default)({}, order, {
    items: [],
    total: 0
  });
  (0, _fp.map)(function (item) {
    var orderItem = (0, _fp.find)(function (orderItem) {
      return orderItem.itemCode === item.itemCode;
    }, order.items);
    if (orderItem) {
      newOrder.items.push({
        itemCode: orderItem.itemCode,
        count: orderItem.count + 1,
        total: orderItem.total + item.itemPrice
      });
    } else {
      newOrder.items.push({
        itemCode: item.itemCode,
        count: 1,
        total: item.itemPrice
      });
    }
  }, items);

  (0, _fp.map)(function (item) {
    var orderItem = (0, _fp.find)(function (orderItem) {
      return orderItem.itemCode === item.itemCode;
    }, newOrder.items);
    if (!orderItem) {
      newOrder.items.push(item);
    }
  }, order.items);
  var newTotal = (0, _fp.reduce)(function (total, item) {
    return total + item.total;
  }, 0, newOrder.items);
  newOrder.total = newTotal;
  return newOrder;
};

// eslint-disable-next-line
exports.addToCard = addToCard;
exports.checkout = checkout;
exports.cancelOrder = cancelOrder;
exports.getOrder = getOrder;
exports.addItemsToOrder = addItemsToOrder;

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
exports.sendReceipt = exports.sendMessage = exports.failure = exports.success = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _fp = __webpack_require__(/*! lodash/fp */ "lodash/fp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildResponse = function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: (0, _stringify2.default)(body)
  };
};

var sendMessage = function sendMessage(message) {
  var formatedMessaged = {
    messages: [{
      text: message
    }]
  };
  return buildResponse(200, formatedMessaged);
};

var sendReceipt = function sendReceipt(order) {
  var addressMessage = {
    street_1: order.address || "",
    street_2: order.ward + ", " + order.district
  };
  var summaryMessage = {
    subtotal: order.total,
    shipping_cost: order.shippingCost,
    total_cost: order.total + order.shippingCost
  };
  var elementsMessage = (0, _fp.map)(function (item) {
    return {
      title: item.itemCode,
      quantity: item.count,
      price: item.total / item.count,
      currency: "VND"
    };
  }, order.items);

  var formatedMessaged = {
    messages: [{
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: order.userName || "Khách hàng",
          order_number: order.orderId,
          currency: "VND",
          payment_method: "COD",
          address: addressMessage,
          summary: summaryMessage,
          elements: elementsMessage
        }
      }
    }]
  };

  return buildResponse(200, formatedMessaged);
};

var success = function success(body) {
  return buildResponse(200, body);
};

var failure = function failure(body) {
  return sendMessage("Hix, hệ thống thiện tại đang bị lỗi 😢. Bạn vui lòng liên hệ trực tiếp tư vấn viên để được hỗ trợ");
};

exports.success = success;
exports.failure = failure;
exports.sendMessage = sendMessage;
exports.sendReceipt = sendReceipt;

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

/***/ "babel-runtime/helpers/extends":
/*!************************************************!*\
  !*** external "babel-runtime/helpers/extends" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/extends");

/***/ }),

/***/ "babel-runtime/regenerator":
/*!********************************************!*\
  !*** external "babel-runtime/regenerator" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "lodash/fp":
/*!****************************!*\
  !*** external "lodash/fp" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/fp");

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