import * as React from 'react';
// @ts-ignore
import PremiumVideoChatListing from './PremiumVideoChatListing.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
import Slider from 'react-slick';
// @ts-ignore
import LanguageSelector from './LanguageSelector.tsx';

interface PremiumVideoChatListingObject {
	topic: string;
	languageOfTopic: string;
	thumbnailSrc: string;
	userID: string;
	timeSlots: [VideoChatTimeSlot?];
}

interface VideoChatTimeSlot {
	customerUserID?: string;
	time: string;
	booked?: boolean;
	completed?: boolean;
}

interface PremiumVideoChatListingFeedState {
	topic: string;
	languageOfTopic: string;
	premiumVideoChatListings?: [PremiumVideoChatListingObject?];
	loaded: boolean;
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
			languageOfTopic: '',
			premiumVideoChatListings: [],
			loaded: false,
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
					languageOfTopic
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
					premiumVideoChatListings: data.getRecentPremiumVideoChatListings.listings,
					loaded: true,
				});
			}
		}
	}

	async handleSearchSubmit(event){

		event.preventDefault();

		const {
			topic,
			languageOfTopic
		} = this.state;

		const query = `query searchPremiumVideoChatListings($topic: String, $languageOfTopic: String){
			searchPremiumVideoChatListings(topic: $topic, languageOfTopic: $languageOfTopic){
				listings {
					_id
					topic
					languageOfTopic
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
			languageOfTopic,
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
			languageOfTopic,
			loaded,
		} = this.state;

		return(
			<section>
				<div className="page-form" style={{ marginBottom: '60px' }}>
					<h2>Practice with a native speaker</h2>
					<form className="fw-form search-form">
						<div className="flex-container flex-vertical-stretch">
							<div className="field text">
								<label htmlFor="topicField">Topic</label>
								<input type="text" name="topic" id="topicField" value={topic} onChange={(event) => this.setState({topic: event.target.value})}/>
							</div>
							<div className="flex-container tablet-100" style={{ flexWrap: 'nowrap' }}>
								<LanguageSelector name="languageOfTopic" id="videoChat_languageOfTopicField" onChange={(event) => this.setState({ languageOfTopic: event.target.value })} value={languageOfTopic} required={false}/>
								<button value="Search" className="button tablet-20" onClick={this.handleSearchSubmit}>
									Search
									<FontAwesomeIcon icon={faSearch}/>
								</button>
							</div>
						</div>
					</form>
				</div>
				{premiumVideoChatListings.length ?
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
					<>{loaded ? <p>No videos</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
				}
			</section>
		);
	}
}