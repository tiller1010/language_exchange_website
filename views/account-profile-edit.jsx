import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class AccountProfileEdit extends React.Component {

	render(){

		return (
			<DefaultLayout pathResolver={this.props.pathResolver || ''}  isLive={this.props.isLive}>
			    <div id="account-profile-edit"
				    userid={this.props.userID}
				    pathresolver={this.props.pathResolver || ''}
				    p={this.props.p}>
					<SSRView/>
			    </div>
			</DefaultLayout>
		);
	}
}

export default AccountProfileEdit;
