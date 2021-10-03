import React from 'react';
import axios from 'axios';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSlidersH, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
import VideoSearchForm from './VideoSearchForm.tsx';
import ReadMore from '@jamespotz/react-simple-readmore';
import VideoPlayer from './VideoPlayer.tsx';
import graphQLFetch from './graphQLFetch.js';

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
			recentVideos: [],
			userLikedVideos: []
		}
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
						// console.log(JSON.parse(this.props.userLikedVideos))
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

	async sendLike(video){
		if(!this.props.userID){
			alert('Must be signed in to send like.');
			return;
		}
		const query = `mutation addLike($userID: ID!, $videoID: ID!){
			addLike(userID: $userID, videoID: $videoID){
				_id
				title
				src
				originalName
				thumbnailSrc
				originalThumbnailName
				created
				likes
				uploadedBy {
					_id
					displayName
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			userID: this.props.userID,
			videoID: video._id
		});
		const newLikedVideo = data.addLike;

		if(newLikedVideo) {
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
		const query = `mutation removeLike($userID: ID!, $videoID: ID!){
			removeLike(userID: $userID, videoID: $videoID){
				_id
				title
				src
				originalName
				thumbnailSrc
				originalThumbnailName
				created
				likes
				uploadedBy {
					_id
					displayName
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			userID: this.props.userID,
			videoID: video._id
		});
		const newUnlikedVideo = data.removeLike;

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
					<VideoSearchForm
						keywords=""
						sort=""
					/>
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
						    		<VideoPlayer
										_id={video._id}
										title={video.title}
										src={video.src}
										thumbnailSrc={video.thumbnailSrc}
										uploadedBy={video.uploadedBy}
										likes={video.likes}
										likedByCurrentUser={this.currentUserHasLikedVideo(video)}
						    		/>
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
							    					<a href={`/level/${level.id}/topic/${topic.id}`} className="button">
													    View Topic
													    <FontAwesomeIcon icon={faLongArrowAltRight}/>
												    </a>
											    </div>
						    					<a href={`/level/${level.id}/topic/${topic.id}`}>
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