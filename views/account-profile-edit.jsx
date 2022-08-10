import React from 'react';
import DefaultLayout from './layouts/default';

class AccountProfile extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver={this.props.pathResolver || ''}>
			    <div id="account-profile-edit"
				    userid={this.props.userID}
				    pathresolver={this.props.pathResolver || ''}>
			    </div>
			</DefaultLayout>
		);
	}
}

export default AccountProfile;
