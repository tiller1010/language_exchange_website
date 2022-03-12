import React from 'react';
import DefaultLayout from './layouts/default';

class VideoChat extends React.Component {

  render(){
    return (
      <DefaultLayout pathResolver="../">
          <div id="video-chat" authenticateduserid={this.props.authenticatedUserID}></div>
      </DefaultLayout>
    );
  }
}

export default VideoChat;
