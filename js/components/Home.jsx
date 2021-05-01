import React from 'react';
import axios from 'axios';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSlidersH, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
import ReadMore from '@jamespotz/react-simple-readmore';

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
			sortControlStatus: '',
			recentVideos: [],
			userLikedVideos: []
		}
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.sendLike = this.sendLike.bind(this);
		this.removeLike = this.removeLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
	}

	componentDidMount(){

		// Get recent videos
		axios.get(`${document.location.origin}/recent-videos`)
			.then(res => {
				// console.log(res)
				this.setState({
					recentVideos: res.data.videos
				}, () => {// Check if the current user has liked each video
					let likedRecentVideos = [];
					if(this.props.userLikedVideos){
						console.log(JSON.parse(this.props.userLikedVideos))
						this.setState({
							userLikedVideos: JSON.parse(this.props.userLikedVideos)
						}, () => {
							this.state.recentVideos.forEach((video) => {
								video.likedByCurrentUser = this.currentUserHasLikedVideo(video);
								likedRecentVideos.push(video);
							});
							this.setState({
								recentVideos: likedRecentVideos
							});
						});
					}
				});
			});

		axios.get(`${process.env.STRAPI_URL}/levels`)
			.then(res => {
				// console.log(res)
				this.setState({
					levels: res.data
				});
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
			let newVideos = this.state.recentVideos;
			newVideos[newVideos.indexOf(video)] = newLikedVideo;
			// Add video to user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = this.state.userLikedVideos;
			newUserLikedVideos.push(video);
			this.setState({
				recentVideos: newVideos,
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
			let newVideos = this.state.recentVideos;
			newVideos[newVideos.indexOf(video)] = newUnlikedVideo;
			// Remove video from user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = [];
			this.state.userLikedVideos.forEach((userLikedVideo) => {
				if(userLikedVideo._id != video._id){
					newUserLikedVideos.push(userLikedVideo);
				}
			});
			this.setState({
				recentVideos: newVideos,
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

	renderMedia(topic){
		if(topic.FeaturedImage){
			switch(topic.FeaturedImage.mime){
				case 'image/jpeg':
					return (
						<div className="img-container">
							<img src={`${process.env.STRAPI_URL}${topic.FeaturedImage.url}`}/>
						</div>
					);
				default:
					return <p>Invalid media</p>
			}
		}
	}

	randomTopics(level){
		if(level.topicsRandomized){
			return level.topics;
		} else {
			level.topicsRandomized = true;
			level.topics = level.topics.sort(() => .5 - Math.random()).slice(0, 5);
			return level.topics;
		}
	}

	render(){
		var { strapiTestImage } = this.state || 'notfound';
		return (
			<div className="frame">
				<Navigation/>
				<div className="page-form">
					<p>Let's enjoy your</p>
					<h1>User Submissions</h1>
					<form action="/videos" method="GET">
						<div className="flex">
							<div className="search-input">
								<input type="text" name="keywords" placeholder="Search video submissions"/>
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
				</div>

			    {this.state.recentVideos.length ?
			    	<div className="pad no-x">
			    		<h2>Recent Submissions</h2>
			    		<Slider {...{
							dots: false,
							infinite: false,
							speed: 500,
							slidesToShow: 3,
							slidesToScroll: 1,
							responsive: [
								{
									breakpoint: 1024,
									settings: {
										slidesToShow: 1.5
									}
								}
							]
			    		}}>
					    	{this.state.recentVideos.map((video) => 
					    		<div key={video._id}>
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
			    		</Slider>
			    	</div>
			    	:
			    	''
			    }

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<div key={level.id} className="flex x-center">
				    		<h2 className="pad">Level {level.Level}</h2>
				    		<a href={`/level/${level.id}`} className="button" style={{ alignSelf: 'center' }}>
					    		View Level
					    		<FontAwesomeIcon icon={faLongArrowAltRight}/>
				    		</a>
				    		<div className="pure-u-1">
					    		<hr/>
				    		</div>
				    		{level.topics ?
				    			<div className="topics pure-u-1 flex x-space-around">
					    			{this.randomTopics(level).map((topic) =>
					    				<div className="topic pure-u-1 pure-u-md-1-3" key={topic.id}>
						    				<div className="pad">
							    				<div className="flex x-space-between">
							    					<h3 className="pad no-y no-left">{topic.Topic}</h3>
							    					<a href={`/level/${level.id}/topics/${topic.id}`} className="button">
													    View Topic
													    <FontAwesomeIcon icon={faLongArrowAltRight}/>
												    </a>
											    </div>
						    					<a href={`/level/${level.id}/topics/${topic.id}`}>
							    					{this.renderMedia(topic)}
						    					</a>
					    					</div>
				    					</div>
				    				)}
			    				</div>
			    				:
			    				<p>No topics</p>
				    		}
			    		</div>
		    		) 
			    	:
			    	<h2>No levels</h2>
			    }
			</div>
		);
	}
}

export default Home;