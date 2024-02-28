import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class VideosAdd extends React.Component {

  render(){

    return (
      <DefaultLayout pathResolver={this.props.pathResolver || '../'} {...this.props}>
          <div id="videos-add" video={this.props.video}>
        <SSRView/>
          </div>
      </DefaultLayout>
    );
  }
}

export default VideosAdd;
