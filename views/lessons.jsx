import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';
import axios from 'axios';

const Lessons = (props) => {

  const { levels } = props;

  function randomTopics(level) {
    if(level.attributes.topicsRandomized){
      return level.attributes.topics.data;
    } else {
      level.topicsRandomized = true;
      level.attributes.topics.data = level.attributes.topics.data.sort(() => .5 - Math.random()).slice(0, 5);
      return level.attributes.topics.data;
    }
  }

  return (
    <DefaultLayout {...props}>
      <div id="lessons" authenticateduserid={props.userID} p={props.p}>
        <SSRView/>
        <div>
          {levels.map((level) =>
            <div key={level.id} className="flex x-center">
              <h2 className="pad" style={{ margin: 0 }}>{level.attributes.Level}</h2>
              <a href={`/level/${level.id}`} className="button" style={{ alignSelf: 'center' }}>
                View Level
              </a>
              <div className="pure-u-1">
                <hr/>
              </div>
              {level.attributes.topics.data ?
                <div className="topics pure-u-1 flex x-space-around">
                  {randomTopics(level).map((topic) =>
                    <div className="topic pure-u-1 pure-u-md-1-3" key={topic.id}>
                      <div className="pad">
                        <div className="flex x-space-between y-center" style={{ flexWrap: 'nowrap' }}>
                          <h3 className="pad no-y no-left" style={{ margin: 0 }}>{topic.attributes.Topic}</h3>
                          <a href={`/level/${level.id}/topic/${topic.id}`} aria-label={`View challenges on ${topic.attributes.Topic}`} className="button" style={{ alignSelf: 'center' }}>
                            View Topic
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                :
                <>{loaded ? <p>No topics</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
              }
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Lessons;
