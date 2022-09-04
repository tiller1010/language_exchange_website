import React from 'react';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.tsx';
import Navigation from './Navigation.jsx';

class Chats extends React.Component {
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
						<PremiumVideoChatListingFeed authenticatedUserID={this.props.authenticatedUserID} SearchFormHeading="Practice with a native speaker"/>
					</div>

			    </div>
			</div>
		);
	}
}

export default Chats;