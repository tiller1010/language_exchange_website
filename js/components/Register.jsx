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
			<div className="frame fw-container">
				<Navigation/>

				<div className="page-form">
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

					<form action="/register" method="POST" className="flex-col x-end fw-form">
						<div className="field text">
							<label htmlFor="firstNameField">First Name</label>
							<input type="text" id="firstNameField" name="firstName" aria-label="first name"/>
						</div>
						<div className="field text">
							<label htmlFor="lastNameField">Last Name</label>
							<input type="text" id="lastNameField" name="lastName" aria-label="last name"/>
						</div>
						<div className="field text">
							<label htmlFor="emailField">Email</label>
							<input type="email" id="emailField" name="email" aria-label="Email"/>
						</div>
						<div className="field text">
							<label htmlFor="displayNameField">Display Name</label>
							<input type="text" id="displayNameField" name="displayName" aria-label="display name"/>
						</div>
						<div className="field text">
							<label htmlFor="passwordField">Password</label>
							<input type="password" id="passwordField" name="password" aria-label="password"/>
						</div>
						<div className="field text">
							<label htmlFor="confirmPasswordField">Confirm Password</label>
							<input type="password" id="confirmPasswordField" name="confirmPassword" aria-label="confirm password"/>
						</div>
						<div className="field text">
							<button className="button" type="submit">
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
			</div>
		);
	}
}

export default Register;