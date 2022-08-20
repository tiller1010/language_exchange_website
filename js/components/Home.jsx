import React from 'react';
import axios from 'axios';
import lozad from 'lozad';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
import VideoSearchForm from './VideoSearchForm.tsx';
import VideoPlayer from './VideoPlayer.tsx';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.tsx';
// @ts-ignore
import TopicLink from './TopicLink.tsx';
// @ts-ignore
import Lessons from './Lessons.tsx';

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

				<div className="home-banner flex-container fw-typography-spacing" style={{background: 'url("https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2016%2F01%2F296416-landscape-nature-mountain-lake-trees-snow-clouds-forest.jpg&f=1&nofb=1") no-repeat center center/cover'}}>
					<div className="desktop-100 home-banner-content">
						<div className="fw-container">
							<div className="fw-space">
								<h1>Learn languages from everyone</h1>
								<p>Language is fastest learned when used. Why not start speaking the language you want to learn today?</p>
							</div>
						</div>
					</div>
					<div className="desktop-100 fw-container flex-container flex-vertical-bottom">
						<div className="fw-space">
							<div className="flex-container flex-vertical-stretch">

								<div className="desktop-33 tablet-100">
									<div className="fw-space">
										<a href="/videos" className="home-banner-link">
											<div className="fw-space">
												<h2>Content from learners</h2>
												<p>
													Learn from students just like you. Browse uploads from language learners around the world.
												</p>
											</div>
										</a>
									</div>
								</div>

								<div className="desktop-33 tablet-100">
									<div className="fw-space">
										<a href="/lessons" className="home-banner-link">
											<div className="fw-space">
												<h2>Improve your skills</h2>
												<p>
													Complete challenges and sharpen your skills.
												</p>
											</div>
										</a>
									</div>
								</div>

								<div className="desktop-33 tablet-100">
									<div className="fw-space">
										<a href="/chats" className="home-banner-link">
											<div className="fw-space">
												<h2>Schedule practice time</h2>
												<p>
													Set a time to practice with a native speaker.
												</p>
											</div>
										</a>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>

				<div className="pure-u-g fw-typography-spacing frame">

					<section className="fw-space double noleft noright">

						<div className="fw-space double noleft noright">
							<h2>Browse uploads from language learners around the world.</h2>
							<hr/>
						</div>

						<div className="page-form">
							<h2>User Submitted Content</h2>
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

				    </section>

				    <section className="fw-space double noleft noright">

						<div className="fw-space double noleft noright">
							<h2>Complete challenges and sharpen your skills.</h2>
							<hr/>
						</div>

					    <Lessons/>

				    </section>

				    <section className="fw-space double noleft noright">

						<div className="fw-space double noleft noright">
							<h2>Support teachers.</h2>
							<hr/>
						</div>

						<div className="desktop-100">
							<PremiumVideoChatListingFeed authenticatedUserID={this.props.userID}/>
						</div>

				    </section>

			    </div>

			</div>
		);
	}
}

export default Home;