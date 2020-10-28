import React from 'react';

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
		}
	}

	componentDidMount(){
	}

	render(){

		return (
			<div>
				<h1>One Word Video App</h1>
				<form action="/videos" method="GET">
					<label htmlFor="keywords">Search Terms</label>
					<input type="text" name="keywords"/>
					<input type="submit" value="Search"/>
				</form>
			    <a href="/videos">View all videos</a>
			</div>
		);
	}
}

export default Home;