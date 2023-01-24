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
var react_simple_readmore_1 = require("@jamespotz/react-simple-readmore");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var free_regular_svg_icons_1 = require("@fortawesome/free-regular-svg-icons");
var graphQLFetch_js_1 = require("../graphQLFetch.js");
var MediaRenderer_js_1 = require("./MediaRenderer.js");
var VideoPlayer = /** @class */ (function (_super) {
    __extends(VideoPlayer, _super);
    function VideoPlayer(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            likes: 0,
            likedByCurrentUser: false
        };
        _this.state = state;
        _this.toggleLike = _this.toggleLike.bind(_this);
        return _this;
    }
    VideoPlayer.prototype.componentDidMount = function () {
        var _a = this.props, likes = _a.likes, likedByCurrentUser = _a.likedByCurrentUser;
        this.setState({
            likes: likes,
            likedByCurrentUser: likedByCurrentUser
        });
    };
    VideoPlayer.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.likedByCurrentUser != prevProps.likedByCurrentUser) {
            this.setState({
                likedByCurrentUser: this.props.likedByCurrentUser
            });
        }
        if (this.props.likes != prevProps.likes) {
            this.setState({
                likes: this.props.likes
            });
        }
    };
    VideoPlayer.prototype.toggleLike = function (videoID) {
        return __awaiter(this, void 0, void 0, function () {
            var apiSegment, query, data, newVideo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.props.authenticatedUserID) {
                            alert('Must be signed in to send like.');
                            return [2 /*return*/];
                        }
                        apiSegment = this.state.likedByCurrentUser ? 'removeLike' : 'addLike';
                        query = "mutation addLike($userID: ID!, $videoID: ID!){\n      ".concat(apiSegment, "(userID: $userID, videoID: $videoID){\n        _id\n        title\n         languageOfTopic\n        src\n        originalName\n        thumbnailSrc\n        originalThumbnailName\n        created\n        likes\n        uploadedBy {\n          _id\n          displayName\n        }\n      }\n    }");
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, {
                                userID: this.props.authenticatedUserID,
                                videoID: videoID
                            })];
                    case 1:
                        data = _a.sent();
                        newVideo = data[apiSegment];
                        if (newVideo.message) {
                            // Display error message if included in response
                            alert(newVideo.message);
                        }
                        this.setState(function (prevState) { return ({
                            likes: newVideo.likes,
                            likedByCurrentUser: !prevState.likedByCurrentUser
                        }); });
                        if (this.props.afterToggleLike) {
                            this.props.afterToggleLike(newVideo, this.state.likedByCurrentUser);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoPlayer.prototype.render = function () {
        var _this = this;
        var _a = this.state, likes = _a.likes, likedByCurrentUser = _a.likedByCurrentUser;
        var _b = this.props, _id = _b._id, title = _b.title, languageOfTopic = _b.languageOfTopic, uploadedBy = _b.uploadedBy, src = _b.src, thumbnailSrc = _b.thumbnailSrc;
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement("div", { className: "flex x-center" },
                React.createElement("div", { className: "desktop-100", style: { maxWidth: '400px' } },
                    React.createElement("div", { className: "flex x-space-between y-center", style: { flexWrap: 'nowrap' } },
                        React.createElement("div", { style: { maxWidth: '65%' } },
                            React.createElement(react_simple_readmore_1.default, { fade: true, minHeight: 65, btnStyles: {
                                    position: 'absolute',
                                    bottom: '-30px',
                                    border: '1px solid #000',
                                    borderRadius: '5px',
                                    margin: 0,
                                    padding: '5px',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                } },
                                React.createElement("h3", null, title),
                                languageOfTopic ?
                                    React.createElement("h4", null, languageOfTopic)
                                    :
                                        '')),
                        this.props.handleDeleteVideo ?
                            React.createElement(React.Fragment, null,
                                React.createElement("form", { action: "/videos/remove", method: "POST", className: "fw-form" },
                                    React.createElement("input", { type: "hidden", name: "videoID", value: this.props._id }),
                                    React.createElement("a", { className: "button", style: { position: 'absolute', right: '-10px', bottom: '150px', height: '36px' }, href: "#remove-video", title: "Remove Video", onClick: function (event) { return _this.props.handleDeleteVideo(event); } },
                                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTrash }))),
                                React.createElement("div", null,
                                    React.createElement("a", { className: "button", style: { position: 'absolute', right: '-10px', bottom: '190px', height: '36px' }, href: "/videos/edit/".concat(this.props._id), title: "Edit Video" },
                                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faEdit }))))
                            :
                                '',
                        uploadedBy._id ?
                            React.createElement("div", null,
                                React.createElement("p", null,
                                    "By: ",
                                    React.createElement("a", { href: "/account-profile/".concat(uploadedBy._id), "aria-label": "".concat(uploadedBy.displayName, " profile") }, uploadedBy.displayName)))
                            :
                                React.createElement("div", null,
                                    React.createElement("p", null,
                                        "By: ",
                                        uploadedBy.displayName))),
                    React.createElement(MediaRenderer_js_1.default, { src: src, thumbnailSrc: thumbnailSrc }))),
            React.createElement("div", { className: "flex x-space-around y-center" },
                React.createElement("p", null,
                    "Likes: ",
                    likes || 0),
                React.createElement("button", { className: "button", onClick: function () { return _this.toggleLike(_id); } }, likedByCurrentUser ?
                    React.createElement("span", null,
                        "Liked",
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faStar }))
                    :
                        React.createElement("span", null,
                            "Like",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_regular_svg_icons_1.faStar }))))));
    };
    return VideoPlayer;
}(React.Component));
exports.default = VideoPlayer;
