import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSlidersH, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';

class Lessons extends React.Component {
	constructor(){
		super();
		this.state = {
		}
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

export default Lessons;