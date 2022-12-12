import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Chats = (props) => {
  return (
		<DefaultLayout isLive={props.isLive}>
			<div id="chats" authenticateduserid={props.authenticatedUserID} p={props.p}>
				<SSRView/>
			</div>
		</DefaultLayout>
  );
}

export default Chats;
