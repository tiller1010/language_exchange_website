import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
import TopicLink from './TopicLink.js';
import decipher from '../decipher.js';

class Level extends React.Component {
	constructor(){
		super();
		this.state = {
			topics: [],
			loaded: false,
		}
	}

	componentDidMount(){
		const myDecipher = decipher(process.env.PROP_SALT);

		let newState = {};
		if (this.props.isLive) {
			let encryptedProps = myDecipher(this.props.p);
			encryptedProps = JSON.parse(encryptedProps);
			newState = {
				levelID: encryptedProps.levelID,
			};
		} else {
			newState = {
				levelID: this.props.levelID,
			};
		}

		this.setState(newState, () => {
			axios.get(`${process.env.STRAPI_API_URL}/levels/${this.state.levelID}?populate[topics][populate][0]=FeaturedMedia%2Cchallenges`)
				.then(res => {
					const data = res.data;
					const level = data.data;
					const topics = level.attributes.topics.data;
					this.setState({
						topics,
						loaded: true,
					});
				})
		})
	}

	randomChallenges(topic){
		return topic.attributes.challenges.data.sort(() => .5 - Math.random()).slice(0, 5);
	}

	render(){

		const { loaded, topics } = this.state;

		return (
			<div className="frame fw-container">
				<Navigation/>
				<div className="flex x-center">
					<div className="pad">
						<a href={`/lessons`} className="button icon-left">
							<FontAwesomeIcon icon={faLongArrowAltLeft}/>
							Back to Lessons
						</a>
					</div>
				</div>
			    {topics.length ?
			    	<div className="topics fw-typography-spacing pure-u-1 flex x-space-around">
				    	{topics.map((topic) => 
				    		<div key={topics.indexOf(topic)} className="topic pure-u-1 pure-u-md-1-3">
					    		<div className="pad">
									<TopicLink topic={topic} levelID={this.state.levelID}/>
						    		{topic.attributes.challenges.data ?
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
								    				<div key={topic.attributes.challenges.data.indexOf(challenge)} className="challenge">
									    				<div className="pad">
										    				<h3>{challenge.attributes.Title}</h3>
									    					<p>{challenge.attributes.Content}</p>
								    					</div>
							    					</div>
							    				)}
						    				</Slider>
					    				</div>
					    				:
					    				<>{loaded ? <p>No challenges</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
						    		}
					    		</div>
				    		</div>
			    		)}
		    		</div>
			    	:
			    	<>{loaded ? <h2>No topics</h2> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
			    }
			</div>
		);
	}
}

export default Level;