import * as React from 'react';

interface User {
	_id: string;
	displayName: string
}

interface PremiumVideoChatListingObject {
	topic: string;
	language: string
	thumbnailSrc: string
	userID: string
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
				<div className="thumbnail-preview img-container">
					<img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={thumbnailSrc} alt={thumbnailSrc}/>
				</div>
			</div>
		);
	}
}