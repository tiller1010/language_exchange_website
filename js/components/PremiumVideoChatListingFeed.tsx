import * as React from 'react';
// @ts-ignore
import PremiumVideoChatListing from './PremiumVideoChatListing.tsx';
import graphQLFetch from '../graphQLFetch.js';
import Slider from 'react-slick';

interface PremiumVideoChatListingObject {
	topic: string;
	language: string
	thumbnailSrc: string
	userID: string
}

interface PremiumVideoChatListingFeedState {
	premiumVideoChatListings?: [PremiumVideoChatListingObject?]
}

interface PremiumVideoChatListingFeedProps {
	initialPremiumVideoChatListings?: [PremiumVideoChatListingObject?]
}

export default class PremiumVideoChatListingFeed extends React.Component<PremiumVideoChatListingFeedProps, PremiumVideoChatListingFeedState>{
	constructor(props: PremiumVideoChatListingFeedProps){
		super(props);
		let state: PremiumVideoChatListingFeedState = {
			premiumVideoChatListings: []
		}
		this.state = state;
	}

	async componentDidMount(){
		const query = `query getRecentPremiumVideoChatListings{
			getRecentPremiumVideoChatListings{
				listings {
					topic
					language
					thumbnailSrc
					userID
				}
			}
		}`;
		const data = await graphQLFetch(query);
		if(data.getRecentPremiumVideoChatListings){
			if(data.getRecentPremiumVideoChatListings.listings){
				this.setState({
					premiumVideoChatListings: data.getRecentPremiumVideoChatListings.listings
				});
			}
		}
	}

	render(){

		let { premiumVideoChatListings } = this.state;

		return(
			<div>
				<h2>Premium video chats</h2>
				{premiumVideoChatListings ?
		    		<Slider {...{
						dots: false,
						infinite: false,
						speed: 500,
						slidesToShow: 3,
						slidesToScroll: 1,
						responsive: [
							{
								breakpoint: 1024,
								settings: {
									slidesToShow: 1.5
								}
							}
						]
		    		}}>
						{premiumVideoChatListings.map((listing) =>
							<div key={premiumVideoChatListings.indexOf(listing)}>
								<PremiumVideoChatListing premiumVideoChatListing={listing}/>
							</div>
						)}
					</Slider>
					:
					''
				}
			</div>
		);
	}
}