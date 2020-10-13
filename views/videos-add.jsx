import React from 'react';

class VideosAdd extends React.Component {
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
				<h1>Video Add</h1>
				<form action="/videos" method="POST">
					<input type="text" name="title"/>
					<input type="submit" value="Submit"/>
				</form>
			</div>
		);
	}
}

export default VideosAdd;
