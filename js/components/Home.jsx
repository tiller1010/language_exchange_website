import React from 'react';
import axios from 'axios';

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
		}
	}

	componentDidMount(){

		axios.get('http://localhost:1337/levels')
			.then(res => {
				console.log(res)
				this.setState({
					levels: res.data
				});
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
			<div className="pad">
				<h1>Video Submissions</h1>
				<form action="/videos" method="GET">
					<label htmlFor="keywords">Search Terms</label>
					<input type="text" name="keywords"/>
					<input type="submit" value="Search"/>
				</form>
			    <a href="/videos">View all videos</a>

			    <hr/>

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<div key={this.state.levels.indexOf(level)} className="flex x-center">
				    		<a href={`/level/${level.id}`} className="pure-u-1 text-center"><h2>Level {level.Level}</h2></a>
				    		{level.topics ?
				    			<div className="topics pure-u-1 flex x-space-around">
					    			{this.randomTopics(level).map((topic) =>
				    					<a key={level.topics.indexOf(topic)} href={`/level/${level.id}/topics/${topic.id}`} className="topic pure-u-1 pure-u-lg-1-2">
						    					<h3 className="text-center">{topic.Topic}</h3>
						    					{this.renderMedia(topic)}
				    					</a>
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

export default Home;