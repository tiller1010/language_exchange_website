import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Navigation from './Navigation.jsx';

class Login extends React.Component {
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
		const urlParams = new URLSearchParams(window.location.search);
		const backURL = urlParams.get('backURL');

		return (
			<div className="frame fw-container">
				<Navigation/>

				<div className="page-form">
					<h1>Login</h1>

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
					
					<form action="/login" method="POST" className="flex-col x-end fw-form">
						<div className="field text small-pad no-x">
							<label htmlFor="displayNameField">Display Name</label>
							<input type="text" name="displayName" id="displayNameField" aria-label="display name"/>
						</div>
						<div className="field text small-pad no-x">
							<label htmlFor="passwordField">Password</label>
							<input type="password" name="password" id="passwordField" aria-label="password"/>
						</div>

						{backURL ?
							<input type="hidden" name="backURL" value={backURL}/>
							:
							''
						}

						<div className="small-pad no-x">
							<button className="button" type="submit">
								Login
								<FontAwesomeIcon icon={faLongArrowAltRight}/>
							</button>
						</div>
					</form>

				    <a href="/register" className="button">
					    Register
					    <FontAwesomeIcon icon={faLongArrowAltRight}/>
				    </a>
				    <a href={`/auth/google?backURL=${backURL}`} className="button">
					    Login with Google
					    <FontAwesomeIcon icon={faGoogle}/>
				    </a>
				</div>
			</div>
		);
	}
}

export default Login;