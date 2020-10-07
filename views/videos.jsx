import React from 'react';

class Videos extends React.Component {
	constructor(){
		super();
		this.state = {
			items: []
		}
	}

	componentDidMount(){
	}

	render(){

		return (
			<div>
				<h1>Videos</h1>
				{/*<p>{JSON.stringify(this.props.items)}</p>*/}
				<ul>
					{this.props.items.map((item) => 
						<li key={this.props.items.indexOf(item)}>{item.title}</li>
					)}
				</ul>
			</div>
		);
	}
}

export default Videos;
