"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Navigation_jsx_1 = require("./Navigation.jsx");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
// import graphQLFetch from '../graphQLFetch.js';
function ResetPasswordForm(props) {
    // const [forgotPasswordEmailSent, setForgotPasswordEmailSent] = useState(false);
    // const [email, setEmail] = useState('');
    // async function handleResetPassword(event) {
    //   event.preventDefault();
    //   setForgotPasswordEmailSent(true);
    //   const query = `mutation updateUser_setForgotPasswordResetPassword($email: String!){
    //     updateUser_setForgotPasswordResetPassword(email: $email){
    //       email
    //     }
    //   }`;
    //   const data = await graphQLFetch(query, { email });
    //   const user = data.updateUser_setForgotPasswordResetPassword;
    //   console.log(user)
    // }
    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('userID');
    var errors = [];
    if (props.errors) {
        errors = JSON.parse(props.errors);
    }
    return (React.createElement("div", { className: "frame fw-container" },
        React.createElement(Navigation_jsx_1.default, null),
        React.createElement("div", { className: "desktop-100" },
            React.createElement("div", { className: "page-form" },
                React.createElement("h1", null, "Create a new password"),
                errors.length ?
                    React.createElement("ul", { className: "errors" }, errors.map(function (error) {
                        return React.createElement("li", { key: errors.indexOf(error) }, error);
                    }))
                    :
                        '',
                React.createElement("form", { className: "fw-form", method: "POST", action: "/reset-password" },
                    React.createElement("div", { className: "field text" },
                        React.createElement("label", { htmlFor: "resetPasswordField" }, "Reset Password"),
                        React.createElement("input", { type: "text", name: "resetPassword", id: "resetPasswordField" })),
                    React.createElement("div", { className: "field text" },
                        React.createElement("label", { htmlFor: "newPasswordField" }, "New Password"),
                        React.createElement("input", { type: "password", name: "newPassword", id: "newPasswordField" })),
                    React.createElement("div", { className: "field text" },
                        React.createElement("label", { htmlFor: "confirmNewPasswordField" }, "Confirm New Password"),
                        React.createElement("input", { type: "password", name: "confirmNewPassword", id: "confirmNewPasswordField" })),
                    React.createElement("input", { type: "hidden", name: "userID", value: userID }),
                    React.createElement("div", { className: "small-pad no-x" },
                        React.createElement("button", { className: "button", type: "submit" },
                            "Submit",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLongArrowAltRight }))))))));
}
exports.default = ResetPasswordForm;
