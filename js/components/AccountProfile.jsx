import React from 'react';
import Navigation from './Navigation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTrash, faTimes, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import graphQLFetch from './graphQLFetch.js';
import VideoPlayer from './VideoPlayer.tsx';
import PremiumVideoChatListingForm from './PremiumVideoChatListingForm.tsx';

class AccountProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: {
				completedTopics: [],
				uploadedVideos: [],
				likedVideos: [],
				verified: false
			},
			openRemovalForm: false
		}
		this.findAndSyncUser = this.findAndSyncUser.bind(this);
		this.verifyUser = this.verifyUser.bind(this);
		this.afterToggleLike = this.afterToggleLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
		this.handleDeleteVideo = this.handleDeleteVideo.bind(this);
	}

	async componentDidMount(){
		if(this.props.user){
			this.findAndSyncUser();
		}
	}

	async findAndSyncUser(){
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

	async verifyUser(verificationStatus){
		if(this.props.user){
			const query = `mutation verifyUser($userID: ID!, $verificationStatus: Boolean!){
				verifyUser(userID: $userID, verificationStatus: $verificationStatus){
					verified
				}
			}`;
			const data = await graphQLFetch(query, {
				userID: this.state.user._id,
				verificationStatus: verificationStatus
			});
			let updatedUser = this.state.user;
			updatedUser.verified = data.verifyUser.verified;
			this.setState({
				user: updatedUser
			});
		}
	}

	afterToggleLike(newVideo, likedByCurrentUser){
		newVideo.likedByCurrentUser = likedByCurrentUser;
		let videoAlreadyLiked = false;
		let updatedUser = this.state.user;
		updatedUser.likedVideos.forEach((userLikedVideo) => {
			if(String(newVideo._id) == String(userLikedVideo._id)){
				videoAlreadyLiked = true;
				// Restore like to liked video
				updatedUser.likedVideos[updatedUser.likedVideos.indexOf(userLikedVideo)] = newVideo;
			}
		});
		if(!videoAlreadyLiked && this.props.isCurrentUser){
			// If user likes their own video, add to liked videos
			updatedUser.likedVideos.push(newVideo);
		}
		// Update uploaded video likes if restoring like from one in liked videos
		updatedUser.uploadedVideos.forEach((userUploadedVideo) => {
			if(String(newVideo._id) == String(userUploadedVideo._id)){
				// Restore like to liked video
				updatedUser.uploadedVideos[updatedUser.uploadedVideos.indexOf(userUploadedVideo)] = newVideo;
			}
		});
		this.setState({
			user: updatedUser
		});
	}

	currentUserHasLikedVideo(video, user){
		let liked = false;
		if(user.likedVideos){
			user.likedVideos.forEach((userLikedVideo) => {
				if(userLikedVideo._id === video._id){
					liked = true;
				}
			});
		}
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

		const authenticatedUser = JSON.parse(this.props.authenticatedUser);
		const authenticatedUserIsAdmin = authenticatedUser ? authenticatedUser.isAdmin : false;
		const authenticatedUserIsVerified = authenticatedUser ? authenticatedUser.verified : false;

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
						<h1>Welcome, {this.state.user.firstName}!</h1>
						<a href="/logout" className="button" style={{ width: 'max-content' }}>
							Logout
							<FontAwesomeIcon icon={faSignOutAlt}/>
						</a>
					</div>
					:
					<h1>{this.state.user.firstName}</h1>
				}
				{authenticatedUserIsAdmin ?
					<form>
						{this.state.user.verified ?
							<div>
								<label htmlFor="verifyUser">Remove verification for this user?</label>
								<input type="checkbox" name="verifyUser" checked="checked" onChange={(event) => this.verifyUser(!this.state.user.verified)}/>
							</div>
							:
							<div>
								<label htmlFor="verifyUser">Verify this user?</label>
								<input type="checkbox" name="verifyUser" onChange={(event) => this.verifyUser(!this.state.user.verified)}/>
							</div>
						}
					</form>
					:
					''
				}
				{authenticatedUserIsVerified && this.props.isCurrentUser ?
					<PremiumVideoChatListingForm user={this.props.user}/>
					:
					''
				}
				{authenticatedUser.premiumVideoChatListing ?
					<div>
						<p>{authenticatedUser.premiumVideoChatListing.topic}</p>
						<p>{authenticatedUser.premiumVideoChatListing.language}</p>
						<img src={authenticatedUser.premiumVideoChatListing.thumbnailSrc} alt={authenticatedUser.premiumVideoChatListing.thumbnailSrc}/>
					</div>
					:
					''
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
											<a href={`${this.props.pathResolver}level/${topic.levelID}/topic/${topic.topicID}`} className="button">
											    View Topic
											    <FontAwesomeIcon icon={faLongArrowAltRight}/>
										    </a>
									    </div>
				    					<a href={`level/${topic.levelID}/topic/${topic.topicID}`}>
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
						    		<VideoPlayer
										_id={video._id}
										title={video.title}
										src={`${this.props.pathResolver}${video.src}`}
										thumbnailSrc={`${this.props.pathResolver}${video.thumbnailSrc}`}
										uploadedBy={video.uploadedBy}
										likes={video.likes}
										likedByCurrentUser={video.likedByCurrentUser}
										authenticatedUserID={authenticatedUser ? authenticatedUser._id : null}
										handleDeleteVideo={this.handleDeleteVideo}
										afterToggleLike={this.afterToggleLike}
						    		/>
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
						    		<VideoPlayer
										_id={video._id}
										title={video.title}
										src={`${this.props.pathResolver}${video.src}`}
										thumbnailSrc={`${this.props.pathResolver}${video.thumbnailSrc}`}
										uploadedBy={video.uploadedBy}
										likes={video.likes}
										likedByCurrentUser={video.likedByCurrentUser}
										authenticatedUserID={authenticatedUser ? authenticatedUser._id : null}
										afterToggleLike={this.afterToggleLike}
						    		/>
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