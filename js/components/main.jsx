import React from 'react';
import ReactDOM from 'react-dom';

async function getVideos(){
	return fetch(`${document.location.origin}/videos.json`)
		.then((response) => response.json());
}

class VideoLoader extends React.Component {
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
				<ul>
					{this.state.videos.map((item) => 
						<li key={this.state.videos.indexOf(item)}>{item.title}</li>
					)}
				</ul>
				<button onClick={this.refreshVideos}>Refresh</button>
			</div>
		);
	}
}

ReactDOM.render(<VideoLoader/>, document.getElementById('app'));