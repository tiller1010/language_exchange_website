import * as React from 'react';
// @ts-ignore
import PremiumVideoChatListing from './PremiumVideoChatListing.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
import Slider from 'react-slick';
const languages = require('language-list')();

interface PremiumVideoChatListingObject {
	topic: string;
	language: string
	thumbnailSrc: string
	userID: string
	timeSlots: [VideoChatTimeSlot?]
}

interface VideoChatTimeSlot {
	customerUserID?: string
	time: string
	booked?: boolean
	completed?: boolean
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
			premiumVideoChatListings: [],
		}
		this.state = state;
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
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
					timeSlots {
						date
						time
						customerUserID
						completed
						booked
					}
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
					timeSlots {
						date
						time
						customerUserID
						completed
						booked
					}
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

	render(){

		const { authenticatedUserID } = this.props;

		let {
			premiumVideoChatListings,
			topic,
			language
		} = this.state;

		return(
			<div>
				<form className="pure-u-1 pure-u-md-1-2 fw-form">
					<h2>Premium video chats</h2>
					<div className="field text">
						<label htmlFor="topicField">Topic</label>
						<input type="text" name="topic" id="topicField" value={topic} onChange={(event) => this.setState({topic: event.target.value})} className="pure-input-rounded"/>
					</div>
					<div className="field dropdown">
						<label htmlFor="languageField">Language</label>
						<select name="language" id="languageField" onChange={(event) => this.setState({language: event.target.value})} className="pure-input-rounded" defaultValue={language}>
							<option value="">Select a language</option>
							<option>ASL</option>
							{languages.getLanguageCodes().map((langCode) => 
								<option key={langCode}>{languages.getLanguageName(langCode)}</option>
							)}
						</select>
					</div>
					<div>
						<button className="button" onClick={this.handleSearchSubmit}>
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
								<PremiumVideoChatListing premiumVideoChatListing={listing} authenticatedUserID={authenticatedUserID} view={authenticatedUserID == listing.userID ? 'owner' : 'customer'}/>
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