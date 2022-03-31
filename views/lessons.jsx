import React from 'react';
import DefaultLayout from './layouts/default';

const Lessons = (props) => {
  return (
		<DefaultLayout>
			<div id="lessons" authenticateduserid={props.userID}></div>
		</DefaultLayout>
  );
}

export default Lessons;
