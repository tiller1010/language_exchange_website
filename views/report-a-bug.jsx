import React from 'react';
import DefaultLayout from './layouts/default';
import ServerRenderedNavigation from './components/ServerRenderedNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

export default function ReportABug(props) {

    let errors = {};
    let successMessage = '';

    if (props.errors) {
      // errors = JSON.parse(props.errors)
    }

    if (props.successMessage) {
      successMessage = props.successMessage;
    }

    return (
      <DefaultLayout {...props}>
        <div className="frame fw-container">
          <ServerRenderedNavigation/>
          <div className="desktop-100 page-form">

            <h1>Report a Bug</h1>

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

            {successMessage ?
              <div className="fw-space text-white" style={{ background: 'green', margin: '10px 0' }}>
                {successMessage}
              </div>
              :
              ''
            }

            <form action="/report-a-bug" method="post" className="fw-form">

              <div className="field text">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className="field text">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" required rows="10" className="desktop-100" style={{ padding: '40px 20px' }}></textarea>
              </div>

              <div className="small-pad no-x">
                <button className="button" type="submit">
                  Submit
                  <FontAwesomeIcon icon={faLongArrowAltRight}/>
                </button>
              </div>

            </form>
          </div>
        </div>
      </DefaultLayout>
    );
}
