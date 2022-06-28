import React from 'react';
import Navigation from './Navigation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faLongArrowAltRight, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import graphQLFetch from '../graphQLFetch.js';
import VideoPlayer from './VideoPlayer.tsx';
import Product from './Product.tsx';
import PremiumVideoChatListingForm from './PremiumVideoChatListingForm.tsx';
import RemoveConfirmationModal from './RemoveConfirmationModal.tsx';
// @ts-ignore
import TopicLink from './TopicLink.tsx';

class AccountProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: {
				completedTopics: [],
				uploadedVideos: [],
				products: [],
				likedVideos: [],
				verified: false
			},
			openVideoRemovalForm: false
		}
		this.findAndSyncUser = this.findAndSyncUser.bind(this);
		this.verifyUser = this.verifyUser.bind(this);
		this.afterToggleLike = this.afterToggleLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
		this.handleDeleteVideo = this.handleDeleteVideo.bind(this);
	}

	async componentDidMount(){
		if(this.props.userID){
			this.findAndSyncUser();
		}
	}

	async findAndSyncUser(){
		let userProfile = await fetch(`/user/${this.props.userID}`)
			.then((response) => response.json());
		let authenticatedUser;
		if(this.props.authenticatedUserID){
			authenticatedUser = await fetch(`/user/${this.props.authenticatedUserID}`)
				.then((response) => response.json());
		}
		if(userProfile && authenticatedUser){
			// Check if user has liked their own video
			if(userProfile.uploadedVideos && authenticatedUser.likedVideos){
				userProfile.uploadedVideos.forEach((video) => {
					if(video){
						video.likedByCurrentUser = this.currentUserHasLikedVideo(video, authenticatedUser);
					} else {
						delete userProfile.uploadedVideos[userProfile.uploadedVideos.indexOf(video)];
					}
				});
			}
			// Check if user has liked their own video
			if(userProfile.likedVideos && authenticatedUser.likedVideos){
				userProfile.likedVideos.forEach((video) => {
					if(video){
						video.likedByCurrentUser = this.currentUserHasLikedVideo(video, authenticatedUser);
					} else {
						delete userProfile.likedVideos[userProfile.likedVideos.indexOf(video)];
					}
				});
			}
		}
		this.setState({
			user: userProfile,
			authenticatedUser,
		});
	}

	async verifyUser(verificationStatus){
		if(this.props.userID){
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
		if(this.state.openVideoRemovalForm){
			this.state.openVideoRemovalForm.submit();
		}
		this.setState({
			openVideoRemovalForm: event.target.parentElement
		})
	}

	render(){

		const authenticatedUser = this.state.authenticatedUser;
		const authenticatedUserIsAdmin = authenticatedUser ? authenticatedUser.isAdmin : false;
		const authenticatedUserIsVerified = authenticatedUser ? authenticatedUser.verified : false;
		const products = this.state.user.products || [];

		document.addEventListener('cssmodal:hide', () => {
			this.setState({
				openVideoRemovalForm: false
			});
		});

		return (
			<div className="frame fw-typography-spacing">
				<Navigation/>

				<section className="fw-space double noleft noright">
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
						<form className="fw-form">
							{this.state.user.verified ?
								<div className="field checkbox">
									<input type="checkbox" name="verifyUser" id="verifyUserField" checked="checked" onChange={(event) => this.verifyUser(!this.state.user.verified)}/>
									<label htmlFor="verifyUserField">Remove verification for this user?</label>
								</div>
								:
								<div className="field checkbox">
									<input type="checkbox" name="verifyUser" id="verifyUserField" onChange={(event) => this.verifyUser(!this.state.user.verified)}/>
									<label htmlFor="verifyUserField">Verify this user?</label>
								</div>
							}
						</form>
						:
						''
					}

			    </section>

				<section className="fw-space double noleft noright">

					{authenticatedUserIsVerified && this.props.isCurrentUser ?
						<>
							<PremiumVideoChatListingForm user={authenticatedUser}/>
							<p>
								{authenticatedUser.connectedStripeAccountID ?
									<p className="desktop-hide">Stripe Account ID: {authenticatedUser.connectedStripeAccountID}</p>
									:
									''
								}
								<a href={`/manage-stripe-account/${authenticatedUser.connectedStripeAccountID || ''}`} className="button">
									Manage Stripe Account
									<FontAwesomeIcon icon={faUser}/>
								</a>
							</p>
						</>
						:
						''
					}

				</section>

				<section className="fw-space double noleft noright">

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
											<TopicLink topic={topic} levelID={topic.levelID}/>
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

				</section>

				{this.props.isCurrentUser ?
					<RemoveConfirmationModal
						buttonText="Remove Video"
						buttonAnchor="remove-video"
						modalTitle="Remove Video"
						modalContent="Are you sure you want to remove this video?"
						handleDelete={this.handleDeleteVideo}
					/>
					:
					''
				}

				<section className="fw-space double noleft noright">

					{products.length && this.props.isCurrentUser ?
						<div>
							<h2 className="text-center">Products</h2>
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
								{this.state.user.products.reverse().map((product) => 
									<div key={product._id} className="pure-u-1 pure-u-lg-1-3">
										<Product product={product}/>
									</div>
								)}
							</Slider>
						</div>
						:
						<div>
							<h2 className="text-center">No Purchased Products</h2>
							<hr/>
						</div>
					}

				</section>

				<section className="fw-space double noleft noright">

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
											handleDeleteVideo={this.props.isCurrentUser ? this.handleDeleteVideo : null}
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
				    <div className="small-pad">
					    <a href="/videos/add" className="button">
						    <span>Add a video</span>
					        <FontAwesomeIcon icon={faPlus}/>
					    </a>
				    </div>

			    </section>

				<section className="fw-space double noleft noright">

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

			    </section>

			</div>
		);
	}
}

export default AccountProfile;