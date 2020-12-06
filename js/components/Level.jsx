import React from 'react';
import axios from 'axios';

class Level extends React.Component {
	constructor(){
		super();
		this.state = {
		}
	}

	componentDidMount(){
		axios.get(`http://localhost:1337/levels/${this.props.levelID}`)
			.then(res => {
				console.log(res)
				this.setState({
					topics: res.data.topics
				});
			})
	}
	render(){
		return (
			<div className="pad">
			    {this.state.topics ?
			    	this.state.topics.map((topic) => 
			    		<div key={this.state.topics.indexOf(topic)} className="flex x-center">
				    		<a href={`/topics/${topic.Topic}`} className="pure-u-1 text-center"><h2>Topic {topic.Topic}</h2></a>
				    		{topic.challenges ?
			    				<ul className="pure-u-1 flex x-space-around">
					    			{topic.challenges.map((challenge) =>
				    					<li key={topic.challenges.indexOf(challenge)}>{challenge.Challenge}</li>
				    				)}
			    				</ul>
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