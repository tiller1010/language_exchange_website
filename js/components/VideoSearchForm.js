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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var LanguageSelector_js_1 = require("./LanguageSelector.js");
var SortControlStatus;
(function (SortControlStatus) {
    SortControlStatus["open"] = "open";
    SortControlStatus["closed"] = "closed";
})(SortControlStatus || (SortControlStatus = {}));
var VideoSearchForm = /** @class */ (function (_super) {
    __extends(VideoSearchForm, _super);
    function VideoSearchForm(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            keywords: '',
            languageOfTopic: '',
            sortControlStatus: SortControlStatus.closed,
            sort: 'Recent'
        };
        _this.state = state;
        _this.toggleSortControls = _this.toggleSortControls.bind(_this);
        _this.handleKeywordsChange = _this.handleKeywordsChange.bind(_this);
        _this.handleSortChange = _this.handleSortChange.bind(_this);
        return _this;
    }
    VideoSearchForm.prototype.componentDidMount = function () {
        var _a = this.props, keywords = _a.keywords, languageOfTopic = _a.languageOfTopic, sort = _a.sort;
        this.setState({
            keywords: keywords,
            languageOfTopic: languageOfTopic,
            sort: sort
        });
    };
    VideoSearchForm.prototype.componentDidUpdate = function (prevProps) {
        if (this.props != prevProps) {
            var _a = this.props, keywords = _a.keywords, languageOfTopic = _a.languageOfTopic, sort = _a.sort;
            this.setState({
                keywords: keywords,
                languageOfTopic: languageOfTopic,
                sort: sort
            });
        }
    };
    VideoSearchForm.prototype.toggleSortControls = function () {
        var sortControlStatus = this.state.sortControlStatus;
        var newStatus = sortControlStatus === SortControlStatus.open ? SortControlStatus.closed : SortControlStatus.open;
        this.setState({
            sortControlStatus: newStatus
        });
    };
    VideoSearchForm.prototype.handleKeywordsChange = function (event) {
        this.setState({
            keywords: event.target.value
        });
    };
    VideoSearchForm.prototype.handleSortChange = function (event) {
        this.setState({
            sort: event.target.value
        });
        // This approach triggers the onSubmit handler
        event.target.form.querySelector('button[type="submit"]').click();
    };
    VideoSearchForm.prototype.render = function () {
        var _this = this;
        var _a = this.state, keywords = _a.keywords, languageOfTopic = _a.languageOfTopic, sortControlStatus = _a.sortControlStatus, sort = _a.sort;
        return (React.createElement("form", { action: "/videos", method: "GET", className: "fw-form search-form" },
            React.createElement("div", { className: "flex-container flex-vertical-stretch" },
                React.createElement("div", { className: "field text tablet-100" },
                    React.createElement("label", { htmlFor: "keywordsField" }, "Search"),
                    React.createElement("input", { type: "text", name: "keywords", id: "keywordsField", value: keywords, onChange: this.handleKeywordsChange })),
                React.createElement("div", { className: "flex-container tablet-100", style: { flexWrap: 'nowrap' } },
                    React.createElement("div", { className: "tablet-100" },
                        React.createElement(LanguageSelector_js_1.default, { name: "languageOfTopic", id: "userContent_languageOfTopicField", onChange: function (event) { return _this.setState({ languageOfTopic: event.target.value }); }, value: languageOfTopic, required: false })),
                    React.createElement("button", { type: "submit", value: "Search", className: "button tablet-20" },
                        "Search",
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSearch })),
                    React.createElement("div", { className: "sort-controls flex tablet-20" },
                        React.createElement("button", { className: "button no-icon hamburger hamburger--collapse ".concat(sortControlStatus == 'open' ? 'is-active' : ''), type: "button", onClick: this.toggleSortControls },
                            React.createElement("span", { className: "hamburger-box" },
                                React.createElement("span", { className: "hamburger-inner" }))),
                        React.createElement("div", { className: "sort-options flex pure-u-1 ".concat(sortControlStatus) },
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor: "sort-recent" }, "Recent"),
                                React.createElement("input", { type: "radio", name: "sort", value: "Recent", id: "sort-recent", checked: sort === 'Recent' ? true : false, onChange: this.handleSortChange })),
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor: "sort-oldest" }, "Oldest"),
                                React.createElement("input", { type: "radio", name: "sort", value: "Oldest", id: "sort-oldest", checked: sort === 'Oldest' ? true : false, onChange: this.handleSortChange })),
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor: "sort-AZ" }, "A-Z"),
                                React.createElement("input", { type: "radio", name: "sort", value: "A-Z", id: "sort-AZ", checked: sort === 'A-Z' ? true : false, onChange: this.handleSortChange })),
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor: "sort-ZA" }, "Z-A"),
                                React.createElement("input", { type: "radio", name: "sort", value: "Z-A", id: "sort-ZA", checked: sort === 'Z-A' ? true : false, onChange: this.handleSortChange }))))))));
    };
    return VideoSearchForm;
}(React.Component));
exports.default = VideoSearchForm;
