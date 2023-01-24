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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var graphQLFetch_js_1 = require("../graphQLFetch.js");
var PremiumVideoChatListing = /** @class */ (function (_super) {
    __extends(PremiumVideoChatListing, _super);
    function PremiumVideoChatListing(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            ownerDisplayName: '',
            timeSlots: [],
        };
        _this.state = state;
        _this.handleTimeSlotChange = _this.handleTimeSlotChange.bind(_this);
        _this.getUserNameByID = _this.getUserNameByID.bind(_this);
        _this.renderTimeSlots = _this.renderTimeSlots.bind(_this);
        _this.handleBuyNow = _this.handleBuyNow.bind(_this);
        return _this;
    }
    PremiumVideoChatListing.prototype.componentWillMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ownerDisplayName, propTimeSlots, newTimeSlots, _i, propTimeSlots_1, timeSlot, newTimeSlot, customerDisplayName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ownerDisplayName = '';
                        if (!this.props.premiumVideoChatListing.userID) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserNameByID(this.props.premiumVideoChatListing.userID)];
                    case 1:
                        ownerDisplayName = _a.sent();
                        _a.label = 2;
                    case 2:
                        propTimeSlots = this.props.premiumVideoChatListing.timeSlots;
                        newTimeSlots = [];
                        _i = 0, propTimeSlots_1 = propTimeSlots;
                        _a.label = 3;
                    case 3:
                        if (!(_i < propTimeSlots_1.length)) return [3 /*break*/, 7];
                        timeSlot = propTimeSlots_1[_i];
                        newTimeSlot = __assign({}, timeSlot);
                        customerDisplayName = '';
                        if (!timeSlot.customerUserID) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getUserNameByID(timeSlot.customerUserID)];
                    case 4:
                        customerDisplayName = _a.sent();
                        _a.label = 5;
                    case 5:
                        newTimeSlot.customerDisplayName = customerDisplayName;
                        newTimeSlots.push(newTimeSlot);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7:
                        this.setState({
                            ownerDisplayName: ownerDisplayName,
                            timeSlots: newTimeSlots,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListing.prototype.componentWillReceiveProps = function (nextProps) {
        return __awaiter(this, void 0, void 0, function () {
            var stateTimeSlots, propTimeSlots, newTimeSlots, _i, propTimeSlots_2, timeSlot, newTimeSlot, customerDisplayName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.timeSlots != nextProps.premiumVideoChatListing.timeSlots)) return [3 /*break*/, 7];
                        stateTimeSlots = this.state.timeSlots;
                        propTimeSlots = nextProps.premiumVideoChatListing.timeSlots;
                        newTimeSlots = [];
                        _i = 0, propTimeSlots_2 = propTimeSlots;
                        _a.label = 1;
                    case 1:
                        if (!(_i < propTimeSlots_2.length)) return [3 /*break*/, 5];
                        timeSlot = propTimeSlots_2[_i];
                        newTimeSlot = __assign(__assign({}, timeSlot), { completed: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].completed : timeSlot.completed, booked: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].booked : timeSlot.booked, paid: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].paid : timeSlot.paid });
                        customerDisplayName = '';
                        if (!timeSlot.customerUserID) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getUserNameByID(timeSlot.customerUserID)];
                    case 2:
                        customerDisplayName = _a.sent();
                        _a.label = 3;
                    case 3:
                        newTimeSlot.customerDisplayName = customerDisplayName;
                        newTimeSlots.push(newTimeSlot);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [4 /*yield*/, this.setState({
                            timeSlots: newTimeSlots,
                        })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListing.prototype.handleTimeSlotChange = function (checked, timeSlotIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var authenticatedUserID, timeSlots, timeSlot, query, graphql_timeSlots_1, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticatedUserID = this.props.authenticatedUserID;
                        if (!authenticatedUserID) return [3 /*break*/, 3];
                        timeSlots = this.state.timeSlots;
                        timeSlot = timeSlots[timeSlotIndex];
                        query = '';
                        if (this.props.view == 'owner') {
                            timeSlot.completed = checked;
                            query = "mutation updatePremiumVideoChatListing($listingID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){\n          updatePremiumVideoChatListing(listingID: $listingID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){\n            timeSlots {\n              customerUserID\n              date\n              time\n              completed\n              booked\n              paid\n            }\n          }\n        }";
                        }
                        else {
                            timeSlot.booked = checked;
                            timeSlot.tempCustomerUserID = checked ? authenticatedUserID : null;
                        }
                        timeSlots[timeSlotIndex] = timeSlot;
                        this.setState({
                            timeSlots: timeSlots,
                        });
                        if (!query) return [3 /*break*/, 2];
                        graphql_timeSlots_1 = [];
                        timeSlots.forEach(function (timeSlotData) {
                            graphql_timeSlots_1.push({
                                customerUserID: timeSlotData.customerUserID,
                                date: timeSlotData.date,
                                time: timeSlotData.time,
                                completed: timeSlotData.completed,
                                booked: timeSlotData.booked,
                                paid: timeSlotData.paid,
                            });
                        });
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, {
                                listingID: this.props.premiumVideoChatListing._id,
                                premiumVideoChatListing: {
                                    timeSlots: graphql_timeSlots_1
                                }
                            }, false)];
                    case 1:
                        data = _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        alert('Must be signed in to buy.');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListing.prototype.getUserNameByID = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/user/".concat(userID))
                            .then(function (response) { return response.json(); })];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            return [2 /*return*/, user.displayName];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    PremiumVideoChatListing.prototype.renderTimeSlots = function () {
        var _this = this;
        var timeSlots = this.state.timeSlots;
        switch (this.props.view) {
            case 'owner':
                return timeSlots.map(function (timeSlot) {
                    return React.createElement("div", { key: timeSlots.indexOf(timeSlot), style: { margin: '10px 0', borderBottom: '1px dotted black' } }, timeSlot.customerUserID ?
                        React.createElement("div", null,
                            React.createElement("p", null,
                                React.createElement("b", null,
                                    "Video Chat with: ",
                                    timeSlot.customerDisplayName)),
                            React.createElement("p", null,
                                React.createElement("b", null,
                                    timeSlot.date,
                                    " - ",
                                    timeSlot.time.convertTo12HourTime())),
                            timeSlot.booked && !timeSlot.paid ?
                                React.createElement("div", null,
                                    React.createElement("b", null, "!! CUSTOMER HAS NOT COMPLETED THIS PURCHASE !!"))
                                :
                                    '',
                            React.createElement("a", { className: "button", href: "/video-chat?forUserID=".concat(timeSlot.customerUserID) },
                                "Go to Video Chat",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight })),
                            React.createElement("div", { className: "field checkbox", style: { whiteSpace: 'nowrap' } },
                                timeSlot.completed ?
                                    React.createElement(React.Fragment, null,
                                        React.createElement("input", { id: "timeSlot".concat(timeSlots.indexOf(timeSlot)), type: "checkbox", defaultChecked: true, onClick: function (e) { return _this.handleTimeSlotChange(e.target.checked, timeSlots.indexOf(timeSlot)); } }))
                                    :
                                        React.createElement(React.Fragment, null,
                                            React.createElement("input", { id: "timeSlot".concat(timeSlots.indexOf(timeSlot)), type: "checkbox", onClick: function (e) { return _this.handleTimeSlotChange(e.target.checked, timeSlots.indexOf(timeSlot)); } })),
                                React.createElement("label", { htmlFor: "timeSlot".concat(timeSlots.indexOf(timeSlot)) }, "Mark Completed")))
                        :
                            React.createElement(React.Fragment, null,
                                React.createElement("div", { style: { margin: '10px 0', minHeight: '36px', display: 'inline-flex', alignItems: 'center' } },
                                    React.createElement("b", null, "Available"),
                                    React.createElement("span", null,
                                        "\u00A0",
                                        timeSlot.date,
                                        " - ",
                                        timeSlot.time.convertTo12HourTime()))));
                });
            case 'customer':
                return timeSlots.map(function (timeSlot) {
                    return React.createElement("div", { key: timeSlots.indexOf(timeSlot) }, timeSlot.customerUserID ?
                        ''
                        :
                            React.createElement("div", { className: "field checkbox", style: { whiteSpace: 'nowrap' } },
                                timeSlot.booked ?
                                    React.createElement(React.Fragment, null,
                                        React.createElement("input", { id: "timeSlot".concat(timeSlots.indexOf(timeSlot)), type: "checkbox", defaultChecked: true, onClick: function (e) { return _this.handleTimeSlotChange(e.target.checked, timeSlots.indexOf(timeSlot)); } }))
                                    :
                                        React.createElement(React.Fragment, null,
                                            React.createElement("input", { id: "timeSlot".concat(timeSlots.indexOf(timeSlot)), type: "checkbox", onClick: function (e) { return _this.handleTimeSlotChange(e.target.checked, timeSlots.indexOf(timeSlot)); } })),
                                React.createElement("label", { htmlFor: "timeSlot".concat(timeSlots.indexOf(timeSlot)) },
                                    timeSlot.date,
                                    " - ",
                                    timeSlot.time.convertTo12HourTime())));
                });
        }
    };
    PremiumVideoChatListing.prototype.handleBuyNow = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, premiumVideoChatListing, authenticatedUserID, timeSlots, query, newTimeSlots_1, data, productUser, stripe_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Mock submit for fw-form-process-event effect
                        // const mockForm = document.createElement('form');
                        // document.querySelector('.fw-form-process-event').append(mockForm);
                        // let submitEvent = new Event('submit');
                        // submitEvent.submitter = e.target;
                        // mockForm.dispatchEvent(submitEvent);
                        e.target.parentElement.parentElement.append((new DOMParser()).parseFromString('<div class="lds-facebook"><div></div><div></div><div></div></div>', 'text/html').body);
                        _a = this.props, premiumVideoChatListing = _a.premiumVideoChatListing, authenticatedUserID = _a.authenticatedUserID;
                        timeSlots = this.state.timeSlots;
                        if (!authenticatedUserID) return [3 /*break*/, 5];
                        query = "mutation createProduct($productObjectCollection: String!, $productDescription: String!, $productObjectID: ID!, $userID: ID!, $productObjectUpdateData: String!){\n        createProduct(productObjectCollection: $productObjectCollection, productDescription: $productDescription, productObjectID: $productObjectID, userID: $userID, productObjectUpdateData: $productObjectUpdateData){\n          _id\n          userID\n          cost\n          currency\n          orderedOn\n          productObject {\n            ... on PremiumVideoChatListing{\n              _id\n              userID\n              topic\n              languageOfTopic\n              duration\n              thumbnailSrc\n              price\n              currency\n            }\n          }\n          priceID\n        }\n      }";
                        newTimeSlots_1 = [];
                        timeSlots.forEach(function (timeSlot) {
                            var newTimeSlot = {
                                date: timeSlot.date,
                                time: timeSlot.time,
                                customerUserID: timeSlot.customerUserID,
                                completed: timeSlot.completed,
                                booked: timeSlot.booked,
                                paid: timeSlot.paid,
                                shouldAddProductID: false,
                            };
                            if (timeSlot.tempCustomerUserID) {
                                newTimeSlot.shouldAddProductID = true;
                                newTimeSlot.customerUserID = timeSlot.tempCustomerUserID;
                            }
                            newTimeSlots_1.push(newTimeSlot);
                        });
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, {
                                productObjectCollection: 'premium_video_chat_listings',
                                productDescription: 'Premium Video Chat',
                                productObjectID: premiumVideoChatListing._id,
                                userID: authenticatedUserID,
                                productObjectUpdateData: JSON.stringify({
                                    timeSlots: newTimeSlots_1,
                                })
                            })];
                    case 1:
                        data = _b.sent();
                        if (!data.createProduct) return [3 /*break*/, 4];
                        if (!(data.createProduct.priceID && premiumVideoChatListing.userID)) return [3 /*break*/, 4];
                        return [4 /*yield*/, fetch("/user/".concat(premiumVideoChatListing.userID))
                                .then(function (response) { return response.json(); })];
                    case 2:
                        productUser = _b.sent();
                        if (!productUser.connectedStripeAccountID) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, stripe_js_1.loadStripe)(process.env.STRIPE_PUBLIC_KEY || '')];
                    case 3:
                        stripe_1 = _b.sent();
                        fetch('/create-checkout-session', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                priceID: data.createProduct.priceID,
                                connectedStripeAccountID: productUser.connectedStripeAccountID,
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
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        alert('Must be signed in to buy.');
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListing.prototype.render = function () {
        var ownerDisplayName = this.state.ownerDisplayName;
        var _a = this.props.premiumVideoChatListing, topic = _a.topic, languageOfTopic = _a.languageOfTopic, duration = _a.duration, price = _a.price, currency = _a.currency, thumbnailSrc = _a.thumbnailSrc;
        return (React.createElement("div", null,
            React.createElement("div", { className: "fw-typography-spacing" },
                React.createElement("h3", null, ownerDisplayName),
                React.createElement("h4", null, topic),
                React.createElement("p", null,
                    React.createElement("b", null,
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faFlag }),
                        "\u00A0",
                        languageOfTopic)),
                React.createElement("p", null,
                    React.createElement("b", null,
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faClock }),
                        "\u00A0",
                        duration)),
                React.createElement("p", null,
                    React.createElement("b", null,
                        price,
                        "\u00A0",
                        currency))),
            React.createElement("div", { className: "thumbnail-preview img-container" },
                React.createElement("img", { style: { height: '100%', width: '100%', objectFit: 'cover' }, src: thumbnailSrc, alt: thumbnailSrc })),
            React.createElement("h4", { style: { margin: '35px 0 10px 0', fontSize: '1.5em' } }, "Timeslots"),
            React.createElement("div", { className: "fw-form fw-form-process-event", style: { maxHeight: '250px', overflowY: 'auto' } }, this.renderTimeSlots()),
            this.props.view == 'customer' && this.state.timeSlots.filter(function (timeSlot) { return timeSlot.tempCustomerUserID; }).length ?
                React.createElement("button", { className: "button", onClick: this.handleBuyNow },
                    "Buy Now",
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPlus }))
                :
                    ''));
    };
    return PremiumVideoChatListing;
}(React.Component));
exports.default = PremiumVideoChatListing;
