import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
	constructor(){
		super();
		this.state = {
			videos: []
		}
		this.testFunc = this.testFunc.bind(this);
	}

	testFunc(){
		this.setState({
			videos: [{title: 'test2'}]
		})
	}
	render(){
		return (
			<div>
				<h1>Hello World</h1>
				<p>{JSON.stringify(this.state.videos)}</p>
				<button onClick={this.testFunc}>click</button>
			</div>
		);
	}
}

ReactDOM.render(<Hello/>, document.getElementById('app'));