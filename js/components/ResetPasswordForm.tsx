import * as React from 'react';
import { useState } from 'react';
import Navigation from './Navigation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
// import graphQLFetch from '../graphQLFetch.js';

export default function ResetPasswordForm(props) {

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

  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get('userID');
  let errors = [];
  if (props.errors) {
    errors = JSON.parse(props.errors);
  }

  return (
    <div className="frame fw-container">
      <Navigation/>
      <div className="desktop-100">

        <div className="page-form">
          <h1>Create a new password</h1>

          {errors.length ?
            <ul className="errors">
              {errors.map((error) =>
                <li key={errors.indexOf(error)}>
                  {error}
                </li>
              )}
            </ul>
            :
            ''
          }

          <form className="fw-form" method="POST" action="/reset-password">

            <div className="field text">
              <label htmlFor="resetPasswordField">Reset Password</label>
              <input type="text" name="resetPassword" id="resetPasswordField"/>
            </div>

            <div className="field text">
              <label htmlFor="newPasswordField">New Password</label>
              <input type="password" name="newPassword" id="newPasswordField"/>
            </div>

            <div className="field text">
              <label htmlFor="confirmNewPasswordField">Confirm New Password</label>
              <input type="password" name="confirmNewPassword" id="confirmNewPasswordField"/>
            </div>

            <input type="hidden" name="userID" value={userID}/>

            <div className="small-pad no-x">
              <button className="button" type="submit">
                Submit
                <FontAwesomeIcon icon={faLongArrowAltRight}/>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
