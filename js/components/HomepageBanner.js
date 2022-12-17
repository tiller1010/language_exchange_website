"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function HomepageBanner() {
    return (React.createElement("div", { className: "home-banner flex-container fw-typography-spacing", style: { background: 'url("/images/glacier-landscape.jpeg") no-repeat center center/cover' } },
        React.createElement("div", { style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #747de8, #9f74e4)',
                opacity: '.1',
                top: '0',
                left: '0',
            } }),
        React.createElement("div", { className: "desktop-100 home-banner-content", style: { position: 'relative' } },
            React.createElement("div", { className: "fw-container" },
                React.createElement("div", { className: "fw-space" },
                    React.createElement("h1", { style: { marginBottom: '5px' } }, "Use the language you are learning today"),
                    React.createElement("p", null, "Language can only be learned if it is used. Why not start using the language you want to learn today?")))),
        React.createElement("div", { className: "desktop-100 fw-container flex-container flex-vertical-bottom", style: { position: 'relative' } },
            React.createElement("div", { className: "fw-space" },
                React.createElement("div", { className: "flex-container flex-vertical-stretch" },
                    React.createElement("div", { className: "desktop-33 tablet-100" },
                        React.createElement("div", { className: "fw-space" },
                            React.createElement("a", { href: "/lessons", className: "home-banner-link" },
                                React.createElement("div", { className: "fw-space" },
                                    React.createElement("h2", { style: { marginBottom: '5px' } }, "Improve your skills"),
                                    React.createElement("p", null, "Learn from free resources and challenges to sharpen your skills."))))),
                    React.createElement("div", { className: "desktop-33 tablet-100" },
                        React.createElement("div", { className: "fw-space" },
                            React.createElement("a", { href: "/videos", className: "home-banner-link" },
                                React.createElement("div", { className: "fw-space" },
                                    React.createElement("h2", { style: { marginBottom: '5px' } }, "Share what you know"),
                                    React.createElement("p", null, "Browse words and phrases uploaded by users around the world."))))),
                    React.createElement("div", { className: "desktop-33 tablet-100" },
                        React.createElement("div", { className: "fw-space" },
                            React.createElement("a", { href: "/chats", className: "home-banner-link" },
                                React.createElement("div", { className: "fw-space" },
                                    React.createElement("h2", { style: { marginBottom: '5px' } }, "Practice with a native speaker"),
                                    React.createElement("p", null, "Schedule a time to have a real chat with a native speaker."))))))))));
}
exports.default = HomepageBanner;
