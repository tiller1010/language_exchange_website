import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';

class AccountProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: {}
		}
		this.findUser = this.findUser.bind(this);
	}

	componentDidMount(){
		if(this.props.identifier){
			this.findUser(this.props.identifier);
		}
	}

	async findUser(identifier){
		const user = await fetch(`${document.location.origin}/user.json/${identifier}`).then((res) => res.json());
		this.setState({user});
	}

	render(){
		return (
			<div className="frame">
				<Navigation/>
				<h1>Welcome, {this.state.user.firstName}</h1>
				<a href="/logout" className="button">
					Logout
					<FontAwesomeIcon icon={faSignOutAlt}/>
				</a>
			</div>
		);
	}
}

export default AccountProfile;