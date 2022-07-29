import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome, faPlay, faUpload } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';
import MediaRenderer from './MediaRenderer.tsx';
import LanguageSelector from './LanguageSelector.tsx';

class VideosAdd extends React.Component {
	constructor(){
		super();
		this.state = {
			title: '',
			languageOfTopic: '',
			mediaSource: '',
			thumbnailSrc: '',
		}
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleThumbnailUploadChange = this.handleThumbnailUploadChange.bind(this);
		this.handleVideoUploadChange = this.handleVideoUploadChange.bind(this);
	}

	componentDidMount(){
		const urlParams = new URLSearchParams(window.location.search);
		const challenge = urlParams.get('challenge');

		this.setState({
			title: challenge || ''
		});
	}

	handleTitleChange(event){
		this.setState({
			title: event.target.value
		});
	}

	handleThumbnailUploadChange(event){
		const context = this;
		let key = event.target.name;
		let newState = {};
	    let image = event.target.files[0];
	    if(image){
			newState[key] = image.name;
			this.setState(newState);

	    	// Set preview
	    	let reader = new FileReader();
			reader.addEventListener('load', function () {
				if(/jpeg|jpg|png/.test(reader.result.substr(0, 20))){
					context.setState({
						thumbnailSrc: reader.result,
					});
				} else {
					alert('Invalid thumbnail format.');
				}

			}, false);
	    	reader.readAsDataURL(image);
	    }
	}

	handleVideoUploadChange(event){
		const context = this;
		let key = event.target.name;
		let newState = {};
	    let video = event.target.files[0];
	    if(video){
			newState.video = video.name;
			this.setState(newState);

	    	// Set preview
	    	let reader = new FileReader();
			reader.addEventListener('load', function () {
				if(/mp4|quicktime|wav/.test(reader.result.substr(0, 20))){
					  context.setState({
					  	mediaSource: URL.createObjectURL(video),
					  });
					  URL.revokeObjectURL(video);
				} else {
					alert('Invalid video format.');
				}
			}, false);
	    	reader.readAsDataURL(video);
	    }
	}
				
	render(){

		const {
			title,
			languageOfTopic,
			video, // media filename: "example.mp4"
			mediaSource, // blob link: "blob:https://..."
			thumbnail, // thumbnail filename: "example.jpg"
			thumbnailSrc, // encoded image: "data:image/jpeg;base64,/..."
		} = this.state;

		let fileExtension = '';
		if (video) {
			fileExtension = video.split('.').reverse()[0];
		}

		let thumbnailFileExtension = '';
		if (thumbnail) {
			thumbnailFileExtension = thumbnail.split('.').reverse()[0];
		}

		return (
			<div className="frame">
				<Navigation/>

				<div className="video-add-view flex-container">
					<div className="desktop-50 tablet-100" style={{maxWidth: '100%'}}>
						<div className="desktop-100" style={{height: '300px'}}>
							<div className="fw-space">
								<h2>Media Preview</h2>
								<MediaRenderer src={mediaSource} thumbnailSrc={thumbnailSrc} fileExtension={fileExtension}/>
							</div>
						</div>
						<div className="desktop-100" style={{ maxWidth: '100%' }}>
							<div className="fw-space">
								<h2>Thumbnail Preview</h2>
								<div className="thumbnail-preview">
									<MediaRenderer src={thumbnailSrc} fileExtension={thumbnailFileExtension}/>
								</div>
							</div>
						</div>
					</div>

					<div className="page-form desktop-50 tablet-100">
						<h1 style={{ textAlign: 'right' }}>Add a video or sound file</h1>
						<form action="/videos/add" method="POST" encType="multipart/form-data" className="flex-col x-end fw-form">
							<div className="field text" htmlFor="titleField">
								<label htmlFor="titleField">Title</label>
								<input type="text" name="title" id="titleField" value={title} onChange={this.handleTitleChange} aria-label="title" required/>
							</div>
							<LanguageSelector name="languageOfTopic" id="languageOfTopicField" onChange={(event) => this.setState({ languageOfTopic: event.target.value })} value={languageOfTopic}/>
							<div className="upload-container">
								<input type="file" name="video" onChange={this.handleVideoUploadChange} required/>
								<label htmlFor="video">
									Media
									<FontAwesomeIcon icon={faUpload}/>
								</label>
							</div>
							<div className="upload-container">
								<input type="file" name="thumbnail" onChange={this.handleThumbnailUploadChange}/>
								<label htmlFor="thumbnail">Thumbnail
									<FontAwesomeIcon icon={faUpload}/>
								</label>
							</div>
							<button className="button" type="submit">
								Submit
								<FontAwesomeIcon icon={faPlus}/>
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default VideosAdd;