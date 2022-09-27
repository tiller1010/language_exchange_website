import * as React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLongArrowAltRight, faClock, faFlag } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';

interface PremiumVideoChatListingObject {
	_id: string
	topic: string;
	languageOfTopic: string
	duration: string
	price: number
	currency: string
	thumbnailSrc: string
	userID: string
	timeSlots: VideoChatTimeSlot[]
}

interface VideoChatTimeSlot {
	shouldAddProductID?: boolean
	customerDisplayName?: string
	customerUserID?: string
	tempCustomerUserID?: string
	date: string
	time: string
	booked?: boolean
	completed?: boolean
}

interface PremiumVideoChatListingState {
	timeSlots: VideoChatTimeSlot[]
}

interface PremiumVideoChatListingProps {
	premiumVideoChatListing: PremiumVideoChatListingObject
	authenticatedUserID?: string
	view: string
}

export default class PremiumVideoChatListing extends React.Component<PremiumVideoChatListingProps, PremiumVideoChatListingState>{
	constructor(props: PremiumVideoChatListingProps){
		super(props);
		let state: PremiumVideoChatListingState = {
			timeSlots: [],
		}
		this.state = state;
		this.handleTimeSlotChange = this.handleTimeSlotChange.bind(this);
		this.getUserNameByID = this.getUserNameByID.bind(this);
		this.renderTimeSlots = this.renderTimeSlots.bind(this);
		this.handleBuyNow = this.handleBuyNow.bind(this);
	}

	async componentWillMount(){
		let propTimeSlots = this.props.premiumVideoChatListing.timeSlots;
		let newTimeSlots = [];
		for(let timeSlot of propTimeSlots){
			let newTimeSlot = { ...timeSlot };
			let customerDisplayName = '';
			if(timeSlot.customerUserID){
				customerDisplayName = await this.getUserNameByID(timeSlot.customerUserID);
			}
			newTimeSlot.customerDisplayName = customerDisplayName;
			newTimeSlots.push(newTimeSlot);
		}
		this.setState({
			timeSlots: newTimeSlots,
		});
	}

