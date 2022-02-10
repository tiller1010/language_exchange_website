import React from 'react';
import DefaultLayout from './layouts/default';

class VideoChat extends React.Component {

  render(){
    return (
      <DefaultLayout pathResolver="../">
          <div id="web-rtc"></div>
      </DefaultLayout>
    );
  }
}

export default VideoChat;
