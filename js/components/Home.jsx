import React from 'react';
import axios from 'axios';

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
		}
	}

	componentDidMount(){
		axios.get('http://localhost:1337/collecs')
			.then(response => {
			  // console.log(response);
			  if(response.data[0].media){
			  	console.log(`http://localhost:1337${response.data[0].media.url}`);
			  	this.setState({
			  		strapiTestImage: `http://localhost:1337${response.data[0].media.url}`
			  	});
			  }
			});

		axios.get('http://localhost:1337/levels')
			.then(res => {
				console.log(res)
				this.setState({
					levels: res.data
				});
			})
	}

			    // <h2>Strapi Test:</h2>
			    // <img src={strapiTestImage}/>
	render(){
		var { strapiTestImage } = this.state || 'notfound';
		return (
			<div>
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
			    		<div key={this.state.levels.indexOf(level)}>
				    		<a href={level.Level}><h2>Level {level.Level}</h2></a>
				    		{level.topics ?
				    			level.topics.map((topic) =>
				    				<ul key={level.topics.indexOf(topic)}>
				    					<li>{topic.Topic}</li>
				    				</ul>
			    				)
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