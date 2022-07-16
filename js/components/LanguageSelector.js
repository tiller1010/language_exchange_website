"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var languages = require('language-list')();
function LanguageSelector(props) {
    var name = props.name, id = props.id, onChange = props.onChange, value = props.value;
    return (React.createElement("div", { className: "field dropdown" },
        React.createElement("label", { htmlFor: id }, "Language"),
        React.createElement("select", { name: name, id: id, onChange: onChange, value: value, required: true },
            React.createElement("option", { value: "" }, "Select a language"),
            React.createElement("option", null, "ASL"),
            languages.getLanguageCodes().map(function (langCode) {
                return React.createElement("option", { key: langCode }, languages.getLanguageName(langCode));
            }))));
}
exports.default = LanguageSelector;
