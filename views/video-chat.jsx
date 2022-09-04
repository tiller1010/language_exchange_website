import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class VideoChat extends React.Component {

  render(){
    return (
      <DefaultLayout pathResolver="../">
          <div id="video-chat" authenticateduserid={this.props.authenticatedUserID}>
            <SSRView/>
          </div>
      </DefaultLayout>
    );
  }
}

export default VideoChat;
