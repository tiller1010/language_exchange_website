import React from 'react';

async function getVideos(){
	var urlParams = new URLSearchParams(window.location.search);
	var searchKeywords = urlParams.get('keywords') || '';
	return fetch(`${document.location.origin}/videos.json${searchKeywords ? '?keywords=' + searchKeywords : ''}`)
		.then((response) => response.json());
}

class VideosIndex extends React.Component {
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
			<div className="pad">			
				<h1>Videos</h1>
				<a href={`/`}>Back</a>
				<button onClick={this.refreshVideos}>Refresh</button>
				<form action="/videos" method="GET">
					<label htmlFor="keywords">Search Terms</label>
					<input type="text" name="keywords"/>
					<input type="submit" value="Search"/>
				</form>
			    <a href="/videos/add">Add a video</a>
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
			</div>
		);
	}
}

export default VideosIndex;