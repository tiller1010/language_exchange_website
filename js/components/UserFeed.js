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
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var graphQLFetch_js_1 = require("../graphQLFetch.js");
var Navigation_jsx_1 = require("./Navigation.jsx");
var MediaRenderer_js_1 = require("./MediaRenderer.js");
var UserFeed = /** @class */ (function (_super) {
    __extends(UserFeed, _super);
    function UserFeed(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            searchQuery: '',
            users: [],
            loaded: false,
        };
        _this.state = state;
        _this.handleSearchSubmit = _this.handleSearchSubmit.bind(_this);
        return _this;
    }
    UserFeed.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "query getRecentUsers{\n      getRecentUsers{\n        users {\n          _id\n          displayName\n          firstName\n          lastName\n          profilePictureSrc\n        }\n      }\n    }";
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            if (data.getRecentUsers) {
                                if (data.getRecentUsers.users) {
                                    this.setState({
                                        users: data.getRecentUsers.users,
                                        loaded: true,
                                    });
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserFeed.prototype.handleSearchSubmit = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var searchQuery, query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        searchQuery = this.state.searchQuery;
                        searchQuery = searchQuery.replace(/\s$/, '');
                        query = "query searchUsers($searchQuery: String){\n      searchUsers(searchQuery: $searchQuery){\n        users {\n          _id\n          displayName\n          firstName\n          lastName\n          profilePictureSrc\n        }\n      }\n    }";
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, {
                                searchQuery: searchQuery,
                            })];
                    case 1:
                        data = _a.sent();
                        if (data.searchUsers) {
                            if (data.searchUsers.users) {
                                this.setState({
                                    users: data.searchUsers.users
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserFeed.prototype.render = function () {
        var _this = this;
        var _a = this.state, users = _a.users, searchQuery = _a.searchQuery, loaded = _a.loaded;
        return (React.createElement("div", { className: "frame fw-container" },
            React.createElement(Navigation_jsx_1.default, null),
            React.createElement("section", null,
                React.createElement("div", { className: "page-form", style: { marginBottom: '60px' } },
                    this.props.SearchFormHeading ? React.createElement("h1", { style: { textAlign: 'right' } }, this.props.SearchFormHeading) : '',
                    React.createElement("form", { className: "fw-form search-form" },
                        React.createElement("div", { className: "flex-container flex-vertical-stretch", style: { flexWrap: 'nowrap' } },
                            React.createElement("div", { className: "field text tablet-100" },
                                React.createElement("label", { htmlFor: "searchQueryField" }, "Search"),
                                React.createElement("input", { type: "text", name: "searchQuery", id: "searchQueryField", value: searchQuery, onChange: function (event) { return _this.setState({ searchQuery: event.target.value }); } })),
                            React.createElement("button", { value: "Search", className: "button tablet-20", onClick: this.handleSearchSubmit, style: { borderRadius: '0 5px 5px 0' } },
                                "Search",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSearch })))),
                    !this.props.HideClearFilters ?
                        React.createElement("div", null,
                            React.createElement("a", { href: "/find-users", "aria-label": "Clear filters", className: "button" },
                                "Clear filters",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faBan })))
                        :
                            ''),
                users.length ?
                    React.createElement("table", null,
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null),
                                React.createElement("th", null, "Display Name"),
                                React.createElement("th", null, "First Name"),
                                React.createElement("th", null, "Last Name"))),
                        React.createElement("tbody", null, users.map(function (user) {
                            return React.createElement("tr", { key: users.indexOf(user), onClick: function () { return window.location = "/account-profile/".concat(user._id); }, style: { cursor: 'pointer' } },
                                React.createElement("td", { style: { maxWidth: '100px' } }, user.profilePictureSrc ?
                                    React.createElement(MediaRenderer_js_1.default, { src: user.profilePictureSrc })
                                    :
                                        ''),
                                React.createElement("td", null, user.displayName),
                                React.createElement("td", null, user.firstName),
                                React.createElement("td", null, user.lastName));
                        })))
                    :
                        React.createElement(React.Fragment, null, loaded ? React.createElement("p", null, "No users found") : React.createElement("div", { className: "lds-facebook" },
                            React.createElement("div", null),
                            React.createElement("div", null),
                            React.createElement("div", null))))));
    };
    return UserFeed;
}(React.Component));
exports.default = UserFeed;
