import React from 'react';

async function getVideos(){
	return fetch(`${document.location.origin}/videos.json`)
		.then((response) => response.json());
}

class VideosLoader extends React.Component {
	constructor(){
		super();
		this.state = {
			videos: []
		}
		this.refreshVideos = this.refreshVideos.bind(this);
	}

	async componentDidMount(){
		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos
			});
		}
	}

	async refreshVideos(){
		var newVideos = await getVideos();
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
				<div>
					{this.state.videos.map((video) => 
						<div key={this.state.videos.indexOf(video)}>
							<h3>{video.title}</h3>
							<div style={{height: '300px'}}>
								<video src={video.src} type="video/mp4" className="video-preview" height="225" width="400" controls>
								</video>
							</div>
						</div>
					)}
				</div>
				<button onClick={this.refreshVideos}>Refresh</button>
			</div>
		);
	}
}

export default VideosLoader;