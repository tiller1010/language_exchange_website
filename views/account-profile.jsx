import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class AccountProfile extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver={this.props.pathResolver || ''} isLive={this.props.isLive}>
			    <div id="account-profile"
				    userid={this.props.userID}
				    authenticateduserid={this.props.authenticatedUserID}
				    iscurrentuser={String(this.props.isCurrentUser)}
				    stripeaccountpending={String(this.props.stripeAccountPending)}
				    pathresolver={this.props.pathResolver || ''}
				    p={this.props.p}>
					<SSRView/>
			    </div>
			</DefaultLayout>
		);
	}
}

export default AccountProfile;
