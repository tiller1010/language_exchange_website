import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Lessons = (props) => {
  return (
		<DefaultLayout isLive={props.isLive}>
			<div id="lessons" authenticateduserid={props.userID} p={props.p}>
				<SSRView/>
			</div>
		</DefaultLayout>
  );
}

export default Lessons;
