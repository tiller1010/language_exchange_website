import React from 'react';
import DefaultLayout from './layouts/default';

class VideosAdd extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver="../">
		      <div id="videos-add"></div>
			</DefaultLayout>
		);
	}
}

export default VideosAdd;
