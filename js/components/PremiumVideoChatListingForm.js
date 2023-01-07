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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var languages = require('language-list')();
var graphQLFetch_js_1 = require("../graphQLFetch.js");
var PremiumVideoChatListing_js_1 = require("./PremiumVideoChatListing.js");
var RemoveConfirmationModal_js_1 = require("./RemoveConfirmationModal.js");
var LanguageSelector_js_1 = require("./LanguageSelector.js");
function findInputElement(element) {
    if (!element)
        return;
    var answerElement = element.querySelector('input');
    if (!answerElement) {
        return findInputElement(element.parentElement);
    }
    else {
        return answerElement;
    }
}
var PremiumVideoChatListingForm = /** @class */ (function (_super) {
    __extends(PremiumVideoChatListingForm, _super);
    function PremiumVideoChatListingForm(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            topic: '',
            languageOfTopic: '',
            duration: '',
            price: 0,
            currency: 'usd',
            thumbnailSrc: '',
            timeSlots: [
                {
                    date: '',
                    time: '',
                    completed: false,
                    booked: false,
                    paid: false,
                }
            ],
            savedAllChanges: true,
        };
        _this.state = state;
        _this.handlePriceChange = _this.handlePriceChange.bind(_this);
        _this.handleThumbnailChange = _this.handleThumbnailChange.bind(_this);
        _this.handleTimeSlotChange = _this.handleTimeSlotChange.bind(_this);
        _this.handleRemoveTimeSlot = _this.handleRemoveTimeSlot.bind(_this);
        _this.handleAddTimeSlot = _this.handleAddTimeSlot.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.handleDeleteListing = _this.handleDeleteListing.bind(_this);
        return _this;
    }
    PremiumVideoChatListingForm.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.user.premiumVideoChatListing) {
            this.setState(__assign({}, this.props.user.premiumVideoChatListing));
            this.setState({ savedPremiumVideoChatListing: this.props.user.premiumVideoChatListing });
        }
        // Make sure generated buttons effect state
        var numericButtonsCheck = setInterval(function () {
            var generatedButtons = document.querySelectorAll('.field.numeric > span');
            if (generatedButtons.length === 2) {
                clearInterval(numericButtonsCheck);
                generatedButtons.forEach(function (controlIcon) {
                    controlIcon.addEventListener('click', function (e) {
                        // @ts-ignore
                        var input = findInputElement(e.target.parentElement);
                        _this.handlePriceChange({ target: { value: input.value } });
                    });
                });
            }
        }, 100);
    };
    PremiumVideoChatListingForm.prototype.handlePriceChange = function (event) {
        this.setState({ price: Number(event.target.value), savedAllChanges: false });
    };
    PremiumVideoChatListingForm.prototype.handleThumbnailChange = function (event) {
        var context = this;
        var image = event.target.files[0];
        context.setState({
            thumbnailFile: image,
            savedAllChanges: false,
        });
        if (image) {
            // Set preview
            var reader_1 = new FileReader();
            reader_1.addEventListener('load', function () {
                if (typeof reader_1.result === 'string') {
                    if (/jpeg|jpg|png/.test(reader_1.result.substr(0, 20))) {
                        context.setState({ thumbnailSrc: reader_1.result });
                    }
                    else {
                        alert('Invalid thumbnail format.');
                    }
                }
                else {
                    alert('Invalid upload.');
                }
            }, false);
            reader_1.readAsDataURL(image);
        }
    };
    PremiumVideoChatListingForm.prototype.handleTimeSlotChange = function (valueKey, value, timeSlotIndex) {
        var timeSlots = this.state.timeSlots;
        var timeSlot = timeSlots[timeSlotIndex];
        timeSlot[valueKey] = value;
        timeSlots[timeSlotIndex] = timeSlot;
        this.setState({
            timeSlots: timeSlots,
            savedAllChanges: false,
        });
    };
    PremiumVideoChatListingForm.prototype.handleRemoveTimeSlot = function (e, timeSlotIndex) {
        e.preventDefault();
        var timeSlots = this.state.timeSlots;
        timeSlots.splice(timeSlotIndex, 1);
        this.setState({
            timeSlots: timeSlots,
            savedAllChanges: false,
        });
    };
    PremiumVideoChatListingForm.prototype.handleAddTimeSlot = function (e) {
        e.preventDefault();
        this.setState({
            timeSlots: __spreadArray(__spreadArray([], this.state.timeSlots, true), [
                {
                    date: '',
                    time: '',
                    completed: false,
                    booked: false,
                    paid: false,
                }
            ], false)
        });
        // Triggers fw effects for new elements
        setTimeout(function () {
            window.dispatchEvent(new Event('load'));
        }, 100);
    };
    PremiumVideoChatListingForm.prototype.handleSubmit = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, topic, languageOfTopic, duration, price, currency, thumbnailSrc, thumbnailFile, timeSlots, savedPremiumVideoChatListing, user, query, variables, mutationName, data, missingFields, missingFieldsString;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        event.preventDefault();
                        event.target.parentElement.parentElement.append((new DOMParser()).parseFromString('<div class="lds-facebook"><div></div><div></div><div></div></div>', 'text/html').body);
                        _a = this.state, topic = _a.topic, languageOfTopic = _a.languageOfTopic, duration = _a.duration, price = _a.price, currency = _a.currency, thumbnailSrc = _a.thumbnailSrc, thumbnailFile = _a.thumbnailFile, timeSlots = _a.timeSlots, savedPremiumVideoChatListing = _a.savedPremiumVideoChatListing;
                        user = this.props.user;
                        if (!(user && topic && languageOfTopic && duration && thumbnailSrc)) return [3 /*break*/, 2];
                        query = void 0;
                        variables = void 0;
                        mutationName = void 0;
                        if (savedPremiumVideoChatListing) {
                            // If updating existing
                            query = "mutation updatePremiumVideoChatListing($listingID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){\n          updatePremiumVideoChatListing(listingID: $listingID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){\n            _id\n            topic\n            languageOfTopic\n            duration\n            price\n            currency\n            thumbnailSrc\n            userID\n            timeSlots {\n              date\n              time\n              customerUserID\n              completed\n              booked\n              paid\n            }\n          }\n        }";
                            variables = {
                                listingID: savedPremiumVideoChatListing._id,
                                premiumVideoChatListing: {
                                    topic: topic,
                                    languageOfTopic: languageOfTopic,
                                    duration: duration,
                                    price: price,
                                    currency: currency,
                                    timeSlots: timeSlots,
                                }
                            };
                            if (thumbnailFile) {
                                variables.file = thumbnailFile;
                            }
                            mutationName = 'updatePremiumVideoChatListing';
                        }
                        else {
                            // If adding new
                            query = "mutation addPremiumVideoChatListing($userID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){\n          addPremiumVideoChatListing(userID: $userID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){\n            _id\n            topic\n            languageOfTopic\n            duration\n            price\n            currency\n            thumbnailSrc\n            userID\n            timeSlots {\n              date\n              time\n              customerUserID\n              completed\n              booked\n              paid\n            }\n          }\n        }";
                            variables = {
                                userID: user._id,
                                premiumVideoChatListing: {
                                    topic: topic,
                                    languageOfTopic: languageOfTopic,
                                    duration: duration,
                                    price: price,
                                    currency: currency,
                                    timeSlots: timeSlots,
                                },
                                file: thumbnailFile
                            };
                            mutationName = 'addPremiumVideoChatListing';
                        }
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, variables, thumbnailFile ? true : false)];
                    case 1:
                        data = _b.sent();
                        this.setState({
                            savedPremiumVideoChatListing: data[mutationName],
                            savedAllChanges: true,
                        });
                        document.querySelector('.lds-facebook').remove();
                        return [3 /*break*/, 3];
                    case 2:
                        missingFields = [
                            { value: topic, label: 'topic' },
                            { value: languageOfTopic, label: 'language' },
                            { value: duration, label: 'duration' },
                            { value: thumbnailSrc, label: 'thumbnail' },
                        ].filter(function (field) { return !field.value; });
                        missingFieldsString = missingFields.map(function (field) { return field.label; }).join(', ');
                        alert('Missing fields: ' + missingFieldsString);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListingForm.prototype.handleDeleteListing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, query, variables, data, emptyListingObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = this.props.user;
                        query = "mutation removePremiumVideoChatListing($userID: ID!){\n      removePremiumVideoChatListing(userID: $userID)\n    }";
                        variables = {
                            userID: user._id
                        };
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, variables)];
                    case 1:
                        data = _a.sent();
                        emptyListingObject = {
                            topic: '',
                            languageOfTopic: '',
                            duration: '',
                            thumbnailSrc: ''
                        };
                        this.setState(__assign(__assign({}, emptyListingObject), { savedPremiumVideoChatListing: null }));
                        return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListingForm.prototype.render = function () {
        var _this = this;
        var _a = this.state, topic = _a.topic, languageOfTopic = _a.languageOfTopic, duration = _a.duration, price = _a.price, currency = _a.currency, thumbnailSrc = _a.thumbnailSrc, timeSlots = _a.timeSlots, savedPremiumVideoChatListing = _a.savedPremiumVideoChatListing;
        var user = this.props.user;
        return (React.createElement("div", { className: "pure-g" },
            React.createElement("h2", { className: "pure-u-1" }, "Video chat listing"),
            React.createElement("form", { className: "pure-u-1 fw-form" },
                React.createElement("div", { className: "flex-container desktop-100" },
                    React.createElement("div", { className: "desktop-50 phone-100" },
                        React.createElement("div", { className: "field text" },
                            React.createElement("label", { htmlFor: "topicField" }, "Topic"),
                            React.createElement("input", { type: "text", name: "topic", id: "topicField", value: topic, onChange: function (event) { return _this.setState({ topic: event.target.value, savedAllChanges: false }); } })),
                        React.createElement(LanguageSelector_js_1.default, { name: "languageOfTopic", id: "languageOfTopicField", onChange: function (event) { return _this.setState({ languageOfTopic: event.target.value, savedAllChanges: false }); }, value: languageOfTopic }),
                        React.createElement("div", { className: "field text" },
                            React.createElement("label", { htmlFor: "durationField" }, "Duration"),
                            React.createElement("input", { type: "text", name: "duration", id: "durationField", placeholder: "5 minutes", value: duration, onChange: function (event) { return _this.setState({ duration: event.target.value, savedAllChanges: false }); } })),
                        React.createElement("div", { className: "field numeric" },
                            React.createElement("label", { htmlFor: "priceField" }, "Price"),
                            React.createElement("input", { type: "number", min: "0.50", step: "0.01", name: "price", id: "priceField", value: price, onChange: this.handlePriceChange }),
                            React.createElement("p", null,
                                React.createElement("i", null, "Application fees will be applied"))),
                        React.createElement("div", { className: "field text" },
                            React.createElement("label", { htmlFor: "currencyField" }, "Currency"),
                            React.createElement("input", { type: "text", name: "currency", id: "currencyField", value: currency, onChange: function (event) { return _this.setState({ currency: event.target.value, savedAllChanges: false }); } }))),
                    React.createElement("div", { className: "desktop-20 phone-100", style: { maxHeight: '385px', overflowY: 'auto' } },
                        React.createElement("div", { className: "fw-space notop" },
                            timeSlots.length ?
                                React.createElement(React.Fragment, null, timeSlots.map(function (timeSlot) {
                                    return React.createElement("div", { key: timeSlots.indexOf(timeSlot) },
                                        React.createElement("div", { className: "field text" },
                                            React.createElement("label", { htmlFor: "date[".concat(timeSlots.indexOf(timeSlot), "]") }, "Date"),
                                            React.createElement("input", { type: "date", name: "date[".concat(timeSlots.indexOf(timeSlot), "]"), id: "date[".concat(timeSlots.indexOf(timeSlot), "]"), value: timeSlot.date, onChange: function (e) { return _this.handleTimeSlotChange('date', e.target.value, timeSlots.indexOf(timeSlot)); } })),
                                        React.createElement("div", { className: "field text" },
                                            React.createElement("label", { htmlFor: "time[".concat(timeSlots.indexOf(timeSlot), "]") }, "Time"),
                                            React.createElement("input", { type: "time", name: "time[".concat(timeSlots.indexOf(timeSlot), "]"), id: "time[".concat(timeSlots.indexOf(timeSlot), "]"), value: timeSlot.time, onChange: function (e) { return _this.handleTimeSlotChange('time', e.target.value, timeSlots.indexOf(timeSlot)); } })),
                                        React.createElement("button", { className: "button", onClick: function (e) { return _this.handleRemoveTimeSlot(e, timeSlots.indexOf(timeSlot)); } },
                                            "Remove Time",
                                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTimes })));
                                }))
                                :
                                    '',
                            React.createElement("button", { className: "button", onClick: function (e) { return _this.handleAddTimeSlot(e); } },
                                "Add time slot",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPlus })))),
                    React.createElement("div", { className: "desktop-30 phone-100" },
                        React.createElement("div", { className: "desktop-100", style: { maxWidth: '100%', height: '300px' } },
                            React.createElement("div", { className: "pad", style: { height: '100%', width: '100%', boxSizing: 'border-box' } },
                                React.createElement("div", { className: "thumbnail-preview img-container", style: { height: '100%', width: '100%', background: "url(".concat(thumbnailSrc, ") no-repeat center center/cover") } }))),
                        React.createElement("div", { className: "upload-container" },
                            React.createElement("input", { type: "file", name: "thumbnail", onChange: this.handleThumbnailChange }),
                            React.createElement("label", { htmlFor: "thumbnail" },
                                "Thumbnail",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faUpload }))),
                        React.createElement("div", null,
                            React.createElement("button", { className: "button", onClick: this.handleSubmit, disabled: this.state.savedAllChanges },
                                this.state.savedAllChanges ? 'Saved' : 'Save',
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faCheck })))))),
            React.createElement("div", { className: "pure-u-1 flex-container flex-horizontal-center" }, savedPremiumVideoChatListing ?
                React.createElement("div", { className: "desktop-100" },
                    React.createElement("h3", null, "Your saved Video Chat Listing"),
                    React.createElement(PremiumVideoChatListing_js_1.default, { premiumVideoChatListing: savedPremiumVideoChatListing, authenticatedUserID: user._id, view: user._id == savedPremiumVideoChatListing.userID ? 'owner' : 'customer' }),
                    React.createElement("form", null,
                        React.createElement("a", { className: "button", href: "#remove-listing", style: { display: 'block', marginLeft: 'auto', width: 'max-content' } },
                            "Remove Listing",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTrash }))),
                    React.createElement(RemoveConfirmationModal_js_1.default, { buttonText: "Remove Listing", buttonAnchor: "remove-listing", modalTitle: "Remove Listing", modalContent: "Are you sure you want to remove this listing?", handleDelete: this.handleDeleteListing }))
                :
                    '')));
    };
    return PremiumVideoChatListingForm;
}(React.Component));
exports.default = PremiumVideoChatListingForm;
