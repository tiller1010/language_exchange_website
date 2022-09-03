import React from 'react';
import axios from 'axios';
import lozad from 'lozad';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
import VideoSearchForm from './VideoSearchForm.tsx';
import VideoPlayer from './VideoPlayer.tsx';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.tsx';
import TopicLink from './TopicLink.tsx';
import Lessons from './Lessons.tsx';
import HomepageBanner from './HomepageBanner.tsx';

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
			recentVideos: [],
			userLikedVideos: [],
			loaded: false,
		}
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
	}

	componentDidMount(){

		// Get recent videos
		axios.get(`${document.location.origin}/recent-videos`)
			.then(res => {
				this.setState({
					recentVideos: res.data.videos
				}, () => {// Check if the current user has liked each video
					let likedRecentVideos = [];
					if(this.props.userLikedVideos){
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

		const { loaded } = this.state;

		return (
			<div>
				<Navigation/>

				<HomepageBanner/>

				<div className="pure-u-g fw-typography-spacing">

					<section>
						<div className="fw-container">
							<div className="fw-space">

								<div className="fw-space double noleft noright">
									<h2>Complete challenges and sharpen your skills.</h2>
									<hr/>
								</div>

								<Lessons/>

							</div>
						</div>
					</section>

					<section className="grey-section">
						<div className="fw-container">
							<div className="fw-space">

								<div className="fw-space double noleft noright">
									<h2>Browse uploads from language learners around the world.</h2>
									<hr/>
								</div>

								<div className="page-form">
									<VideoSearchForm
										keywords=""
										sort="Recent"
									/>
								</div>

								{this.state.recentVideos.length ?
									<div className="pad no-x">
										<h2>Recent User Uploads</h2>
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
														languageOfTopic={video.languageOfTopic}
														src={video.src}
														thumbnailSrc={video.thumbnailSrc}
														uploadedBy={video.uploadedBy}
														likes={video.likes}
														likedByCurrentUser={this.currentUserHasLikedVideo(video)}
														authenticatedUserID={this.props.userID}
													/>
												</div>
											)}
										</Slider>
									</div>
									:
									''
								}

							</div>
						</div>
					</section>

					<section>
						<div className="fw-container">
							<div className="frame normaltop">

								<div className="fw-space double noleft noright">
									<h2>Use the language you are learning.</h2>
									<hr/>
								</div>

								<div className="desktop-100">
									<PremiumVideoChatListingFeed authenticatedUserID={this.props.userID}/>
								</div>

							</div>
						</div>
					</section>

				</div>

			</div>
		);
	}
}

export default Home;