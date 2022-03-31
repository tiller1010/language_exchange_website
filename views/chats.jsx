import React from 'react';
import DefaultLayout from './layouts/default';

const Chats = (props) => {
  return (
		<DefaultLayout>
			<div id="chats" authenticateduserid={props.userID}></div>
		</DefaultLayout>
  );
}

export default Chats;
