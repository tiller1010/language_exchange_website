import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

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
				<p>Let's enjoy</p>
				<h1>Video Submissions</h1>
				<form action="/videos" method="GET">
					<div className="search-input">
						<input type="text" name="keywords" placeholder="Search video submissions"/>
				        <FontAwesomeIcon icon={faSearch}/>
						<input type="submit" value="Search"/>
					</div>
				</form>
			    <a href="/videos" className="button">
				    View all videos
				    <FontAwesomeIcon icon={faLongArrowAltRight}/>
			    </a>

			    <hr/>

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<div key={this.state.levels.indexOf(level)} className="flex x-center">
				    		<h2 className="pad">Level {level.Level}</h2>
				    		<a href={`/level/${level.id}`} className="button">
					    		View all
					    		<FontAwesomeIcon icon={faLongArrowAltRight}/>
				    		</a>
				    		{level.topics ?
				    			<div className="topics pure-u-1 flex x-space-around">
					    			{this.randomTopics(level).map((topic) =>
					    				<div className="topic pure-u-1 pure-u-md-11-24" key={level.topics.indexOf(topic)}>
						    				<div className="flex x-space-between">
						    					<h3 className="pad no-y no-left">{topic.Topic}</h3>
						    					<a href={`/level/${level.id}/topics/${topic.id}`} className="button">
												    View all
												    <FontAwesomeIcon icon={faLongArrowAltRight}/>
											    </a>
										    </div>
					    					<a href={`/level/${level.id}/topics/${topic.id}`}>
						    					{this.renderMedia(topic)}
					    					</a>
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

export default Home;