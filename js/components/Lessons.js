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
var LessonsFeed_js_1 = require("./LessonsFeed.js");
var Navigation_jsx_1 = require("./Navigation.jsx");
var Lessons = /** @class */ (function (_super) {
    __extends(Lessons, _super);
    function Lessons(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Lessons.prototype.componentDidMount = function () {
    };
    Lessons.prototype.render = function () {
        return (React.createElement("div", { className: "frame fw-container" },
            React.createElement(Navigation_jsx_1.default, null),
            React.createElement("div", { className: "pure-u-g" },
                React.createElement("div", { className: "desktop-100" },
                    React.createElement(LessonsFeed_js_1.default, { SearchFormHeading: "Free lessons and challenges" })))));
    };
    return Lessons;
}(React.Component));
exports.default = Lessons;
