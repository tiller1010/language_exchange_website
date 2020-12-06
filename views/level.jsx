import React from 'react';
import DefaultLayout from './layouts/default';

const Level = (props) => {
  return (
    <DefaultLayout pathResolver="../">
      <h1>Level</h1>
      <div id="level" levelID={props.levelID}></div>
    </DefaultLayout>
  );
}

export default Level;
