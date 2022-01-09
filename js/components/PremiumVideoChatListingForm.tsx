import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLongArrowAltRight, faTrash } from '@fortawesome/free-solid-svg-icons';
const languages = require('language-list')();
import graphQLFetch from '../graphQLFetch.js';
// @ts-ignore
import PremiumVideoChatListing from './PremiumVideoChatListing.tsx';
// @ts-ignore
import RemoveConfirmationModal from './RemoveConfirmationModal.tsx';

interface User {
	_id: string;
	displayName: string
	premiumVideoChatListing?: PremiumVideoChatListingObject
}

interface PremiumVideoChatListingObject {
	_id: string;
	topic: string;
	language: string
	price: number
	currency: string
	thumbnailSrc: string
	userID: string
}

interface PremiumVideoChatListingFormState {
	topic: string;
	language: string
	price: number
	currency: string
	thumbnailSrc: string
	thumbnailFile?: File
	savedPremiumVideoChatListing?: PremiumVideoChatListingObject
}

interface PremiumVideoChatListingFormProps {
	user: User
}

export default class PremiumVideoChatListingForm extends React.Component<PremiumVideoChatListingFormProps, PremiumVideoChatListingFormState>{
	constructor(props: PremiumVideoChatListingFormProps){
		super(props);
		let state: PremiumVideoChatListingFormState = {
			topic: '',
			language: '',
			price: 0,
			currency: 'usd',
			thumbnailSrc: '',
		}
		this.state = state;
		this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDeleteListing = this.handleDeleteListing.bind(this);
	}

	componentDidMount(){
		if(this.props.user.premiumVideoChatListing){
			this.setState({ ...this.props.user.premiumVideoChatListing });
			this.setState({ savedPremiumVideoChatListing: this.props.user.premiumVideoChatListing });
		}
	}


	handleThumbnailChange(event){
		const context = this;
	    const image = event.target.files[0];
	    context.setState({
		    thumbnailFile: image
	    });
	    if(image){
	    	// Set preview
	  		const reader = new FileReader();
			reader.addEventListener('load', function () {
				if(typeof reader.result === 'string'){
					if(/jpeg|jpg|png/.test(reader.result.substr(0, 20))){
						context.setState({thumbnailSrc: reader.result});
					} else {
						alert('Invalid thumbnail format.');
					}
				} else {
					alert('Invalid upload.');
				}

			}, false);
			reader.readAsDataURL(image);
	    }
	}

	async handleSubmit(event){

		event.preventDefault();

		let {
			topic,
			language,
			price,
			currency,
			thumbnailSrc,
			thumbnailFile,
			savedPremiumVideoChatListing
		} = this.state;

		let { user } = this.props;

		if(user && topic && language && thumbnailSrc){
			let query;
			let variables;
			let mutationName;
			if(savedPremiumVideoChatListing){
				// If updating existing
				query = `mutation updatePremiumVideoChatListing($listingID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){
					updatePremiumVideoChatListing(listingID: $listingID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){
						_id
						topic
						language
						price
						currency
						thumbnailSrc
						userID
					}
				}`;
				variables = {
					listingID: savedPremiumVideoChatListing._id,
					premiumVideoChatListing: {
						topic,
						language,
						price,
						currency,
					}
				};
				if(thumbnailFile){
					variables.file = thumbnailFile;
				}
				mutationName = 'updatePremiumVideoChatListing';
			} else {
				// If adding new
				query = `mutation addPremiumVideoChatListing($userID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){
					addPremiumVideoChatListing(userID: $userID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){
						_id
						topic
						language
						price
						currency
						thumbnailSrc
						userID
					}
				}`;
				variables = {
					userID: user._id,
					premiumVideoChatListing: {
						topic,
						language,
						price,
						currency,
					},
					file: thumbnailFile
				};
				mutationName = 'addPremiumVideoChatListing';
			}
			const data = await graphQLFetch(query, variables, thumbnailFile ? true : false);
			this.setState({ savedPremiumVideoChatListing: data[mutationName] });
		}

		// DEBUG UPLOAD
		// const query = `mutation addPremiumVideoChatListingThumbnailTest($file: Upload){
		// 	addPremiumVideoChatListingThumbnailTest(thumbnailFile: $file){
		// 		thumbnailSrc
		// 	}
		// }`;
		// const data = await graphQLFetch(query, {
		// 	file: thumbnailFile
		// }, true);
	}

