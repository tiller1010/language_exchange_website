import React from 'react';
import axios from 'axios';

class Topic extends React.Component {
	constructor(){
		super();
		this.state = {
			challenges: []
		}
	}

	componentDidMount(){
		axios.get(`http://localhost:1337/topics/${this.props.topicID}`)
			.then(res => {
				console.log(res)
				if(res.data){
					this.setState({
						topic: res.data.Topic
					})
				}
			})

		axios.get(`http://localhost:1337/challenges`)
			.then(res => {
				if(res.data){
					res.data.forEach((challenge) => {
						if(challenge.topic){
							var challenges = this.state.challenges;
							if(this.props.topicID == challenge.topic.id){
								challenges = challenges.concat(challenge);
								this.setState({
									challenges
								});
							}
						}
					})
				}
			})
	}

	renderMedia(challenge){
		if(challenge.FeaturedMedia){
			if(challenge.FeaturedMedia.length){
				switch(challenge.FeaturedMedia[0].mime){
					case 'image/jpeg':
						return (
							<div className="img-container">
								<img src={`http://localhost:1337${challenge.FeaturedMedia[0].url}`}/>
							</div>
						);
					case 'video/mp4':
						return (
							<video height="225" width="400" controls>
								<source src={`http://localhost:1337${challenge.FeaturedMedia[0].url}`} type="video/mp4"/>
							</video>
						);
					default:
						return <p>Invalid media</p>
				}
			}
		}
	}

	render(){
		return (
			<div className="pad">
				<a href={`/`}>Home</a>
				<span>&nbsp;</span>
				<a href={`/level/${this.props.levelID}`}>Back</a>
				<h2 className="text-center">{this.state.topic}</h2>
			    {this.state.challenges ?
			    	<div className="challenges pure-u-1 flex x-space-around">
				    	{this.state.challenges.map((challenge) => 
				    		<div key={this.state.challenges.indexOf(challenge)} className="flex x-center pure-u-1-2">
					    		<div className="pad">
					    			<h2>{challenge.Title}</h2>
					    			<p>{challenge.Content}</p>
					    			{challenge.FeaturedMedia.length ?
					    				this.renderMedia(challenge)
					    				:
					    				''
					    			}
					    		</div>
				    		</div>
			    		)}
		    		</div>
			    	:
			    	<h2>No challenges</h2>
			    }
			</div>
		);
	}
}

export default Topic;