import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class Register extends React.Component {

	render(){

		return (
			<DefaultLayout>
			    <div id="register" errors={JSON.stringify(this.props.errors)}>
					<SSRView/>
			    </div>
			</DefaultLayout>
		);
	}
}

export default Register;
