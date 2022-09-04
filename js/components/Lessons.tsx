import * as React from 'react';
import LessonsFeed from './LessonsFeed.tsx';
import Navigation from './Navigation.jsx';

class Lessons extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
	}

	render(){

		return (
			<div className="frame fw-container">
				<Navigation/>
				<div className="pure-u-g">

					<div className="desktop-100">
						<LessonsFeed SearchFormHeading="Free lessons and challenges"/>
					</div>

			    </div>
			</div>
		);
	}
}

export default Lessons;