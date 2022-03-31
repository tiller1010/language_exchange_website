import React from 'react';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.tsx';
import Navigation from './Navigation.jsx';

class Chats extends React.Component {
	constructor(){
		super();
		this.state = {
		}
	}

	componentDidMount(){
	}

	render(){

		return (
			<div className="frame">
				<Navigation/>
				<div className="pure-u-g">

					<div className="pure-u-l pure-u-md-1-2">
						<PremiumVideoChatListingFeed authenticatedUserID={this.props.userID}/>
					</div>

			    </div>
			</div>
		);
	}
}

export default Chats;