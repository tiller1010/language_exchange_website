import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
const languages = require('language-list')();
import graphQLFetch from './graphQLFetch.js';
import PremiumVideoChatListing from './PremiumVideoChatListing.tsx';

interface User {
	_id: string;
	displayName: string
	premiumVideoChatListing?: PremiumVideoChatListingObject
}

interface PremiumVideoChatListingObject {
	_id: string;
	topic: string;
	language: string
	thumbnailSrc: string
	userID: string
}

interface PremiumVideoChatListingFormState {
	topic: string;
	language: string
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
			thumbnailSrc: '',
		}
		this.state = state;
		this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
				if(/jpeg|jpg|png/.test(reader.result.substr(0, 20))){
					context.setState({thumbnailSrc: reader.result});
				} else {
					alert('Invalid thumbnail format.');
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
						thumbnailSrc
						userID
					}
				}`;
				variables = {
					listingID: savedPremiumVideoChatListing._id,
					premiumVideoChatListing: {
						topic,
						language,
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
						thumbnailSrc
						userID
					}
				}`;
				variables = {
					userID: user._id,
					premiumVideoChatListing: {
						topic,
						language,
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

	render(){

		let {
			topic,
			language,
			thumbnailSrc,
			savedPremiumVideoChatListing
		} = this.state;

		let { user } = this.props;

		return(
			<div className="pure-g">
				<form className="pure-u-1 pure-u-md-1-2 pure-form pure-form-stacked">
					<div>
						<label htmlFor="topic">Topic</label>
						<input type="text" name="topic" value={topic} onChange={(event) => this.setState({topic: event.target.value})} className="pure-input-rounded"/>
					</div>
					<div>
						<label htmlFor="language">Language</label>
						<select name="language" onChange={(event) => this.setState({language: event.target.value})} className="pure-input-rounded">
							<option value="">Select a language</option>
							<option selected={language == 'ASL'}>ASL</option>
							{languages.getLanguageCodes().map((langCode) => 
								<option key={langCode} selected={language == languages.getLanguageName(langCode)}>{languages.getLanguageName(langCode)}</option>
							)}
						</select>
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
						<PremiumVideoChatListing premiumVideoChatListing={savedPremiumVideoChatListing}/>
						:
						''
					}
				</div>
			</div>
		);
	}
}