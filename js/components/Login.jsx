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
		return (
			<div className="frame">
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
					
					<form action="/login" method="POST" className="flex-col x-end">
						<div className="small-pad no-x">
							<input type="text" name="displayName" placeholder="Display Name" aria-label="display name"/>
						</div>
						<div className="small-pad no-x">
							<input type="password" name="password" placeholder="Password" aria-label="password"/>
						</div>
						<div className="small-pad no-x">
							<button type="submit">
								Login
								<FontAwesomeIcon icon={faLongArrowAltRight}/>
							</button>
						</div>
					</form>
				    <a href="/register" className="button">
					    Register
					    <FontAwesomeIcon icon={faLongArrowAltRight}/>
				    </a>
				    <a href="/auth/google" className="button">
					    Login with Google
					    <FontAwesomeIcon icon={faGoogle}/>
				    </a>
				</div>
			</div>
		);
	}
}

export default Login;