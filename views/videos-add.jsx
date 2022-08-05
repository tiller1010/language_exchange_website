import React from 'react';
import DefaultLayout from './layouts/default';

class VideosAdd extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver={this.props.pathResolver || '../'}>
		      <div id="videos-add" video={this.props.video}></div>
			</DefaultLayout>
		);
	}
}

export default VideosAdd;
