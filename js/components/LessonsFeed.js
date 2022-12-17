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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var axios_1 = require("axios");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_slick_1 = require("react-slick");
var Navigation_jsx_1 = require("./Navigation.jsx");
var TopicLink_js_1 = require("./TopicLink.js");
var LessonSearchForm_js_1 = require("./LessonSearchForm.js");
var LessonsFeed = /** @class */ (function (_super) {
    __extends(LessonsFeed, _super);
    function LessonsFeed(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            levels: [],
            loaded: false,
            showChallenge: false,
            initialLoadView: true,
            languageOfTopic: '',
        };
        _this.onSeachSubmitCallback = _this.onSeachSubmitCallback.bind(_this);
        _this.renderLevels = _this.renderLevels.bind(_this);
        return _this;
    }
    LessonsFeed.prototype.componentDidMount = function () {
        var _this = this;
        var languageOfTopic = sessionStorage.getItem('lessonLanguageFilter');
        axios_1.default.get("".concat(process.env.STRAPI_API_URL, "/levels?populate[topics][populate]=FeaturedMedia&sort[0]=Level&filters[Level][$contains]=1"))
            .then(function (res) {
            var data = res.data;
            var levels = data.data;
            _this.setState({
                levels: levels,
                loaded: true,
                languageOfTopic: languageOfTopic,
            });
        });
    };
    LessonsFeed.prototype.randomTopics = function (level) {
        if (level.attributes.topicsRandomized) {
            return level.attributes.topics.data;
        }
        else {
            level.topicsRandomized = true;
            level.attributes.topics.data = level.attributes.topics.data.sort(function () { return .5 - Math.random(); }).slice(0, 5);
            return level.attributes.topics.data;
        }
    };
    LessonsFeed.prototype.onSeachSubmitCallback = function (data) {
        if (data.searchLessons) {
            if (data.searchLessons.levels) {
                sessionStorage.setItem('lessonLanguageFilter', data.lessonLanguageFilter);
                this.setState({
                    levels: data.searchLessons.levels,
                    showChallenge: data.searchLessons.showChallenge,
                    initialLoadView: false,
                });
            }
        }
    };
    LessonsFeed.prototype.renderLevels = function () {
        var _this = this;
        var _a = this.state, levels = _a.levels, loaded = _a.loaded, showChallenge = _a.showChallenge, initialLoadView = _a.initialLoadView;
        return (levels.map(function (level) {
            return React.createElement("div", { key: level.id, className: "flex x-center" },
                initialLoadView ?
                    React.createElement(React.Fragment, null,
                        React.createElement("h2", { className: "pad", style: { margin: 0 } }, level.attributes.Level.replace(/\d|\s/g, '')),
                        React.createElement("div", { className: "desktop-100" },
                            React.createElement("button", { className: "button", onClick: function () { return _this.setState({ languageOfTopic: level.attributes.Level.replace(/\d|\s/g, '') }); } },
                                "Load more ",
                                level.attributes.Level.replace(/\d|\s/g, ''),
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight }))))
                    :
                        React.createElement(React.Fragment, null,
                            React.createElement("h2", { className: "pad", style: { margin: 0 } }, level.attributes.Level),
                            React.createElement("a", { href: "/level/".concat(level.id), className: "button", style: { alignSelf: 'center' } },
                                "View Level",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight }))),
                React.createElement("div", { className: "pure-u-1" },
                    React.createElement("hr", null)),
                level.attributes.topics.data ?
                    React.createElement("div", { className: "topics pure-u-1 flex x-space-around" }, _this.randomTopics(level).map(function (topic) {
                        return React.createElement("div", { className: "topic pure-u-1 pure-u-md-1-3", key: topic.id },
                            React.createElement("div", { className: "pad" },
                                React.createElement(TopicLink_js_1.default, { topic: topic, levelID: level.id, showChallenge: showChallenge })));
                    }))
                    :
                        React.createElement(React.Fragment, null, loaded ? React.createElement("p", null, "No topics") : React.createElement("div", { className: "lds-facebook" },
                            React.createElement("div", null),
                            React.createElement("div", null),
                            React.createElement("div", null))));
        }));
        ;
    };
    LessonsFeed.prototype.render = function () {
        var _a = this.state, levels = _a.levels, loaded = _a.loaded, languageOfTopic = _a.languageOfTopic, initialLoadView = _a.initialLoadView;
        return (React.createElement("div", { className: "fw-container" },
            React.createElement(Navigation_jsx_1.default, null),
            React.createElement("div", { className: "page-form", style: { marginBottom: '60px' } },
                this.props.SearchFormHeading ? React.createElement("h1", { style: { textAlign: 'right' } }, this.props.SearchFormHeading) : '',
                React.createElement(LessonSearchForm_js_1.default, { onSubmit: this.onSeachSubmitCallback, languageOfTopic: languageOfTopic || null }),
                !this.props.HideClearFilters ?
                    React.createElement("div", null,
                        React.createElement("a", { href: "/lessons", "aria-label": "Clear filters", className: "button", onClick: function () { return sessionStorage.setItem('lessonLanguageFilter', ''); } },
                            "Clear filters",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faBan })))
                    :
                        ''),
            levels.length ?
                React.createElement(React.Fragment, null, initialLoadView ?
                    React.createElement(react_slick_1.default, __assign({}, {
                        dots: false,
                        infinite: false,
                        speed: 500,
                        slidesToShow: 1.3,
                        slidesToScroll: 1,
                    }), this.renderLevels())
                    :
                        React.createElement(React.Fragment, null, this.renderLevels()))
                :
                    React.createElement(React.Fragment, null, loaded ? React.createElement("p", null, "No levels") : React.createElement("div", { className: "lds-facebook" },
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)))));
    };
    return LessonsFeed;
}(React.Component));
exports.default = LessonsFeed;
