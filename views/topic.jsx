import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Topic = (props) => {

  const { challenges } = props;

  return (
	<DefaultLayout pathResolver="../../../">
		<div className="pad">
			<h1 className="topic-heading">{props.levelName} - {props.topicName}</h1>
		</div>
		<div id="topic" levelid={props.levelID} topicid={props.topicID} completed={String(props.completed)}>
			<SSRView/>

      {challenges.length ?
        <form className="challenges pure-u-1 fw-form flex x-space-around">
          {challenges.map((challenge) =>
            <div key={challenges.indexOf(challenge)} className="flex x-center pure-u-1 pure-u-lg-1-2">
              <div className="challenge">
                <div className="pad">
                  <h2>{challenge.attributes.Title}</h2>
                  <h3 translate="no" className="notranslate">{challenge.attributes.Content}</h3>
                </div>
              </div>
            </div>
          )}
        </form>
        :
        ''
      }

		</div>
	</DefaultLayout>
  );
}

export default Topic;
