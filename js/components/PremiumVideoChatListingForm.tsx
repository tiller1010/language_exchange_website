import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
const languages = require('language-list')();
import graphQLFetch from './graphQLFetch.js';

interface User {
	_id: string;
	displayName: string
}

interface PremiumVideoChatListingFormState {
	topic: string;
	language: string
	thumbnailFile?: File
}

interface PremiumVideoChatListingFormProps {
	user: User
}

export default class PremiumVideoChatListingForm extends React.Component<PremiumVideoChatListingFormProps, PremiumVideoChatListingFormState>{
	constructor(props: PremiumVideoChatListingFormProps){
		super(props);
		let state: PremiumVideoChatListingFormState = {
			topic: '',
			language: ''
		}
		this.state = state;
		this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
	  		const frame = document.querySelector(`.thumbnail-preview`);
			reader.addEventListener('load', function () {
				if(/jpeg|jpg|png/.test(reader.result.substr(0, 20))){
				  frame.style.background = `url(${ reader.result }) no-repeat center center/cover`;
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
			thumbnailFile,
		} = this.state;

		let { user } = this.props;

		if(user && topic && language && thumbnailFile){
			const query = `mutation addPremiumVideoChatListing($userID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){
				addPremiumVideoChatListing(userID: $userID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){
					_id
					topic
					language
					thumbnailSrc
					user {
						_id
						displayName
					}
				}
			}`;
			const data = await graphQLFetch(query, {
				userID: user._id,
				premiumVideoChatListing: {
					topic,
					language,
				},
				file: thumbnailFile
			}, true);
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
		} = this.state;

		return(
			<form>
				<div>
					<label htmlFor="topic">Topic</label>
					<input type="text" name="topic" value={topic} onChange={(event) => this.setState({topic: event.target.value})}/>
				</div>
				<div>
					<label htmlFor="language">Language</label>
					<select name="language" onChange={(event) => this.setState({language: event.target.value})}>
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
						<div className="thumbnail-preview img-container" style={{ height: '100%', width: '100%' }}></div>
					</div>
				</div>
				<div>
					<button onClick={this.handleSubmit}>
						Submit
						<FontAwesomeIcon icon={faLongArrowAltRight}/>
					</button>
				</div>
			</form>
		);
	}
}