import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Navigation from './Navigation.jsx';

class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errors: []
		}
	}

	componentDidMount(){
		if(this.props.errors){
			this.setState({
				errors: JSON.parse(this.props.errors)
			});
		}
	}

	render(){
		return (
			<div className="frame">
				<Navigation/>

				<h1>Register</h1>

				{this.state.errors.length ?
					<ul className="errors">
						{this.state.errors.map((error) =>
							<li key={this.state.errors.indexOf(error)}>
								{error}
							</li>
						)}
					</ul>
					:
					''
				}

				<form action="/register" method="POST">
					<div>
						<label htmlFor="firstName">First Name</label>
						<input type="text" name="firstName"/>
					</div>
					<div>
						<label htmlFor="lastName">Last Name</label>
						<input type="text" name="lastName"/>
					</div>
					<div>
						<label htmlFor="displayName">Display Name</label>
						<input type="text" name="displayName"/>
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input type="password" name="password"/>
					</div>
					<div>
						<button type="submit">
							Register
							<FontAwesomeIcon icon={faLongArrowAltRight}/>
						</button>
					</div>
				</form>
			    <a href="/auth/google" className="button">
				    Register with Google
				    <FontAwesomeIcon icon={faGoogle}/>
			    </a>
			</div>
		);
	}
}

export default Register;