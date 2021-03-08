import React from 'react';
import DefaultLayout from './layouts/default';

class AccountProfile extends React.Component {

	render(){

		return (
			<DefaultLayout>
			    <div id="account-profile" identifier={this.props.user.googleID || this.props.user.displayName}></div>
			</DefaultLayout>
		);
	}
}

export default AccountProfile;
