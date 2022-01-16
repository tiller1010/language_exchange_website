import * as React from 'react';
// @ts-ignore
import PremiumVideoChatListing from './PremiumVideoChatListing.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
import Slider from 'react-slick';
const languages = require('language-list')();
import { loadStripe } from '@stripe/stripe-js';

interface PremiumVideoChatListingObject {
	topic: string;
	language: string
	thumbnailSrc: string
	userID: string
}

interface PremiumVideoChatListingFeedState {
	topic: string;
	language: string
	premiumVideoChatListings?: [PremiumVideoChatListingObject?]
}

interface PremiumVideoChatListingFeedProps {
	initialPremiumVideoChatListings?: [PremiumVideoChatListingObject?]
	authenticatedUserID?: string
}

export default class PremiumVideoChatListingFeed extends React.Component<PremiumVideoChatListingFeedProps, PremiumVideoChatListingFeedState>{
	constructor(props: PremiumVideoChatListingFeedProps){
		super(props);
		let state: PremiumVideoChatListingFeedState = {
			topic: '',
			language: '',
			premiumVideoChatListings: []
		}
		this.state = state;
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.handleBuyNow = this.handleBuyNow.bind(this);
	}

	async componentDidMount(){
		const query = `query getRecentPremiumVideoChatListings{
			getRecentPremiumVideoChatListings{
				listings {
					_id
					topic
					language
					duration
					price
					currency
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

	async handleSearchSubmit(event){

		event.preventDefault();

		const {
			topic,
			language
		} = this.state;

		const query = `query searchPremiumVideoChatListings($topic: String, $language: String){
			searchPremiumVideoChatListings(topic: $topic, language: $language){
				listings {
					_id
					topic
					language
					duration
					price
					currency
					thumbnailSrc
					userID
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			topic,
			language,
		});
		if(data.searchPremiumVideoChatListings){
			if(data.searchPremiumVideoChatListings.listings){
				this.setState({
					premiumVideoChatListings: data.searchPremiumVideoChatListings.listings
				});
			}
		}
	}

	async handleBuyNow(listing){

		const { authenticatedUserID } = this.props;

		if(authenticatedUserID){
			const query = `mutation createProduct($productObjectCollection: String!, $productDescription: String!, $productObjectID: ID!, $userID: ID!){
				createProduct(productObjectCollection: $productObjectCollection, productDescription: $productDescription, productObjectID: $productObjectID, userID: $userID){
					userID
					cost
					currency
					orderedOn
					productObject {
						... on PremiumVideoChatListing{
							_id
							userID
							topic
							language
							duration
							thumbnailSrc
							price
							currency
						}
					}
					priceID
				}
			}`;
			const data = await graphQLFetch(query, {
				productObjectCollection: 'premium_video_chat_listings',
				productDescription: 'Premium Video Chat',
				productObjectID: listing._id,
				userID: authenticatedUserID,
			});
			if(data.createProduct){
				if(data.createProduct.priceID && listing.userID){

					// Get the user that made the product
					const productUser = await fetch(`/user/${listing.userID}`)
						.then((response) => response.json());

					if(productUser.connectedStripeAccountID){

						const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

						fetch('/create-checkout-session', {
						    method: 'POST',
						    headers: { 'Content-Type': 'application/json' },
						    body: JSON.stringify({
						      priceID: data.createProduct.priceID,
						      connectedStripeAccountID: productUser.connectedStripeAccountID,
						    })
						  })
						  .then(function(response) {
						    return response.json();
						  })
						  .then(function(session) {
						    return stripe.redirectToCheckout({ sessionId: session.id });
						  })
						  .then(function(result) {
						    // If `redirectToCheckout` fails due to a browser or network
						    // error, you should display the localized error message to your
						    // customer using `error.message`.
						    if (result.error) {
						      alert(result.error.message);
						    }
						  });
					}

				}
			}
		} else {
			alert('Must be signed in to buy.');
		}
	}

	render(){

		let {
			premiumVideoChatListings,
			topic,
			language
		} = this.state;

		return(
			<div>
				<form className="pure-u-1 pure-u-md-1-2 pure-form pure-form-stacked">
					<h2>Premium video chats</h2>
					<div>
						<label htmlFor="topic">Topic</label>
						<input type="text" name="topic" value={topic} onChange={(event) => this.setState({topic: event.target.value})} className="pure-input-rounded"/>
					</div>
					<div>
						<label htmlFor="language">Language</label>
						<select name="language" onChange={(event) => this.setState({language: event.target.value})} className="pure-input-rounded" defaultValue={language}>
							<option value="">Select a language</option>
							<option>ASL</option>
							{languages.getLanguageCodes().map((langCode) => 
								<option key={langCode}>{languages.getLanguageName(langCode)}</option>
							)}
						</select>
					</div>
					<div>
						<button onClick={this.handleSearchSubmit}>
							Submit
							<FontAwesomeIcon icon={faLongArrowAltRight}/>
						</button>
					</div>
				</form>
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
								<button onClick={() => this.handleBuyNow(listing)}>
									Buy Now
									<FontAwesomeIcon icon={faPlus}/>
								</button>
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