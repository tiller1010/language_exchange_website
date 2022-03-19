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
						<div className="small-pad no-x">
							<input type="text" name="firstName" placeholder="First Name" aria-label="first name"/>
						</div>
						<div className="small-pad no-x">
							<input type="text" name="lastName" placeholder="Last Name" aria-label="last name"/>
						</div>
						<div className="small-pad no-x">
							<input type="text" name="displayName" placeholder="Display Name" aria-label="display name"/>
						</div>
						<div className="small-pad no-x">
							<input type="password" name="password" placeholder="Password" aria-label="password"/>
						</div>
						<div className="small-pad no-x">
							<input type="password" name="confirmPassword" placeholder="Confirm Password" aria-label="confirm password"/>
						</div>
						<div className="small-pad no-x">
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
			</div>
		);
	}
}

export default Register;