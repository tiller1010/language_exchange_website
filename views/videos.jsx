import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class Videos extends React.Component {

	render(){

		return (
			<DefaultLayout isLive={this.props.isLive}>
			    <div id="videos" userlikedvideos={JSON.stringify(this.props.userLikedVideos)} userid={this.props.userID} p={this.props.p}>
					<SSRView/>
				</div>
			</DefaultLayout>
		);
	}
}

export default Videos;
