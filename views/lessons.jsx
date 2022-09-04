import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Lessons = (props) => {
  return (
		<DefaultLayout>
			<div id="lessons" authenticateduserid={props.userID}>
				<SSRView/>
			</div>
		</DefaultLayout>
  );
}

export default Lessons;