	async handleDeleteListing(){

		const { user } = this.props;

		// If adding new
		const query = `mutation removePremiumVideoChatListing($userID: ID!){
			removePremiumVideoChatListing(userID: $userID)
		}`;
		const variables = {
			userID: user._id
		};
		const data = await graphQLFetch(query, variables);
		const emptyListingObject = {
			topic: '',
			language: '',
			thumbnailSrc: ''
		}
		this.setState({
			...emptyListingObject,
			savedPremiumVideoChatListing: null
		});
	}

	render(){

		let {
			topic,
			language,
			price,
			currency,
			thumbnailSrc,
			savedPremiumVideoChatListing
		} = this.state;

		let { user } = this.props;

		return(
			<div className="pure-g">
				<h2 className="pure-u-1">Premium video chat listing</h2>
				<form className="pure-u-1 pure-u-md-1-2 pure-form pure-form-stacked">
					<div>
						<label htmlFor="topic">Topic</label>
						<input type="text" name="topic" value={topic} onChange={(event) => this.setState({topic: event.target.value})} className="pure-input-rounded"/>
					</div>
					<div>
						<label htmlFor="language">Language</label>
						<select name="language" onChange={(event) => this.setState({language: event.target.value})} className="pure-input-rounded" value={language}>
							<option value="">Select a language</option>
							<option>ASL</option>
							{languages.getLanguageCodes().map((langCode) => 
								<option key={langCode}>{languages.getLanguageName(langCode)}</option>
							)}
						</select>
					</div>
					<div>
						<label htmlFor="price">Price</label>
						<input type="number" min="0.50" step="0.01" name="price" value={price} onChange={(event) => this.setState({price: Number(event.target.value)})} className="pure-input-rounded"/>
						<p><i>Application fees will be applied</i></p>
					</div>
					<div>
						<label htmlFor="currency">Currency</label>
						<input type="text" name="currency" value={currency} onChange={(event) => this.setState({currency: event.target.value})} className="pure-input-rounded"/>
					</div>
					<div className="upload-container">
						<input type="file" name="thumbnail" onChange={this.handleThumbnailChange}/>
						<label htmlFor="thumbnail">
							Thumbnail
							<FontAwesomeIcon icon={faUpload}/>
						</label>
					</div>
					<div className="pure-u-l pure-u-md-1-2" style={{ maxWidth: '100%', height: '300px' }}>
						<div className="pad" style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
							<div className="thumbnail-preview img-container" style={{ height: '100%', width: '100%', background: `url(${ thumbnailSrc }) no-repeat center center/cover` }}></div>
						</div>
					</div>
					<div>
						<button onClick={this.handleSubmit}>
							Submit
							<FontAwesomeIcon icon={faLongArrowAltRight}/>
						</button>
					</div>
				</form>
				<div className="pure-u-1 pure-u-md-1-2">
					{savedPremiumVideoChatListing ?
						<div>
							<PremiumVideoChatListing premiumVideoChatListing={savedPremiumVideoChatListing}/>
							<form>
								<a className="button" href="#remove-listing" style={{ width: 'max-content' }}>
									Remove Listing
									<FontAwesomeIcon icon={faTrash}/>
								</a>
							</form>
							<RemoveConfirmationModal
								buttonText="Remove Listing"
								buttonAnchor="remove-listing"
								modalTitle="Remove Listing"
								modalContent="Are you sure you want to remove this listing?"
								handleDelete={this.handleDeleteListing}
							/>
						</div>
						:
						''
					}
				</div>
			</div>
		);
	}
}