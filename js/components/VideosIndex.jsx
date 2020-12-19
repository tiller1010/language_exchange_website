import React from 'react';

async function getVideos(){
	var urlParams = new URLSearchParams(window.location.search);
	var searchKeywords = urlParams.get('keywords') || '';
	var page = urlParams.get('page') || '';
	return fetch(`${document.location.origin}/videos.json?${searchKeywords ? 'keywords=' + searchKeywords + '&' : ''}${page ? 'page=' + page : ''}`)
		.then((response) => response.json());
}

class VideosIndex extends React.Component {
	constructor(){
		super();
		this.state = {
			videos: [],
			pages: [],
			currentPage: 1
		}
		this.refreshVideos = this.refreshVideos.bind(this);
		this.pagination = this.pagination.bind(this);
	}

	async componentDidMount(){
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || 1;

		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
	}

	async refreshVideos(){
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || '';

		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
	}

	pagination(pages){
		var pageLinks = [];
		for(var i = 1; i <= pages; i++){
			pageLinks.push({pageNumber: i});
		}
		return pageLinks;
	}

	render(){
		return (
			<div className="pad">			
				<h1>Videos</h1>
				<div>
					<a href={`/`}>Back</a>
				</div>
				<button onClick={this.refreshVideos}>Refresh</button>
				<form action="/videos" method="GET">
					<label htmlFor="keywords">Search Terms</label>
					<input type="text" name="keywords"/>
					<input type="submit" value="Search"/>
				</form>
			    <div>
				    <a href="/videos">Clear filters</a>
			    </div>
			    <div>
				    <a href="/videos/add">Add a video</a>
			    </div>
				<div>
					{this.state.pages.length ?
						<ul className="pagination flex">
							{this.state.currentPage > 1 ?
								<li>
									<a href={`/videos?page=${Number(this.state.currentPage) - 1}`}>Prev</a>
								</li>
								:
								''
							}
							{this.state.pages.map((page) =>
								<li key={this.state.pages.indexOf(page)}>
									<a href={`/videos?page=${page.pageNumber}`}>{page.pageNumber}</a>
								</li>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<li>
									<a href={`/videos?page=${Number(this.state.currentPage) + 1}`}>Next</a>
								</li>
								:
								''
							}
						</ul>
						:
						<p>1</p>
					}
					{this.state.videos.length ?
						<div>
							{this.state.videos.map((video) => 
								<div key={this.state.videos.indexOf(video)}>
									<h3>{video.title}</h3>
									<div style={{height: '300px'}}>
										<video src={video.src} type="video/mp4" className="video-preview" height="225" width="400" controls preload="none">
										</video>
									</div>
								</div>
							)}
						</div>
						:
						<p>No videos</p>
					}
					{this.state.pages.length ?
						<ul className="pagination flex">
							{this.state.currentPage > 1 ?
								<li>
									<a href={`/videos?page=${Number(this.state.currentPage) - 1}`}>Prev</a>
								</li>
								:
								''
							}
							{this.state.pages.map((page) =>
								<li key={this.state.pages.indexOf(page)}>
									<a href={`/videos?page=${page.pageNumber}`}>{page.pageNumber}</a>
								</li>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<li>
									<a href={`/videos?page=${Number(this.state.currentPage) + 1}`}>Next</a>
								</li>
								:
								''
							}
						</ul>
						:
						<p></p>
					}
				</div>
			</div>
		);
	}
}

export default VideosIndex;