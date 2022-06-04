import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';

class Level extends React.Component {
	constructor(){
		super();
		this.state = {
			topics: []
		}
	}

	componentDidMount(){
		axios.get(`${process.env.STRAPI_URL}/levels/${this.props.levelID}?populate[topics]=*`)
			.then(res => {
				const data = res.data;
				const level = data.data;
				const topics = level.attributes.topics.data;
				this.setState({ topics });
			})

		axios.get(`${process.env.STRAPI_URL}/challenges?populate=*`)
			.then(res => {
				console.log(res)
				if(res.data){
					const challenges = res.data.data;
					challenges.forEach((challenge) => {
						if(challenge.attributes.topic){
							var topics = this.state.topics;
							topics.forEach((topic) => {
								if(topic.id === challenge.attributes.topic.data.id){
									topic.attributes.challenges = topic.attributes.challenges ? topic.attributes.challenges.concat(challenge) : [ challenge ];
									this.setState({
										topics
									});
								}
							});
						}
					})
				}
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

	randomChallenges(topic){
		return topic.attributes.challenges.sort(() => .5 - Math.random()).slice(0, 5);
	}

	render(){
		return (
			<div className="frame">
				<Navigation/>
			    {this.state.topics ?
			    	<div className="topics pure-u-1 flex x-space-around">
				    	{this.state.topics.map((topic) => 
				    		<div key={this.state.topics.indexOf(topic)} className="topic pure-u-1 pure-u-md-1-3">
					    		<div className="pad">
						    		<div className="flex x-space-between">
							    		<h2 className="pad">{topic.attributes.Topic}</h2>
							    		<a href={`/level/${this.props.levelID}/topic/${topic.id}`} className="button" style={{ alignSelf: 'center' }}>
								    		View Topic
								    		<FontAwesomeIcon icon={faLongArrowAltRight}/>
							    		</a>
							    		<a href={`/level/${this.props.levelID}/topic/${topic.id}`}>
											{this.renderMedia(topic)}
							    		</a>
						    		</div>
						    		{topic.attributes.challenges ?
						    			<div className="challenges">
								    		<Slider {...{
												dots: false,
												arrows: true,
												infinite: false,
												speed: 500,
												slidesToShow: 1,
												slidesToScroll: 1
								    		}}>
									    		<div>
										    		<div className="pad">
											    		<h3>Need a quick refresher? Slide forward to preview challenges.</h3>
										    		</div>
									    		</div>
								    			{this.randomChallenges(topic).map((challenge) =>
								    				<div key={topic.attributes.challenges.indexOf(challenge)} className="challenge">
									    				<div className="pad">
										    				<h3>{challenge.attributes.Title}</h3>
									    					<p>{challenge.attributes.Content}</p>
								    					</div>
							    					</div>
							    				)}
						    				</Slider>
					    				</div>
					    				:
					    				<p>No challenges</p>
						    		}
					    		</div>
				    		</div>
			    		)}
		    		</div>
			    	:
			    	<h2>No topics</h2>
			    }
			</div>
		);
	}
}

export default Level;