import React from 'react';

class Videos extends React.Component {
	constructor(){
		super();
		this.state = {
			videos: []
		}
	}

	async componentDidMount(){
		let newVideos = await this.props.index();
		if(newVideos){
			this.setState({
				videos: newVideos
			});
		}
	}

	render(){

		return (
			<div>
			    <script async src="js/main.js"></script>
			    <div id="videos"></div>
			    <a href="/videos/add">Add a video</a>
			</div>
		);
	}
}

export default Videos;
