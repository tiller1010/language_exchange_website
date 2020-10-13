import React from 'react';

class Videos extends React.Component {
	constructor(){
		super();
		this.state = {
			videos: []
		}
	}

	async componentDidMount(){
		// let newVideos = await this.props.index();
		let newVideos = [{	title: 'test'}]
		if(newVideos){
			this.setState({
				videos: newVideos
			});
		}
	}

	render(){

		return (
			<div>
				<h1>Videos</h1>
				<ul>
					{this.state.videos.map((item) => 
						<li key={this.state.videos.indexOf(item)}>{item.title}</li>
					)}
				</ul>
			    <a href="/videos/add">Add a video</a>
			</div>
		);
	}
}

export default Videos;
