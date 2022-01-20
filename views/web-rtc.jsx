import React from 'react';
import DefaultLayout from './layouts/default';

class WebRTC extends React.Component {

  render(){
    return (
      <DefaultLayout pathResolver="../">
        <div className="pad">

          <div id="web-rtc">
            <h2>1. Start your Webcam</h2>
            <div className="flex x-center y-center">
              <span>
                <h3>Local Stream</h3>
                <video id="webcamVideo" autoPlay playsInline muted></video>
              </span>
              <span>
                <h3>Remote Stream</h3>
                <video id="remoteVideo" autoPlay playsInline></video>
              </span>


            </div>

            <button id="webcamButton">Start webcam</button>
            <h2>2. Create a new Call</h2>
            <button id="callButton" disabled>Create Call (offer)</button>

            <h2>3. Join a Call</h2>
            <p>Answer the call from a different browser window or device</p>
            
            <input id="callInput" />
            <button id="answerButton" disabled>Answer</button>

            <h2>4. Hangup</h2>

            <button id="hangupButton" disabled>Hangup</button>
          </div>

        </div>
      </DefaultLayout>
    );
  }
}

export default WebRTC;
