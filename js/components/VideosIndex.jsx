import React from 'react';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome, faSlidersH, faBan } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';

async function getVideos(){
	var urlParams = new URLSearchParams(window.location.search);
	var searchKeywords = urlParams.get('keywords') || '';
	var page = urlParams.get('page') || '';
	var sort = urlParams.get('sort') || '';
	return fetch(`${document.location.origin}/videos.json?${searchKeywords ? 'keywords=' + searchKeywords + '&' : ''}
			${page ? 'page=' + page : ''}
			${sort ? '&sort=' + sort : ''}`
		)
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
			keywords: '',
			sort: ''
		}
		this.refreshVideos = this.refreshVideos.bind(this);
		this.pagination = this.pagination.bind(this);
		this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	async componentDidMount(){
		this.refreshVideos();
	}

	async refreshVideos(){
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || 1;
		var keywords = urlParams.get('keywords');
		var sort = urlParams.get('sort');

		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page,
				keywords: keywords || '',
				sort: sort || ''
			});
		}
	}

	handleKeywordsChange(event){
		this.setState({
			keywords: event.target.value
		});
	}

	toggleSortControls(){
		let newStatus = this.state.sortControlStatus ? '' : 'open';
		this.setState({
			sortControlStatus: newStatus
		});
	}

	handleSortChange(event){
		this.setState({
			sort: event.target.value
		});
		// This approach triggers the onSubmit handler
		event.target.form.querySelector('input[type="submit"]').click();
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
		var context = this;

		// When using back or forward buttons in browser
		window.addEventListener('popstate', function(event){
			if(event != null){
				context.refreshVideos();
			}
		}); 

		return (
			<div className="frame">			
				<Navigation/>
				<div className="page-form">
					<h1>Videos</h1>
					<form action="/videos" method="GET">
						<div className="flex">
							<div className="search-input">
								<input type="text" name="keywords" value={this.state.keywords} onChange={this.handleKeywordsChange}  placeholder="Search video submissions"/>
						        <FontAwesomeIcon icon={faSearch}/>
								<input type="submit" value="Search"/>
							</div>
							<div className="sort-controls flex">
								<div className="control-icon pure-u-1" onClick={this.toggleSortControls}>
									<FontAwesomeIcon icon={faSlidersH}/>
								</div>
								<div className={`sort-options flex pure-u-1 ${this.state.sortControlStatus}`}>
									<div>
										<label htmlFor="sort-all">All</label>
										<input type="radio" name="sort" value="" id="sort-all" checked={this.state.sort === '' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-oldest">Oldest</label>
										<input type="radio" name="sort" value="Oldest" id="sort-oldest" checked={this.state.sort === 'Oldest' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-recent">Recent</label>
										<input type="radio" name="sort" value="Recent" id="sort-recent" checked={this.state.sort === 'Recent' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-AZ">A-Z</label>
										<input type="radio" name="sort" value="A-Z" id="sort-AZ" checked={this.state.sort === 'A-Z' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-ZA">Z-A</label>
										<input type="radio" name="sort" value="Z-A" id="sort-ZA" checked={this.state.sort === 'Z-A' ? true : false} onChange={this.handleSortChange}/>
									</div>
								</div>
							</div>
						</div>
					</form>
				    <div className="flex">
					    <div>
							<button onClick={this.refreshVideos}>
								Refresh
						        <FontAwesomeIcon icon={faSync}/>
							</button>
					    </div>
					    <span>&nbsp;</span>
					    <div>
						    <a onClick={this.handleChangePage} href="/videos" className="button">
							    Clear filters
						        <FontAwesomeIcon icon={faBan}/>
						    </a>
					    </div>
				    </div>
			    </div>
			    
				<div>
					{this.state.pages.length ?
						<ul className="pagination flex">
							{this.state.currentPage > 1 ?
								<li>
									<a onClick={this.handleChangePage}
										href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}
											${this.state.sort ? '&sort=' + this.state.sort : ''}`}
										className="button icon-left"
										aria-label="previous"
									>
								        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
										Prev
									</a>
								</li>
								:
								''
							}
							{this.state.pages.map((page) =>
								<li key={this.state.pages.indexOf(page)}>
									<a onClick={this.handleChangePage}
										href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}
											${this.state.sort ? '&sort=' + this.state.sort : ''}`}
										className={`button no-icon ${page.pageNumber == this.state.currentPage ? 'selected' : ''}`}
										aria-label={`page ${page.pageNumber}`}
									>
										{page.pageNumber}
									</a>
								</li>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<li>
									<a onClick={this.handleChangePage}
										href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}
											${this.state.sort ? '&sort=' + this.state.sort : ''}`}
										className="button"
									>
										Next
										<FontAwesomeIcon icon={faLongArrowAltRight}/>
									</a>
								</li>
								:
								''
							}
						</ul>
						:
						<p></p>
					}
					{this.state.videos.length ?
						<div className="flex">
							{this.state.videos.map((video) => 
								<div key={video._id} className="pure-u-1 pure-u-lg-1-3">
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
									<a onClick={this.handleChangePage}
										href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}
											${this.state.sort ? '&sort=' + this.state.sort : ''}`}
										className="button icon-left"
										aria-label="previous"
									>
								        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
										Prev
									</a>
								</li>
								:
								''
							}
							{this.state.pages.map((page) =>
								<li key={this.state.pages.indexOf(page)}>
									<a onClick={this.handleChangePage}
										href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}
											${this.state.sort ? '&sort=' + this.state.sort : ''}`}
										className={`button no-icon ${page.pageNumber == this.state.currentPage ? 'selected' : ''}`}
										aria-label={`page ${page.pageNumber}`}
									>
										{page.pageNumber}
									</a>
								</li>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<li>
									<a onClick={this.handleChangePage}
										href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}
											${this.state.sort ? '&sort=' + this.state.sort : ''}`}
										className="button"
									>
										Next
										<FontAwesomeIcon icon={faLongArrowAltRight}/>
									</a>
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