"use strict";
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
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
// Enable lazy loading
// const lozadObserver = lozad();
// lozadObserver.observe();
function renderTopicMedia(FeaturedMedia) {
    if (FeaturedMedia) {
        if (FeaturedMedia.data) {
            switch (FeaturedMedia.data.attributes.mime) {
                case 'image/jpeg':
                    return (React.createElement("div", { className: "img-container desktop-100" },
                        React.createElement("img", { src: "".concat(process.env.STRAPI_PUBLIC_URL).concat(FeaturedMedia.data.attributes.url), alt: FeaturedMedia.data.attributes.alternativeText, className: "lozad" })));
                default:
                    return React.createElement("p", null, "Invalid media");
            }
        }
    }
    return React.createElement("p", null, "Invalid media");
}
function renderChallengeMedia(FeaturedMedia) {
    if (FeaturedMedia) {
        if (FeaturedMedia.data) {
            switch (FeaturedMedia.data.attributes.mime) {
                case 'image/jpeg':
                    return (React.createElement("div", { className: "img-container" },
                        React.createElement("img", { src: "".concat(process.env.STRAPI_PUBLIC_URL).concat(FeaturedMedia.data.attributes.url) })));
                case 'video/mp4':
                    return (React.createElement("video", { height: "225", width: "400", controls: true, tabIndex: "-1", src: "".concat(process.env.STRAPI_PUBLIC_URL).concat(FeaturedMedia.data.attributes.url) }));
                case 'audio/wav':
                case 'audio/mp3':
                case 'audio/mpeg':
                    return (React.createElement("audio", { height: "225", width: "400", controls: true, tabIndex: "-1", src: "".concat(process.env.STRAPI_PUBLIC_URL).concat(FeaturedMedia.data.attributes.url) }));
                default:
                    return React.createElement("p", null, "Invalid media");
            }
        }
    }
}
function TopicLink(props) {
    var topic = props.topic, levelID = props.levelID, showChallenge = props.showChallenge;
    /*
        If topic was completed and saved with Strapi 3,
        format like Strapi 4 API
    */
    if (!topic.attributes) {
        topic.attributes = __assign({}, topic);
        topic.attributes.FeaturedMedia = { data: { attributes: __assign({}, topic.FeaturedImage) } };
        topic.attributes.FeaturedMedia.data.attributes.alternativeText = topic.FeaturedImage.name;
    }
    var challenge = null;
    if (topic.attributes.challenges) {
        challenge = topic.attributes.challenges.data[0];
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex x-space-between y-center", style: { flexWrap: 'nowrap' } },
            React.createElement("h3", { className: "pad no-y no-left", style: { margin: 0 } }, topic.attributes.Topic),
            React.createElement("a", { href: "/level/".concat(levelID, "/topic/").concat(topic.id), "aria-label": "View challenges on ".concat(topic.attributes.Topic), className: "button", style: { alignSelf: 'center' } },
                "View Topic",
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight }))),
        React.createElement("a", { href: "/level/".concat(levelID, "/topic/").concat(topic.id), "aria-label": "View challenges on ".concat(topic.attributes.Topic), className: "desktop-100" }, renderTopicMedia(topic.attributes.FeaturedMedia)),
        showChallenge && challenge ?
            React.createElement("div", { className: "challenge" },
                React.createElement("div", { className: "pad" },
                    React.createElement("h3", null, challenge.attributes.Title),
                    React.createElement("p", null, challenge.attributes.Content),
                    renderChallengeMedia(challenge.attributes.FeaturedMedia)))
            :
                ''));
}
exports.default = TopicLink;
