import * as React from 'react';

interface User {
	_id: string;
	displayName: string
}

interface PremiumVideoChatListingObject {
	topic: string;
	language: string
	thumbnailSrc: string
	user: User
}

interface PremiumVideoChatListingState {
}

interface PremiumVideoChatListingProps {
	premiumVideoChatListing: PremiumVideoChatListingObject
}

export default class PremiumVideoChatListing extends React.Component<PremiumVideoChatListingProps, PremiumVideoChatListingState>{
	constructor(props: PremiumVideoChatListingProps){
		super(props);
		let state: PremiumVideoChatListingState = {
		}
		this.state = state;
	}

	render(){

		let {
			topic,
			language,
			thumbnailSrc
		} = this.props.premiumVideoChatListing;

		return(
			<div>
				<p>{topic}</p>
				<p>{language}</p>
				<img src={thumbnailSrc} alt={thumbnailSrc}/>
			</div>
		);
	}
}