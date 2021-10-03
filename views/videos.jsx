import React from 'react';
import DefaultLayout from './layouts/default';

class Videos extends React.Component {

	render(){

		return (
			<DefaultLayout>
			    <div id="videos" data-userLikedVideos={JSON.stringify(this.props.userLikedVideos)} data-userID={this.props.userID}></div>
			</DefaultLayout>
		);
	}
}

export default Videos;
