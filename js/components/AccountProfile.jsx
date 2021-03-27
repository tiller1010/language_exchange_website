import React from 'react';
import Navigation from './Navigation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faStar, faTrash, faTimes, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Slider from 'react-slick';

class AccountProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: {
				completedTopics: [],
				uploadedVideos: [],
				likedVideos: []
			},
			openRemovalForm: false
		}
		this.findAndSyncUser = this.findAndSyncUser.bind(this);
		this.sendLike = this.sendLike.bind(this);
		this.removeLike = this.removeLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
		this.handleDeleteVideo = this.handleDeleteVideo.bind(this);
	}

	async componentDidMount(){
		if(this.props.user){
			this.findAndSyncUser(this.props.user);
		}
	}

	async findAndSyncUser(identifier){
		const userProfile = JSON.parse(this.props.user);
		const authenticatedUser = JSON.parse(this.props.authenticatedUser);
		if(userProfile && authenticatedUser){
			// Check if user has liked their own video
			if(userProfile.uploadedVideos && authenticatedUser.likedVideos){
				userProfile.uploadedVideos.forEach((video) => {
					video.likedByCurrentUser = this.currentUserHasLikedVideo(video, authenticatedUser);
				});
			}
			// Check if user has liked their own video
			if(userProfile.likedVideos && authenticatedUser.likedVideos){
				userProfile.likedVideos.forEach((video) => {
					video.likedByCurrentUser = this.currentUserHasLikedVideo(video, authenticatedUser);
				});
			}
		}
		this.setState({ user: userProfile });
	}

	async sendLike(video, videoList, videoListType){
		const newLikedVideo = await fetch(`${document.location.origin}/sendLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newLikedVideo.message){
			// Display error message if included in response
			alert(newLikedVideo.message);
		} else if(newLikedVideo) {
			// Update the video state to be liked by the current user.
			newLikedVideo.likedByCurrentUser = true;
			let updatedUser = this.state.user;
			videoList[videoList.indexOf(video)] = newLikedVideo;
			updatedUser[videoListType] = videoList;
			// Check if re-sending like from liked videos so duplicate does not show
			let videoAlreadyLiked = false;
			updatedUser.likedVideos.forEach((userLikedVideo) => {
				if(String(video._id) == String(userLikedVideo._id)){
					videoAlreadyLiked = true;
					// Restore like to liked video
					updatedUser.likedVideos[updatedUser.likedVideos.indexOf(userLikedVideo)] = newLikedVideo;
				}
			});
			if(!videoAlreadyLiked && this.props.isCurrentUser){
				// If user likes their own video, add to liked videos
				updatedUser.likedVideos.push(newLikedVideo);
			}
			// Update uploaded video likes if restoring like from one in liked videos
			updatedUser.uploadedVideos.forEach((userLikedVideo) => {
				if(String(video._id) == String(userLikedVideo._id)){
					videoAlreadyLiked = true;
					// Restore like to liked video
					updatedUser.uploadedVideos[updatedUser.uploadedVideos.indexOf(userLikedVideo)] = newLikedVideo;
				}
			});
			this.setState({
				user: updatedUser
			});
		}
	}

	async removeLike(video, videoList, videoListType){
		const newUnlikedVideo = await fetch(`${document.location.origin}/removeLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newUnlikedVideo.message){
			// Display error message if included in response
			alert(newUnlikedVideo.message);
		} else if(newUnlikedVideo) {
			// Update the video state to remove like from the current user. Used immediately after unliking.
			newUnlikedVideo.likedByCurrentUser = false;
			let updatedUser = this.state.user;
			videoList[videoList.indexOf(video)] = newUnlikedVideo;
			updatedUser[videoListType] = videoList;
			// Update uploaded video likes if removing like from one in liked videos
			updatedUser.uploadedVideos.forEach((userUploadedVideo) => {
				if(String(video._id) == String(userUploadedVideo._id)){
					updatedUser.uploadedVideos[updatedUser.uploadedVideos.indexOf(userUploadedVideo)] = newUnlikedVideo;
				}
			});
			// Update liked video likes if removing like from one in uploaded videos
			updatedUser.likedVideos.forEach((userLikedVideo) => {
				if(String(video._id) == String(userLikedVideo._id)){
					updatedUser.likedVideos[updatedUser.likedVideos.indexOf(userLikedVideo)] = newUnlikedVideo;
				}
			});
			this.setState({
				user: updatedUser
			});
		}
	}

	currentUserHasLikedVideo(video, user){
		let liked = false;
		user.likedVideos.forEach((userLikedVideo) => {
			if(userLikedVideo._id === video._id){
				liked = true;
			}
		});
		return liked;
	}

	handleDeleteVideo(event){
		if(this.state.openRemovalForm){
			this.state.openRemovalForm.submit();
		}
		this.setState({
			openRemovalForm: event.target.parentElement
		})
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

	render(){

		document.addEventListener('cssmodal:hide', () => {
			this.setState({
				openRemovalForm: false
			});
		});

		return (
			<div className="frame">
				<Navigation/>
				{this.props.isCurrentUser ?
					<div>
						<h1>Welcome, {this.state.user.firstName}</h1>
						<a href="/logout" className="button">
							Logout
							<FontAwesomeIcon icon={faSignOutAlt}/>
						</a>
					</div>
					:
					<h1>{this.state.user.firstName}</h1>
				}
				{this.state.user.completedTopics.length ?
					<div className="topics">
						<h2 className="text-center">Completed Topics</h2>
						<hr/>
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
							{this.state.user.completedTopics.map((topic) => 
			    				<div className="topic pure-u-1 pure-u-md-11-24" key={topic.id}>
				    				<div className="pad">
					    				<div className="flex x-space-between">
					    					<h3 className="pad no-y no-left">{topic.Topic}</h3>
											<a href={`level/${topic.levelID}/topics/${topic.topicID}`} className="button">
											    View Topic
											    <FontAwesomeIcon icon={faLongArrowAltRight}/>
										    </a>
									    </div>
				    					<a href={`level/${topic.levelID}/topics/${topic.topicID}`}>
					    					{this.renderMedia(topic)}
				    					</a>
			    					</div>
		    					</div>
							)}
						</Slider>
					</div>
					:
					<div>
						<h2 className="text-center">No Completed Topics</h2>
						<hr/>
					</div>
				}
				{this.props.isCurrentUser ?
					<section className="modal--show" id="remove-video" tabIndex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">
						<div className="modal-inner">
							<header id="modal-label">
								<h2>Remove Video</h2>
							</header>
							<div className="modal-content">
								Are you sure you want to remove this video?
							</div>
							<footer className="flex x-space-around">
								<a className="button" href="#remove-video" onClick={this.handleDeleteVideo}>
									Remove Video
									<FontAwesomeIcon icon={faTrash}/>
								</a>
								<a href="#!" className="button">
									Close
									<FontAwesomeIcon icon={faTimes}/>
								</a>
							</footer>
						</div>
						<a href="#!" className="modal-close" title="Close this modal" data-close="Close" data-dismiss="modal">?</a>
					</section>
					:
					''
				}
				{this.state.user.uploadedVideos.length ?
					<div>
						<h2 className="text-center">Uploaded Videos</h2>
						<hr/>
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
							{this.state.user.uploadedVideos.map((video) => 
								<div key={video._id} className="pure-u-1 pure-u-lg-1-3">
									<div className="flex x-center">
										<div>
											<div className="pure-u-1 flex x-space-between y-center">
												<div>
													<h3>{video.title}</h3>
													<p>By: {video.uploadedBy.displayName}</p>
												</div>
												{this.props.isCurrentUser ?
													<form action="/videos/remove" method="POST">
														<input type="hidden" name="videoID" value={video._id}/>
														<a className="button" href="#remove-video" onClick={this.handleDeleteVideo}>
															Remove Video
															<FontAwesomeIcon icon={faTrash}/>
														</a>
													</form>
													:
													''
												}
											</div>
											<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
												`${this.props.pathResolver}${video.thumbnailSrc}` || "/images/videoPlaceholder.png"
											} controls>
												<source src={`${this.props.pathResolver}${video.src}`}></source>
											</video>
										</div>
									</div>
									<div className="flex x-space-around y-center">
										<p>Likes: {video.likes || 0}</p>
										{video.likedByCurrentUser ?
											<button onClick={() => this.removeLike(video, this.state.user.uploadedVideos, 'uploadedVideos')}>
												Liked
												<FontAwesomeIcon icon={faStar}/>
											</button>
											:
											<button onClick={() => this.sendLike(video, this.state.user.uploadedVideos, 'uploadedVideos')}>
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
					<div>
						<h2 className="text-center">No Uploaded Videos</h2>
						<hr/>
					</div>
				}
				{this.state.user.likedVideos.length ?
					<div>
						<h2 className="text-center">Liked Videos</h2>
						<hr/>
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
							{this.state.user.likedVideos.map((video) => 
								<div key={video._id} className="pure-u-1 pure-u-lg-1-3">
									<div className="flex x-center">
										<div>
											<h3>{video.title}</h3>
											{video.uploadedBy ?
											<div>
												<p>By: {video.uploadedBy.displayName}</p>
											</div>
											:
											<p></p>
											}
											<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
												`${this.props.pathResolver}${video.thumbnailSrc}` || "/images/videoPlaceholder.png"
											} controls>
												<source src={`${this.props.pathResolver}${video.src}`}></source>
											</video>
										</div>
									</div>
									<div className="flex x-space-around y-center">
										<p>Likes: {video.likes || 0}</p>
										{video.likedByCurrentUser ?
											<button onClick={() => this.removeLike(video, this.state.user.likedVideos, 'likedVideos')}>
												Liked
												<FontAwesomeIcon icon={faStar}/>
											</button>
											:
											<button onClick={() => this.sendLike(video, this.state.user.likedVideos, 'likedVideos')}>
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
					<div>
						<h2 className="text-center">No Liked Videos</h2>
						<hr/>
					</div>
				}
			</div>
		);
	}
}

export default AccountProfile;