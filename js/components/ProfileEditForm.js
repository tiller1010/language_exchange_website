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
var decipher_js_1 = require("../decipher.js");
var emailFetch_js_1 = require("../emailFetch.js");
var ProfileEditForm = /** @class */ (function (_super) {
    __extends(ProfileEditForm, _super);
    function ProfileEditForm(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            email: '',
            displayName: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            profilePictureSrc: '',
            savedAllChanges: true,
            emailVerificationSent: false,
        };
        _this.state = state;
        _this.handleProfilePictureChange = _this.handleProfilePictureChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.handleDeleteUser = _this.handleDeleteUser.bind(_this);
        _this.handleSendEmailVerification = _this.handleSendEmailVerification.bind(_this);
        return _this;
    }
    ProfileEditForm.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myDecipher, newState, encryptedProps;
            var _this = this;
            return __generator(this, function (_a) {
                myDecipher = (0, decipher_js_1.default)(process.env.PROP_SALT);
                newState = {};
                if (this.props.isLive) {
                    encryptedProps = myDecipher(this.props.p);
                    encryptedProps = JSON.parse(encryptedProps);
                    newState = {
                        userID: encryptedProps.userID,
                    };
                }
                else {
                    newState = {
                        userID: this.props.userID,
                    };
                }
                this.setState(newState, function () { return __awaiter(_this, void 0, void 0, function () {
                    var user;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch("/user/".concat(this.state.userID))
                                    .then(function (response) { return response.json(); })];
                            case 1:
                                user = _a.sent();
                                if (user) {
                                    // @ts-ignore
                                    this.setState(__assign({}, user));
                                    this.setState({ savedUser: user });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ProfileEditForm.prototype.handleProfilePictureChange = function (event) {
        var context = this;
        var image = event.target.files[0];
        context.setState({
            profilePictureFile: image,
            savedAllChanges: false,
        });
        if (image) {
            // Set preview
            var reader_1 = new FileReader();
            reader_1.addEventListener('load', function () {
                if (typeof reader_1.result === 'string') {
                    if (/jpeg|jpg|png/.test(reader_1.result.substr(0, 20))) {
                        context.setState({ profilePictureSrc: reader_1.result });
                    }
                    else {
                        alert('Invalid profile picture format.');
                    }
                }
                else {
                    alert('Invalid upload.');
                }
            }, false);
            reader_1.readAsDataURL(image);
        }
    };
    ProfileEditForm.prototype.handleSubmit = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, displayName, firstName, lastName, password, confirmPassword, profilePictureSrc, profilePictureFile, savedUser, query, variables, mutationName, data, missingFields, missingFieldsString;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        event.preventDefault();
                        _a = this.state, email = _a.email, displayName = _a.displayName, firstName = _a.firstName, lastName = _a.lastName, password = _a.password, confirmPassword = _a.confirmPassword, profilePictureSrc = _a.profilePictureSrc, profilePictureFile = _a.profilePictureFile, savedUser = _a.savedUser;
                        if (password != '' && password != confirmPassword) {
                            return [2 /*return*/, alert('Passwords do not match.')];
                        }
                        if (!(email && displayName && firstName)) return [3 /*break*/, 3];
                        query = void 0;
                        variables = void 0;
                        mutationName = void 0;
                        if (!savedUser) return [3 /*break*/, 2];
                        // If updating existing
                        query = "mutation updateUser($userID: ID!, $user: UserInputs, $file: Upload){\n          updateUser(userID: $userID, user: $user, profilePictureFile: $file){\n            _id\n            email\n            displayName\n            firstName\n            lastName\n            profilePictureSrc\n            verifiedEmail\n          }\n        }";
                        variables = {
                            userID: savedUser._id,
                            user: {
                                email: email,
                                displayName: displayName,
                                firstName: firstName,
                                lastName: lastName,
                                password: password,
                            }
                        };
                        if (profilePictureFile) {
                            variables.file = profilePictureFile;
                        }
                        mutationName = 'updateUser';
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, variables, profilePictureFile ? true : false)];
                    case 1:
                        data = _b.sent();
                        this.setState({
                            savedUser: data[mutationName],
                            savedAllChanges: true,
                        });
                        _b.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        missingFields = [
                            { value: email, label: 'email' },
                            { value: displayName, label: 'displayName' },
                            { value: firstName, label: 'firstName' },
                            { value: profilePictureSrc, label: 'profilePicture' },
                        ].filter(function (field) { return !field.value; });
                        missingFieldsString = missingFields.map(function (field) { return field.label; }).join(', ');
                        alert('Missing fields: ' + missingFieldsString);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProfileEditForm.prototype.handleDeleteUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, variables, data, emptyUserObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "mutation removeUser($userID: ID!){\n      removeUser(userID: $userID)\n    }";
                        variables = {
                            userID: this.state.userID
                        };
                        return [4 /*yield*/, (0, graphQLFetch_js_1.default)(query, variables)];
                    case 1:
                        data = _a.sent();
                        emptyUserObject = {
                            email: '',
                            displayName: '',
                            firstName: '',
                            profilePictureSrc: ''
                        };
                        this.setState(__assign(__assign({}, emptyUserObject), { savedUser: null }));
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfileEditForm.prototype.handleSendEmailVerification = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, host, host, host, emailResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ emailVerificationSent: true });
                        user = this.state.savedUser;
                        try {
                            host = "https://".concat(process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL);
                        }
                        catch (e) {
                            try {
                                host = "https://localhost:".concat(process.env.APP_PORT);
                            }
                            catch (e) {
                                host = 'https://localhost:3000';
                            }
                        }
                        return [4 /*yield*/, (0, emailFetch_js_1.sendEmailToUser)(user._id, 'Email Verification', "<p><a href=\"".concat(host, "/verify-email?email=").concat(encodeURIComponent(user.email), "&userID=").concat(user._id, "\">Verify this email address</a></p>"))];
                    case 1:
                        emailResponse = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfileEditForm.prototype.render = function () {
        var _this = this;
        var _a = this.state, email = _a.email, displayName = _a.displayName, firstName = _a.firstName, lastName = _a.lastName, password = _a.password, confirmPassword = _a.confirmPassword, profilePictureSrc = _a.profilePictureSrc, savedUser = _a.savedUser, savedAllChanges = _a.savedAllChanges, emailVerificationSent = _a.emailVerificationSent;
        var verifiedEmail = false;
        if (savedUser) {
            verifiedEmail = savedUser.verifiedEmail;
        }
        return (React.createElement("div", { className: "frame fw-container fw-typography-spacing" },
            React.createElement(Navigation_jsx_1.default, null),
            React.createElement("section", { className: "fw-space double noleft noright" },
                React.createElement("div", { className: "pure-g" },
                    React.createElement("h2", { className: "pure-u-1" }, "User Profile"),
                    !verifiedEmail && savedAllChanges ?
                        React.createElement("button", { className: "button", onClick: this.handleSendEmailVerification },
                            emailVerificationSent ? 'Email Verification Sent' : 'Verify this email',
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faEnvelope }))
                        :
                            '',
                    React.createElement("form", { className: "pure-u-1 fw-form" },
                        React.createElement("div", { className: "flex-container desktop-100" },
                            React.createElement("div", { className: "desktop-50 phone-100" },
                                React.createElement("div", { className: "field text" },
                                    React.createElement("label", { htmlFor: "emailField" }, "Email"),
                                    React.createElement("input", { type: "email", name: "email", id: "emailField", value: email, onChange: function (event) { return _this.setState({ email: event.target.value, savedAllChanges: false }); } })),
                                React.createElement("div", { className: "field text" },
                                    React.createElement("label", { htmlFor: "displayNameField" }, "Display Name"),
                                    React.createElement("input", { type: "text", name: "displayName", id: "displayNameField", value: displayName, onChange: function (event) { return _this.setState({ displayName: event.target.value, savedAllChanges: false }); } })),
                                React.createElement("div", { className: "field text" },
                                    React.createElement("label", { htmlFor: "firstNameField" }, "First Name"),
                                    React.createElement("input", { type: "text", name: "firstName", id: "firstNameField", value: firstName, onChange: function (event) { return _this.setState({ firstName: event.target.value, savedAllChanges: false }); } })),
                                React.createElement("div", { className: "field text" },
                                    React.createElement("label", { htmlFor: "lastNameField" }, "Last Name"),
                                    React.createElement("input", { type: "text", name: "lastName", id: "lastNameField", value: lastName, onChange: function (event) { return _this.setState({ lastName: event.target.value, savedAllChanges: false }); } })),
                                React.createElement("div", { className: "field text" },
                                    React.createElement("label", { htmlFor: "passwordField" }, "Password"),
                                    React.createElement("input", { type: "password", name: "password", id: "passwordField", value: password, onChange: function (event) { return _this.setState({ password: event.target.value, savedAllChanges: false }); } })),
                                React.createElement("div", { className: "field text" },
                                    React.createElement("label", { htmlFor: "confirmPasswordField" }, "Confirm password"),
                                    React.createElement("input", { type: "password", name: "confirmPassword", id: "confirmPasswordField", value: confirmPassword, onChange: function (event) { return _this.setState({ confirmPassword: event.target.value, savedAllChanges: false }); } })),
                                React.createElement("div", { className: "upload-container" },
                                    React.createElement("input", { type: "file", name: "profilePicture", onChange: this.handleProfilePictureChange }),
                                    React.createElement("label", { htmlFor: "profilePicture" },
                                        "Profile Picture",
                                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faUpload }))),
                                React.createElement("div", null,
                                    React.createElement("button", { className: "button", onClick: this.handleSubmit, disabled: savedAllChanges },
                                        savedAllChanges ? 'Saved' : 'Save',
                                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faCheck })))),
                            React.createElement("div", { className: "desktop-30 phone-100" },
                                React.createElement("div", { className: "desktop-100", style: { maxWidth: '100%', height: '300px' } },
                                    React.createElement("div", { className: "pad", style: { height: '100%', width: '100%', boxSizing: 'border-box' } },
                                        React.createElement("div", { className: "profilePicture-preview img-container", style: { height: '100%', width: '100%', background: "url(".concat(profilePictureSrc, ") no-repeat top center/cover") } })))))),
                    React.createElement("div", { className: "pure-u-1 flex-container flex-horizontal-center" })))));
    };
    return ProfileEditForm;
}(React.Component));
exports.default = ProfileEditForm;
