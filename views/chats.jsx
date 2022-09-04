import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Chats = (props) => {
  return (
		<DefaultLayout>
			<div id="chats" authenticateduserid={props.userID}>
				<SSRView/>
			</div>
		</DefaultLayout>
  );
}

export default Chats;
