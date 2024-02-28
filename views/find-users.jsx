import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const FindUsers = (props) => {
  return (
    <DefaultLayout>
      <div id="find-users" authenticateduserid={props.userID}>
        <SSRView/>
      </div>
    </DefaultLayout>
  );
}

export default FindUsers;
