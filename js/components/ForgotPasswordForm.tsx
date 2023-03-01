import * as React from 'react';
import { useState } from 'react';
import Navigation from './Navigation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';

export default function ForgotPasswordForm(props) {

  const [forgotPasswordEmailSent, setForgotPasswordEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  async function handleForgotPassword(event) {
    event.preventDefault();

    setForgotPasswordEmailSent(true);

    const query = `mutation updateUser_setForgotPasswordResetPassword($email: String!){
      updateUser_setForgotPasswordResetPassword(email: $email){
        email
      }
    }`;
    const data = await graphQLFetch(query, { email });
    const user = data.updateUser_setForgotPasswordResetPassword;
    // console.log(user)
  }

  return (
    <div className="frame fw-container">
      <Navigation/>
      <div className="desktop-100">

        <div className="page-form">
          <h1>Reset Password</h1>

          <form className="fw-form" onSubmit={handleForgotPassword}>
            <div className="field text">
              <label htmlFor="emailField">Email</label>
              <input type="email" name="email" id="emailField" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div className="small-pad no-x">
              <button className="button" type="submit">
                {forgotPasswordEmailSent ? 'Password reset email sent' : 'Send password reset email'}
                <FontAwesomeIcon icon={faLongArrowAltRight}/>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
