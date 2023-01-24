"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var RemoveConfirmationModal = function (props) {
    var _a = React.useState(false), forceClosed = _a[0], setForceClosed = _a[1];
    var buttonText = props.buttonText, buttonAnchor = props.buttonAnchor, modalTitle = props.modalTitle, modalContent = props.modalContent, handleDelete = props.handleDelete;
    return (React.createElement("section", { className: "modal--show", id: buttonAnchor, tabIndex: -1, role: "dialog", "aria-labelledby": "modal-label", "aria-hidden": "true", style: forceClosed ? { display: 'none' } : {} },
        React.createElement("div", { className: "modal-inner" },
            React.createElement("header", { id: "modal-label" },
                React.createElement("h2", null, modalTitle)),
            React.createElement("div", { className: "modal-content" }, modalContent),
            React.createElement("footer", { className: "flex x-space-around" },
                React.createElement("a", { className: "button", href: "#!", onClick: handleDelete },
                    buttonText,
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTrash })),
                React.createElement("a", { href: "#!", onClick: function () { return setForceClosed(true); }, className: "button" },
                    "Close",
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTimes })))),
        React.createElement("a", { href: "#!", onClick: function () { return setForceClosed(true); }, className: "modal-close", title: "Close this modal", "data-close": "Close", "data-dismiss": "modal" }, "?")));
};
exports.default = RemoveConfirmationModal;
