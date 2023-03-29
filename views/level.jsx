import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

function randomChallenges(topic){
  return topic.attributes.challenges.data.sort(() => .5 - Math.random()).slice(0, 5);
}

const Level = (props) => {

  const { topics, levelID } = props;

  return (
	<DefaultLayout pathResolver="../" isLive={props.isLive}>
		<div className="pad">
			<h1>{props.levelName}</h1>
		</div>
		<div id="level" levelid={props.levelID} p={props.p}>
			<SSRView/>
      {topics.length ?
        <div className="topics fw-typography-spacing pure-u-1 flex x-space-around">
          {topics.map((topic) =>
            <div key={topics.indexOf(topic)} className="topic pure-u-1 pure-u-md-1-3">
              <div className="pad">
                <div className="flex x-space-between y-center" style={{ flexWrap: 'nowrap' }}>
                  <h2 className="pad no-y no-left" style={{ margin: 0 }}>{topic.attributes.Topic}</h2>
                  <a href={`/level/${levelID}/topic/${topic.id}`} aria-label={`View challenges on ${topic.attributes.Topic}`} className="button" style={{ alignSelf: 'center' }}>
                    View Topic
                  </a>
                </div>
                {topic.attributes.challenges.data ?
                  <div className="challenges">
                    {randomChallenges(topic).map((challenge) =>
                      <div key={topic.attributes.challenges.data.indexOf(challenge)} className="challenge">
                        <div className="pad">
                          <h3>{challenge.attributes.Title}</h3>
                          <h4>{challenge.attributes.Content}</h4>
                        </div>
                      </div>
                    )}
                  </div>
                  :
                  ''
                }
              </div>
            </div>
          )}
        </div>
        :
        ''
      }
		</div>
	</DefaultLayout>
  );
}

export default Level;
