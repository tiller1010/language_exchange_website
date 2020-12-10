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

	render(){
		var { strapiTestImage } = this.state || 'notfound';
		return (
			<div className="pad">
				<h1>One Word Video App</h1>
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
			    				<ul className="pure-u-1 flex x-space-around">
					    			{level.topics.map((topic) =>
				    					<li key={level.topics.indexOf(topic)}>{topic.Topic}</li>
				    				)}
			    				</ul>
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