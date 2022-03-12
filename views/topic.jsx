import React from 'react';
import DefaultLayout from './layouts/default';

const Topic = (props) => {
  return (
	<DefaultLayout pathResolver="../../../">
		<div className="pad">
			<h1>Level {props.levelID}</h1>
		</div>
		<div id="topic" levelid={props.levelID} topicid={props.topicID} completed={String(props.completed)}></div>
	</DefaultLayout>
  );
}

export default Topic;
