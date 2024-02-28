import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Videos = (props) => {

  const { videos } = props;

  return (
    <DefaultLayout {...props}>
        <div id="videos" userlikedvideos={JSON.stringify(props.userLikedVideos)} userid={props.userID} p={props.p}>
        <SSRView/>
        {videos.map((video) =>
          <div key={video._id} className="pure-u-1 pure-u-lg-1-3">
            <div style={{ padding: '0 10px' }}>
              <h2>{video.title}</h2>
              {video.languageOfTopic ?
                <h3>{video.languageOfTopic}</h3>
                :
                ''
              }
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Videos;
