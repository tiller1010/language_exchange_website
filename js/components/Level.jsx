import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';

class Level extends React.Component {
	constructor(){
		super();
		this.state = {
			topics: []
		}
	}

	componentDidMount(){
		axios.get(`${process.env.STRAPI_URL}/levels/${this.props.levelID}`)
			.then(res => {
				this.setState({
					topics: res.data.topics
				});
			})

		axios.get(`${process.env.STRAPI_URL}/challenges`)
			.then(res => {
				console.log(res)
				if(res.data){
					res.data.forEach((challenge) => {
						if(challenge.topic){
							var topics = this.state.topics;
							topics.forEach((topic) => {
								if(topic.id === challenge.topic.id){
									topic.challenges = topic.challenges ? topic.challenges.concat(challenge) : [ challenge ];
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
		return topic.challenges.sort(() => .5 - Math.random()).slice(0, 5);
	}

	render(){
		return (
			<div className="frame">
				<Navigation/>
			    {this.state.topics ?
			    	this.state.topics.map((topic) => 
			    		<div key={this.state.topics.indexOf(topic)} className="flex x-center">
				    		<h2 className="pad">{topic.Topic}</h2>
				    		<a href={`/level/${this.props.levelID}/topics/${topic.id}`} className="button">
					    		View all
					    		<FontAwesomeIcon icon={faLongArrowAltRight}/>
				    		</a>
				    		<a href={`/level/${this.props.levelID}/topics/${topic.id}`}>
								{this.renderMedia(topic)}
				    		</a>
				    		{topic.challenges ?
			    				<div className="challenges pure-u-1 flex x-space-around">
					    			{this.randomChallenges(topic).map((challenge) =>
					    				<div key={topic.challenges.indexOf(challenge)} className="challenge flex x-center pure-u-1-2">
						    				<div className="pad">
							    				<h2>{challenge.Title}</h2>
						    					<p>{challenge.Content}</p>
					    					</div>
				    					</div>
				    				)}
			    				</div>
			    				:
			    				<p>No challenges</p>
				    		}
			    		</div>
		    		) 
			    	:
			    	<h2>No topics</h2>
			    }
			</div>
		);
	}
}

export default Level;