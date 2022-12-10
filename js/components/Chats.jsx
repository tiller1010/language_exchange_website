import React from 'react';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.tsx';
import Navigation from './Navigation.jsx';
import decipher from '../decipher.js';

class Chats extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount() {

		const myDecipher = decipher(process.env.PROP_SALT);

		let newState = {};
		if (this.props.isLive) {
			let encryptedProps = myDecipher(this.props.p);
			encryptedProps = JSON.parse(encryptedProps);
			newState = {
				authenticatedUserID: encryptedProps.authenticatedUserID,
			}
		} else {
			newState = {
				authenticatedUserID: this.props.authenticatedUserID,
			}
		}
		this.setState(newState)
	}

	render(){

		return (
			<div className="frame fw-container">
				<Navigation/>
				<div className="pure-u-g">

					<div className="desktop-100">
						<PremiumVideoChatListingFeed authenticatedUserID={this.state.authenticatedUserID} SearchFormHeading="Chats with native speakers"/>
					</div>

			    </div>
			</div>
		);
	}
}

export default Chats;