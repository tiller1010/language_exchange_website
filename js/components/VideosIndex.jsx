import React from 'react';
import lozad from 'lozad';

async function getVideos(){
	var urlParams = new URLSearchParams(window.location.search);
	var searchKeywords = urlParams.get('keywords') || '';
	var page = urlParams.get('page') || '';
	return fetch(`${document.location.origin}/videos.json?${searchKeywords ? 'keywords=' + searchKeywords + '&' : ''}${page ? 'page=' + page : ''}`)
		.then((response) => response.json());
}

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

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
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
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

	handleChangePage(event){
		event.preventDefault();
		window.history.pushState({}, '', event.target.href);
		this.refreshVideos();
	}

	handleSearch(event){
		event.preventDefault();
		var url = event.target.action + '?' + (new URLSearchParams(new FormData(event.target)).toString());
		window.history.pushState({}, '', url);
		this.refreshVideos();
	}

	pagination(pages){
		var pageLinks = [];
		for(var i = 1; i <= pages; i++){
			pageLinks.push({pageNumber: i});
		}
		return pageLinks;
	}

	render(){

		var urlParams = new URLSearchParams(window.location.search);
		var keywords = urlParams.get('keywords') || null;

		return (
			<div className="pad">			
				<h1>Videos</h1>
				<div>
					<a href={`/`}>Back</a>
				</div>
				<button onClick={this.refreshVideos}>Refresh</button>
				<form action="/videos" method="GET" onSubmit={this.handleSearch}>
					<label htmlFor="keywords">Search Terms</label>
					<input type="text" name="keywords"/>
					<input type="submit" value="Search"/>
				</form>
			    <div>
				    <a onClick={this.handleChangePage} href="/videos">Clear filters</a>
			    </div>
			    <div>
				    <a href="/videos/add">Add a video</a>
			    </div>
				<div>
					{this.state.pages.length ?
						<ul className="pagination flex">
							{this.state.currentPage > 1 ?
								<li>
									<a onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`}>Prev</a>
								</li>
								:
								''
							}
							{this.state.pages.map((page) =>
								<li key={this.state.pages.indexOf(page)}>
									<a onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`}>{page.pageNumber}</a>
								</li>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<li>
									<a onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`}>Next</a>
								</li>
								:
								''
							}
						</ul>
						:
						<p></p>
					}
					{this.state.videos.length ?
						<div>
							{this.state.videos.map((video) => 
								<div key={video._id}>
									<h3>{video.title}</h3>
									<div style={{height: '300px'}}>
										<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
											video.thumbnailSrc || "/images/videoPlaceholder.png"
										} controls>
											<source src={video.src}></source>
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
									<a onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`}>Prev</a>
								</li>
								:
								''
							}
							{this.state.pages.map((page) =>
								<li key={this.state.pages.indexOf(page)}>
									<a onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`}>{page.pageNumber}</a>
								</li>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<li>
									<a onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`}>Next</a>
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