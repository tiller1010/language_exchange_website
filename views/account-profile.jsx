import React from 'react';
import DefaultLayout from './layouts/default';

class AccountProfile extends React.Component {

	render(){

		return (
			<DefaultLayout>
				<h1>Account placeholder</h1>
			    <div id="account-profile" userGoogleID={this.props.user.googleID}></div>
			</DefaultLayout>
		);
	}
}

export default AccountProfile;
