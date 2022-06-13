import React from 'react';
import DefaultLayout from './layouts/default';

const Level = (props) => {
  return (
	<DefaultLayout pathResolver="../">
		<div className="pad">
			<h1>{props.levelName}</h1>
		</div>
		<div id="level" levelid={props.levelID}></div>
	</DefaultLayout>
  );
}

export default Level;
