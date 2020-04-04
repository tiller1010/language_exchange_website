import React from 'react';
import ReactDOM from 'react-dom';

const Hello = (props) => {
	return (
		<div>
			<h1>Hello World</h1>
		</div>
	);
}

ReactDOM.render(<Hello/>, document.getElementById('app'));
