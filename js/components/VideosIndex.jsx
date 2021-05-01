import React from 'react';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome, faSlidersH, faBan, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Navigation from './Navigation.jsx';
import Slider from 'react-slick';
import ReadMore from '@jamespotz/react-simple-readmore';

async function getVideos(){
	var urlParams = new URLSearchParams(window.location.search);
	var searchKeywords = urlParams.get('keywords') || '';
	var page = urlParams.get('page') || '';
	var sort = urlParams.get('sort') || '';
	return fetch(`${document.location.origin}/videos.json?${searchKeywords ? 'keywords=' + searchKeywords + '&' : ''}
			${page ? 'page=' + page : ''}
			${sort ? '&sort=' + sort : ''}`
		, { credentials: 'include' })
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
			sort: '',
			userLikedVideos: []
		}
		this.refreshVideos = this.refreshVideos.bind(this);
		this.pagination = this.pagination.bind(this);
		this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.sendLike = this.sendLike.bind(this);
		this.removeLike = this.removeLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
	}

	async componentDidMount(){
		this.refreshVideos();
		this.setState({
			userLikedVideos: JSON.parse(this.props.userLikedVideos)
		});
	}

	async refreshVideos(){
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || 1;
		var keywords = urlParams.get('keywords');
		var sort = urlParams.get('sort');

		var newVideos = await getVideos();
		if(newVideos){
			// Check if the current user has liked each video
			newVideos.videos.forEach((video) => {
				video.likedByCurrentUser = this.currentUserHasLikedVideo(video);
			});

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

	async sendLike(video){
		const newLikedVideo = await fetch(`${document.location.origin}/sendLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newLikedVideo.message){
			// Display error message if included in response
			alert(newLikedVideo.message);
		} else if(newLikedVideo) {
			// Update the video state to be liked by the current user. Used immediately after liking.
			newLikedVideo.likedByCurrentUser = true;
			let newVideos = this.state.videos;
			newVideos[newVideos.indexOf(video)] = newLikedVideo;
			// Add video to user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = this.state.userLikedVideos;
			newUserLikedVideos.push(video);
			this.setState({
				videos: newVideos,
				userLikedVideos: newUserLikedVideos
			});
		}
	}

	async removeLike(video){
		const newUnlikedVideo = await fetch(`${document.location.origin}/removeLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newUnlikedVideo.message){
			// Display error message if included in response
			alert(newUnlikedVideo.message);
		} else if(newUnlikedVideo) {
			// Update the video state to remove like from the current user. Used immediately after unliking.
			newUnlikedVideo.likedByCurrentUser = false;
			let newVideos = this.state.videos;
			newVideos[newVideos.indexOf(video)] = newUnlikedVideo;
			// Remove video from user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = [];
			this.state.userLikedVideos.forEach((userLikedVideo) => {
				if(userLikedVideo._id != video._id){
					newUserLikedVideos.push(userLikedVideo);
				}
			});
			this.setState({
				videos: newVideos,
				userLikedVideos: newUserLikedVideos
			});
		}
	}

	currentUserHasLikedVideo(video){
		let liked = false;
		this.state.userLikedVideos.forEach((userLikedVideo) => {
			if(userLikedVideo._id === video._id){
				liked = true;
			}
		});
		return liked;
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
									<div className="flex x-center">
										<div>
											<div className="flex x-space-between y-center">
												<div style={{ maxWidth: '65%' }}>
													<ReadMore
											            fade
											            minHeight={58}
											            btnStyles={{
											            	position: 'absolute',
											            	bottom: '-15px',
											            	border: 'none',
											            	margin: 0,
											            	padding: '5px',
											            	zIndex: 1
											            }}
										            >
														<h3>{video.title}</h3>
													</ReadMore>
												</div>
												{video.uploadedBy._id ?
													<div>
														<p>By: <a href={`/account-profile/${video.uploadedBy._id}`} aria-label={`${video.uploadedBy.displayName} profile`}>{video.uploadedBy.displayName}</a></p>
													</div>
													:
													<div>
														<p>By: {video.uploadedBy.displayName}</p>
													</div>
												}
											</div>
											<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
												video.thumbnailSrc || "/images/videoPlaceholder.png"
											} controls>
												<source src={video.src}></source>
											</video>
										</div>
									</div>
									<div className="flex x-space-around y-center">
										<p>Likes: {video.likes || 0}</p>
										{video.likedByCurrentUser ?
											<button onClick={() => this.removeLike(video)}>
												Liked
												<FontAwesomeIcon icon={faStar}/>
											</button>
											:
											<button onClick={() => this.sendLike(video)}>
												Like
												<FontAwesomeIcon icon={farStar}/>
											</button>
										}
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