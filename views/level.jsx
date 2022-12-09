import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Level = (props) => {
  return (
	<DefaultLayout pathResolver="../" isLive={props.isLive}>
		<div className="pad">
			<h1>{props.levelName}</h1>
		</div>
		<div id="level" levelid={props.levelID} p={props.p}>
			<SSRView/>
		</div>
	</DefaultLayout>
  );
}

export default Level;
