"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var stripe_js_1 = require("@stripe/stripe-js");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var getConnectedStripeAccountID_js_1 = require("../getConnectedStripeAccountID.js");
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            ownerDisplayName: '',
        };
        _this.state = state;
        _this.handleCompletePurchase = _this.handleCompletePurchase.bind(_this);
        _this.renderProduct = _this.renderProduct.bind(_this);
        return _this;
    }
    Product.prototype.componentWillMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ownerDisplayName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserNameByID(this.props.product.productObject.userID)];
                    case 1:
                        ownerDisplayName = _a.sent();
                        this.setState({
                            ownerDisplayName: ownerDisplayName,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Product.prototype.getUserNameByID = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/user/".concat(userID))
                            .then(function (response) { return response.json(); })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user.displayName];
                }
            });
        });
    };
    Product.prototype.handleCompletePurchase = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var product, productUser, connectedStripeAccountID, stripe_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock submit for fw-form-process-event effect
                        // const mockForm = document.createElement('form');
                        // document.querySelector('.fw-form-process-event').append(mockForm);
                        // let submitEvent = new Event('submit');
                        // submitEvent.submitter = e.target;
                        // mockForm.dispatchEvent(submitEvent);
                        e.target.parentElement.parentElement.append((new DOMParser()).parseFromString('<div class="lds-facebook"><div></div><div></div><div></div></div>', 'text/html').body);
                        product = this.props.product;
                        return [4 /*yield*/, fetch("/user/".concat(product.productObject.userID))
                                .then(function (response) { return response.json(); })];
                    case 1:
                        productUser = _a.sent();
                        connectedStripeAccountID = (0, getConnectedStripeAccountID_js_1.getConnectedStripeAccountID)(productUser);
                        if (!connectedStripeAccountID) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, stripe_js_1.loadStripe)(process.env.STRIPE_PUBLIC_KEY || '')];
                    case 2:
                        stripe_1 = _a.sent();
                        fetch('/create-checkout-session', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                priceID: product.priceID,
                                connectedStripeAccountID: connectedStripeAccountID,
                            })
                        })
                            .then(function (response) {
                            return response.json();
                        })
                            .then(function (session) {
                            return stripe_1.redirectToCheckout({ sessionId: session.id });
                        })
                            .then(function (result) {
                            // If `redirectToCheckout` fails due to a browser or network
                            // error, you should display the localized error message to your
                            // customer using `error.message`.
                            if (result.error) {
                                alert(result.error.message);
                            }
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Product.prototype.renderProduct = function (product) {
        var _this = this;
        var productObject = product.productObject;
        switch (product.productObjectCollection) {
            case 'premium_video_chat_listings':
                var timeSlots_1 = productObject.timeSlots;
                if (!timeSlots_1) {
                    timeSlots_1 = [];
                }
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "thumbnail-preview img-container" },
                        React.createElement("img", { style: { height: '100%', width: '100%', objectFit: 'cover' }, src: productObject.thumbnailSrc, alt: productObject.thumbnailSrc })),
                    React.createElement("div", { className: "fw-space noleft noright" },
                        React.createElement("h3", { style: { marginBottom: '5px' } },
                            "Topic: ",
                            productObject.topic),
                        React.createElement("h4", null,
                            "Language: ",
                            productObject.languageOfTopic)),
                    timeSlots_1.length ?
                        React.createElement("div", { style: { maxHeight: '250px', overflowY: 'auto' } }, timeSlots_1.map(function (timeSlot) {
                            return React.createElement("div", { key: timeSlots_1.indexOf(timeSlot) },
                                React.createElement("p", null,
                                    React.createElement("b", null,
                                        "Video Chat with: ",
                                        _this.state.ownerDisplayName)),
                                React.createElement("p", null,
                                    React.createElement("b", null,
                                        timeSlot.date,
                                        " - ",
                                        timeSlot.time.convertTo12HourTime())),
                                React.createElement("a", { className: "button", href: "/video-chat?withUserID=".concat(productObject.userID), "aria-label": "Go to Video Chat with ".concat(_this.state.ownerDisplayName) },
                                    "Go to Video Chat",
                                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight })));
                        }))
                        :
                            ''));
        }
    };
    Product.prototype.render = function () {
        var product = this.props.product;
        var cost = product.cost;
        cost = cost / 100;
        cost = cost.toFixed(2);
        return (React.createElement("div", { className: "fw-form fw-form-process-event" },
            this.renderProduct(product),
            React.createElement("p", null,
                "Cost: ",
                cost,
                " ",
                product.currency),
            React.createElement("p", null,
                "Ordered on: ",
                product.orderedOn),
            product.status == 'Unpaid' ?
                React.createElement("p", null,
                    "Status: ",
                    React.createElement("b", null,
                        product.status,
                        ":"),
                    "\u00A0",
                    React.createElement("button", { className: "button", onClick: this.handleCompletePurchase },
                        "Complete Purchase",
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight })))
                :
                    React.createElement("p", null,
                        "Status: ",
                        product.status)));
    };
    return Product;
}(React.Component));
exports.default = Product;
