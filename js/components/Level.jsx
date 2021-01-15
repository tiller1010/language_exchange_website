import React from 'react';
import axios from 'axios';

class Level extends React.Component {
	constructor(){
		super();
		this.state = {
			topics: []
		}
	}

	componentDidMount(){
		axios.get(`http://localhost:1337/levels/${this.props.levelID}`)
			.then(res => {
				this.setState({
					topics: res.data.topics
				});
			})

		axios.get(`http://localhost:1337/challenges`)
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
							<img src={`http://localhost:1337${topic.FeaturedImage.url}`}/>
						</div>
					);
				default:
					return <p>Invalid media</p>
			}
		}
	}

	render(){
		return (
			<div className="pad">
				<a href={`/`}>Home</a>
			    {this.state.topics ?
			    	this.state.topics.map((topic) => 
			    		<div key={this.state.topics.indexOf(topic)} className="flex x-center">
				    		<a href={`/level/${this.props.levelID}/topics/${topic.id}`} className="pure-u-1 text-center">
					    		<h2>Topic {topic.Topic}</h2>
								{this.renderMedia(topic)}
				    		</a>
				    		{topic.challenges ?
			    				<div className="pure-u-1 flex x-space-around">
					    			{topic.challenges.map((challenge) =>
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