	async componentWillReceiveProps(nextProps){
		if(this.state.timeSlots != nextProps.premiumVideoChatListing.timeSlots){
			let stateTimeSlots = this.state.timeSlots;
			let propTimeSlots = nextProps.premiumVideoChatListing.timeSlots;
			let newTimeSlots = [];
			for(let timeSlot of propTimeSlots){
				let newTimeSlot = {
					...timeSlot,
					booked: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].booked : timeSlot.booked,
					completed: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].completed : timeSlot.completed,
				};
				let customerDisplayName = '';
				if(timeSlot.customerUserID){
					customerDisplayName = await this.getUserNameByID(timeSlot.customerUserID);
				}
				newTimeSlot.customerDisplayName = customerDisplayName;
				newTimeSlots.push(newTimeSlot);
			}
			await this.setState({
				timeSlots: newTimeSlots,
			});
		}
	}

	async handleTimeSlotChange(checked, timeSlotIndex){

		const { authenticatedUserID } = this.props;

		if(authenticatedUserID){
			let { timeSlots } = this.state;
			let timeSlot = timeSlots[timeSlotIndex];
			let query : string = '';
			if(this.props.view == 'owner'){
				timeSlot.completed = checked;
				query = `mutation updatePremiumVideoChatListing($listingID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){
					updatePremiumVideoChatListing(listingID: $listingID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){
						timeSlots {
							completed
						}
					}
				}`;
			} else {
				timeSlot.booked = checked;
				timeSlot.tempCustomerUserID = checked ? authenticatedUserID : null;
			}
			timeSlots[timeSlotIndex] = timeSlot;

			this.setState({
				timeSlots
			});

			if(query){
				// Format timeSlots as VideoChatTimeSlotInputs
				let graphql_timeSlots = [];
				timeSlots.forEach((timeSlotData) => {
					graphql_timeSlots.push({
						customerUserID: timeSlotData.customerUserID,
						date: timeSlotData.date,
						time: timeSlotData.time,
						booked: timeSlotData.booked,
						completed: timeSlotData.completed,
					});
				});
				const data = await graphQLFetch(query, {
					listingID: this.props.premiumVideoChatListing._id,
					premiumVideoChatListing: {
						timeSlots: graphql_timeSlots
					}
				}, false);
			}

		} else {
			alert('Must be signed in to buy.');
		}
	}

	async getUserNameByID(userID){
		const user = await fetch(`/user/${userID}`)
			.then((response) => response.json());
		return user.displayName;
	}

	renderTimeSlots(){

		let { timeSlots } = this.state;

		switch(this.props.view){
			case 'owner':
			return timeSlots.map((timeSlot) => 
				<div key={timeSlots.indexOf(timeSlot)} style={{ margin: '10px 0', borderBottom: '1px dotted black' }}>
					{timeSlot.customerUserID ? 
						<div>
							<p><b>Video Chat with: {timeSlot.customerDisplayName}</b></p>
							<p><b>{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</b></p>
							<a className="button" href={`/video-chat?forUserID=${timeSlot.customerUserID}`}>
								Go to Video Chat
								<FontAwesomeIcon icon={faLongArrowAltRight}/>
							</a>
							<div className="field checkbox" style={{ whiteSpace: 'nowrap' }}>
								{/* @ts-ignore */}
								<input id={`timeSlot${timeSlots.indexOf(timeSlot)}`} type="checkbox" checked={timeSlot.completed} onClick={(e) => this.handleTimeSlotChange(e.target.checked, timeSlots.indexOf(timeSlot))}/>
								{/* @ts-ignore */}
								<label htmlFor={`timeSlot${timeSlots.indexOf(timeSlot)}`}>Mark Completed</label>
							</div>
						</div>
						:
						<>
							{/* @ts-ignore */}
							<div style={{ margin: '10px 0', minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}>
								<b>Available</b><span>&nbsp;{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</span>
							</div>
						</>
					}
				</div>
			);
			case 'customer':
			return timeSlots.map((timeSlot) => 
				<div key={timeSlots.indexOf(timeSlot)}>
					{timeSlot.customerUserID ?
						''
						:
						<div className="field checkbox" style={{ whiteSpace: 'nowrap' }}>
							{/* @ts-ignore */}
							<input id={`timeSlot${timeSlots.indexOf(timeSlot)}`} type="checkbox" checked={timeSlot.booked} onClick={(e) => this.handleTimeSlotChange(e.target.checked,  timeSlots.indexOf(timeSlot))}/>
							{/* @ts-ignore */}
							<label htmlFor={`timeSlot${timeSlots.indexOf(timeSlot)}`}>{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</label>
						</div>
					}
				</div>
			);
		}
	}

	async handleBuyNow(){

		const { premiumVideoChatListing, authenticatedUserID } = this.props;
		const { timeSlots } = this.state;

		if(authenticatedUserID){
			const query = `mutation createProduct($productObjectCollection: String!, $productDescription: String!, $productObjectID: ID!, $userID: ID!, $productObjectUpdateData: String!){
				createProduct(productObjectCollection: $productObjectCollection, productDescription: $productDescription, productObjectID: $productObjectID, userID: $userID, productObjectUpdateData: $productObjectUpdateData){
					_id
					userID
					cost
					currency
					orderedOn
					productObject {
						... on PremiumVideoChatListing{
							_id
							userID
							topic
							languageOfTopic
							duration
							thumbnailSrc
							price
							currency
						}
					}
					priceID
				}
			}`;
			let newTimeSlots = [];
			timeSlots.forEach((timeSlot) => {
				let newTimeSlot = {
					date: timeSlot.date,
					time: timeSlot.time,
					customerUserID: timeSlot.customerUserID,
					booked: timeSlot.booked,
					completed: timeSlot.completed,
					shouldAddProductID: false,
				}
				if(timeSlot.tempCustomerUserID){
					newTimeSlot.shouldAddProductID = true;
					newTimeSlot.customerUserID = timeSlot.tempCustomerUserID;
				}
				newTimeSlots.push(newTimeSlot);
			});
			const data = await graphQLFetch(query, {
				productObjectCollection: 'premium_video_chat_listings',
				productDescription: 'Premium Video Chat',
				productObjectID: premiumVideoChatListing._id,
				userID: authenticatedUserID,
				productObjectUpdateData: JSON.stringify({
					timeSlots: newTimeSlots,
				})
			});
			if(data.createProduct){
				if(data.createProduct.priceID && premiumVideoChatListing.userID){

					// Get the user that made the product
					const productUser = await fetch(`/user/${premiumVideoChatListing.userID}`)
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
			topic,
			languageOfTopic,
			duration,
			price,
			currency,
			thumbnailSrc,
		} = this.props.premiumVideoChatListing;

		return(
			<div>
				<div className="fw-typography-spacing">
					<h4>{topic}</h4>
					<p><b><FontAwesomeIcon icon={faFlag}/>&nbsp;{languageOfTopic}</b></p>
					<p><b><FontAwesomeIcon icon={faClock}/>&nbsp;{duration}</b></p>
					<p><b>{price}&nbsp;{currency}</b></p>
				</div>
				<div className="thumbnail-preview img-container">
					<img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={thumbnailSrc} alt={thumbnailSrc}/>
				</div>

				<h4 style={{ margin: '35px 0 10px 0', fontSize: '1.5em' }}>Timeslots</h4>
				<div className="fw-form" style={{ maxHeight: '250px', overflowY: 'auto' }}>
					{this.renderTimeSlots()}
				</div>

				{/* Only Show Buy button if customer selected timeslots */}
				{this.props.view == 'customer' && this.state.timeSlots.filter(timeSlot => timeSlot.tempCustomerUserID).length ?
					<button className="button" onClick={() => this.handleBuyNow()}>
						Buy Now
						<FontAwesomeIcon icon={faPlus}/>
					</button>
					:
					''
				}

			</div>
		);
	}
}