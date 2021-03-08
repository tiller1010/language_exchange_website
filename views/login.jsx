import React from 'react';
import DefaultLayout from './layouts/default';

class Login extends React.Component {

	render(){

		return (
			<DefaultLayout>
			    <div id="login" errors={JSON.stringify(this.props.errors)}></div>
			</DefaultLayout>
		);
	}
}

export default Login;
