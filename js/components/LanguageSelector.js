"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var languages = require('language-list')();
function LanguageSelector(props) {
    var name = props.name, id = props.id, onChange = props.onChange, value = props.value;
    // Required unless specified otherwise
    var required = true;
    if (props.required === false) {
        required = false;
    }
    // Get all languages and format the selection array
    var languagesArray = [];
    languages.getLanguageCodes().forEach(function (langCode) {
        languagesArray.push({
            languageName: languages.getLanguageName(langCode),
            langCode: langCode,
        });
    });
    // Filter for select languages
    var validLanguages = [
        'English',
        'Spanish',
        'French',
        'German',
        'Italian',
        'Japanese',
        'Korean',
        'Russian',
        'Chinese',
        'Swedish',
        'Finnish',
        'Arabic',
    ];
    languagesArray = languagesArray.filter(function (lang) { return validLanguages.indexOf(lang.languageName) != -1; });
    // Custom languages
    languagesArray.push({
        languageName: 'ASL',
        langCode: 'ASL',
    });
    languagesArray.push({
        languageName: 'Ukrainian',
        langCode: 'Ukrainian',
    });
    // Sort langauges by name
    languagesArray = languagesArray.sort(function (a, b) { return a.languageName.localeCompare(b.languageName); });
    return (React.createElement("div", { className: "field dropdown ".concat(props.className || '') },
        React.createElement("label", { htmlFor: id }, "Language"),
        React.createElement("select", { name: name, id: id, onChange: onChange, value: value, required: required },
            React.createElement("option", { value: "" }, "Select a language"),
            languagesArray.map(function (lang) {
                return React.createElement("option", { key: lang.langCode, value: lang.languageName }, lang.languageName);
            }))));
}
exports.default = LanguageSelector;
