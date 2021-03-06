import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome, faPlay, faUser } from '@fortawesome/free-solid-svg-icons';
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
		if(this.props.userGoogleID){
			this.findUser(this.props.userGoogleID);
		}
	}

	async findUser(googleID){
		const user = await fetch(`${document.location.origin}/user.json/${googleID}`).then((res) => res.json());
		this.setState({user});
	}

	render(){
		return (
			<div class="frame">
				<Navigation/>
				<h1>Welcome, {this.state.user.firstName}</h1>
				<a href="/logout">Logout</a>
			</div>
		);
	}
}

export default AccountProfile;