import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class Videos extends React.Component {

	render(){

		return (
			<DefaultLayout>
			    <div id="videos" userlikedvideos={JSON.stringify(this.props.userLikedVideos)} userid={this.props.userID}>
					<SSRView/>
				</div>
			</DefaultLayout>
		);
	}
}

export default Videos;
