import React from 'react';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';

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
			currentPage: 1,
			keywords: ''
		}
		this.refreshVideos = this.refreshVideos.bind(this);
		this.pagination = this.pagination.bind(this);
		this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	async componentDidMount(){
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || 1;
		var keywords = urlParams.get('keywords');

		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page,
				keywords: keywords || ''
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

	handleKeywordsChange(event){
		this.setState({
			keywords: event.target.value
		});
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

		window.onpopstate = this.refreshVideos(); 

		return (
			<div className="pad">			
				<h1>Videos</h1>
				<div>
					<a href={`/`} className="button">
						Home
				        <FontAwesomeIcon icon={faHome}/>
					</a>
				</div>
				<button onClick={this.refreshVideos}>
					Refresh
			        <FontAwesomeIcon icon={faSync}/>
				</button>
				<form action="/videos" method="GET" onSubmit={this.handleSearch}>
					<div className="search-input">
						<input type="text" name="keywords" value={this.state.keywords} onChange={this.handleKeywordsChange}  placeholder="Search video submissions"/>
				        <FontAwesomeIcon icon={faSearch}/>
						<input type="submit" value="Search"/>
				    </div>
				</form>
			    <div>
				    <a onClick={this.handleChangePage} href="/videos" className="button">
					    Clear filters
				        <FontAwesomeIcon icon={faSync}/>
				    </a>
			    </div>
			    <div>
				    <a href="/videos/add" className="button">
					    Add a video
				        <FontAwesomeIcon icon={faPlus}/>
				    </a>
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