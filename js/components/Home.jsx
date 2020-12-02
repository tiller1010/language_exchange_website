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
			  console.log(response);
			  if(response.data[0].media){
			  	console.log(`http://localhost:1337${response.data[0].media.url}`);
			  	this.setState({
			  		strapiTestImage: `http://localhost:1337${response.data[0].media.url}`
			  	});
			  }
			});
	}

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
			    <h2>Strapi Test:</h2>
			    <img src={strapiTestImage}/>
			</div>
		);
	}
}

export default Home;