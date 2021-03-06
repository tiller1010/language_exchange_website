import React from 'react';
import DefaultLayout from './layouts/default';

class Login extends React.Component {

	render(){

		return (
			<DefaultLayout>
				<h1>Login placeholder</h1>
			    <div id="login"></div>
			    <a href="/auth/google">Login with Google</a>
			</DefaultLayout>
		);
	}
}

export default Login;
