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
var PremiumVideoChatListing_js_1 = require("./PremiumVideoChatListing.js");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var graphQLFetch_js_1 = require("../graphQLFetch.js");
var react_slick_1 = require("react-slick");
var LanguageSelector_js_1 = require("./LanguageSelector.js");
var PremiumVideoChatListingFeed = /** @class */ (function (_super) {
    __extends(PremiumVideoChatListingFeed, _super);
    function PremiumVideoChatListingFeed(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            topic: '',
            languageOfTopic: '',
            premiumVideoChatListings: [],
            loaded: false,
        };
        _this.state = state;
        _this.handleLanguageChange = _this.handleLanguageChange.bind(_this);
        _this.handleSearchSubmit = _this.handleSearchSubmit.bind(_this);
        return _this;
    }
    PremiumVideoChatListingFeed.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "query getRecentPremiumVideoChatListings{\n      getRecentPremiumVideoChatListings{\n        listings {\n          _id\n          topic\n          languageOfTopic\n          duration\n          price\n          currency\n          thumbnailSrc\n          userID\n          timeSlots {\n            date\n            time\n            customerUserID\n            completed\n            booked\n            paid\n          }\n        }\n      }\n    }";
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query)];
                    case 1:
                        data = _a.sent();
                        if (data.getRecentPremiumVideoChatListings) {
                            if (data.getRecentPremiumVideoChatListings.listings) {
                                this.setState({
                                    premiumVideoChatListings: data.getRecentPremiumVideoChatListings.listings,
                                    loaded: true,
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListingFeed.prototype.handleLanguageChange = function (event) {
        this.setState({ languageOfTopic: event.target.value });
        // const searchButton = event.target.form.querySelector('button[value="Search"]');
        // searchButton.contentEditable = true; // Trick browser to use ":focus-within" for outline effect
        // searchButton.focus();
        // setTimeout(() => {
        //   searchButton.contentEditable = false;
        // }, 1)
    };
    PremiumVideoChatListingFeed.prototype.handleSearchSubmit = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, topic, languageOfTopic, query, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        event.preventDefault();
                        _a = this.state, topic = _a.topic, languageOfTopic = _a.languageOfTopic;
                        topic = topic.replace(/\s$/, '');
                        query = "query searchPremiumVideoChatListings($topic: String, $languageOfTopic: String){\n      searchPremiumVideoChatListings(topic: $topic, languageOfTopic: $languageOfTopic){\n        listings {\n          _id\n          topic\n          languageOfTopic\n          duration\n          price\n          currency\n          thumbnailSrc\n          userID\n          timeSlots {\n            date\n            time\n            customerUserID\n            completed\n            booked\n            paid\n          }\n        }\n      }\n    }";
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, {
                                topic: topic,
                                languageOfTopic: languageOfTopic,
                            })];
                    case 1:
                        data = _b.sent();
                        if (data.searchPremiumVideoChatListings) {
                            if (data.searchPremiumVideoChatListings.listings) {
                                this.setState({
                                    premiumVideoChatListings: data.searchPremiumVideoChatListings.listings
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PremiumVideoChatListingFeed.prototype.render = function () {
        var _this = this;
        var authenticatedUserID = this.props.authenticatedUserID;
        var _a = this.state, premiumVideoChatListings = _a.premiumVideoChatListings, topic = _a.topic, languageOfTopic = _a.languageOfTopic, loaded = _a.loaded;
        return (React.createElement("section", null,
            React.createElement("div", { className: "page-form", style: { marginBottom: '60px' } },
                this.props.SearchFormHeading ? React.createElement("h1", { style: { textAlign: 'right' } }, this.props.SearchFormHeading) : '',
                React.createElement("form", { className: "fw-form search-form" },
                    React.createElement("div", { className: "flex-container flex-vertical-stretch" },
                        React.createElement("div", { className: "field text tablet-100" },
                            React.createElement("label", { htmlFor: "topicField" }, "Topic"),
                            React.createElement("input", { type: "text", name: "topic", id: "topicField", value: topic, onChange: function (event) { return _this.setState({ topic: event.target.value }); } })),
                        React.createElement("div", { className: "flex-container tablet-100", style: { flexWrap: 'nowrap' } },
                            React.createElement("div", { className: "tablet-100" },
                                React.createElement(LanguageSelector_js_1.default, { name: "languageOfTopic", id: "videoChat_languageOfTopicField", onChange: this.handleLanguageChange, value: languageOfTopic, required: false })),
                            React.createElement("button", { value: "Search", className: "button tablet-20", onClick: this.handleSearchSubmit, style: { borderRadius: '0 5px 5px 0' } },
                                "Search",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSearch }))))),
                !this.props.HideClearFilters ?
                    React.createElement("div", null,
                        React.createElement("a", { href: "/chats", "aria-label": "Clear filters", className: "button" },
                            "Clear filters",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faBan })))
                    :
                        ''),
            premiumVideoChatListings.length ?
                React.createElement(react_slick_1.default, __assign({}, {
                    dots: false,
                    infinite: false,
                    speed: 500,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 1.5
                            }
                        }
                    ]
                }), premiumVideoChatListings.map(function (listing) {
                    return React.createElement("div", { key: premiumVideoChatListings.indexOf(listing) },
                        React.createElement(PremiumVideoChatListing_js_1.default, { premiumVideoChatListing: listing, authenticatedUserID: authenticatedUserID, view: authenticatedUserID == listing.userID ? 'owner' : 'customer' }));
                }))
                :
                    React.createElement(React.Fragment, null, loaded ? React.createElement("p", null, "No video chats found") : React.createElement("div", { className: "lds-facebook" },
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)))));
    };
    return PremiumVideoChatListingFeed;
}(React.Component));
exports.default = PremiumVideoChatListingFeed;
