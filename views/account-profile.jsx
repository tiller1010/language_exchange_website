import React from 'react';
import DefaultLayout from './layouts/default';

class AccountProfile extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver={this.props.pathResolver || ''}>
			    <div id="account-profile"
				    data-user={JSON.stringify(this.props.user)}
				    data-authenticatedUser={JSON.stringify(this.props.authenticatedUser)}
				    data-isCurrentUser={this.props.isCurrentUser}
				    data-pathResolver={this.props.pathResolver || ''}>
			    </div>
			</DefaultLayout>
		);
	}
}

export default AccountProfile;
