import React from 'react';
import DefaultLayout from './layouts/default';

const Topic = (props) => {
  return (
    <DefaultLayout pathResolver="../../../">
      <h1>Topic {props.topicID}</h1>
      <div id="topic" levelID={props.levelID} topicID={props.topicID}></div>
    </DefaultLayout>
  );
}

export default Topic;
