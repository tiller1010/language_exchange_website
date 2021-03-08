import React from 'react';
import DefaultLayout from './layouts/default';

class Register extends React.Component {

	render(){

		return (
			<DefaultLayout>
			    <div id="register" errors={JSON.stringify(this.props.errors)}></div>
			</DefaultLayout>
		);
	}
}

export default Register;
