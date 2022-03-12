import React from 'react';
import DefaultLayout from './layouts/default';

class AccountProfile extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver={this.props.pathResolver || ''}>
			    <div id="account-profile"
				    userid={this.props.userID}
				    authenticateduserid={this.props.authenticatedUserID}
				    iscurrentuser={String(this.props.isCurrentUser)}
				    pathresolver={this.props.pathResolver || ''}>
			    </div>
			</DefaultLayout>
		);
	}
}

export default AccountProfile;
