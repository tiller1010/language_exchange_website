import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUpload, faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';
import MediaRenderer from './MediaRenderer.tsx';
import LanguageSelector from './LanguageSelector.tsx';
import { ReactMic } from 'react-mic/dist/index.js';

class VideosAdd extends React.Component {
	constructor(){
		super();
		this.state = {
			title: '',
			languageOfTopic: '',
			mediaSource: '',
			thumbnailSrc: '',
			recording: false,
		}
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleThumbnailUploadChange = this.handleThumbnailUploadChange.bind(this);
		this.handleVideoUploadChange = this.handleVideoUploadChange.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.saveRecording = this.saveRecording.bind(this);
	}

	componentDidMount(){
		const urlParams = new URLSearchParams(window.location.search);
		const challenge = urlParams.get('challenge');

		this.setState({
			title: challenge || ''
		});

		if (this.props.video) {
			let video = JSON.parse(this.props.video);
			video.mediaSource = '../../' + video.src;
			video.thumbnailSrc = '../../' + video.thumbnailSrc;
			this.setState({ ...video });
		}
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
				if(/mp4|quicktime|wav|mp3/.test(reader.result.substr(0, 20))){
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

	startRecording() {
		this.setState({ recording: true });
	}

	stopRecording() {
		this.setState({ recording: false });
	}

	async saveRecording(soundRecordingEvent) {
		const file = new File([soundRecordingEvent.blob], 'soundrecording.mp3', {type: 'audio/mp3', lastModified: new Date().getTime()});
		const container = new DataTransfer();

		// IOS debugging
		// var debug = document.createElement('p')
		// console.log(soundRecordingEvent)
		// debug.innerHTML = soundRecordingEvent.blobURL
		// document.querySelector('.sound-recording-field').append(debug)

		container.items.add(file);
		document.querySelector('input[name="soundRecording"]').files = container.files;
		this.setState({
			mediaSource: soundRecordingEvent.blobURL,
			video: 'soundrecording.mp3',
		});
	}
				
	render(){

		const {
			title,
			languageOfTopic,
			video, // media filename: "example.mp4"
			mediaSource, // blob link: "blob:https://..."
			thumbnail, // thumbnail filename: "example.jpg"
			thumbnailSrc, // encoded image: "data:image/jpeg;base64,/..."
			recording,
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
			<div className="frame fw-container">
				<Navigation/>

				<div className="video-add-view flex-container">
					<div className="desktop-50 tablet-100" style={{maxWidth: '100%'}}>
						<div className="desktop-100" style={{height: '300px'}}>
							<div className="fw-space">
								<h2 style={{ marginBottom: '5px' }}>Upload Preview</h2>
								<MediaRenderer src={mediaSource} thumbnailSrc={thumbnailSrc} fileExtension={fileExtension}/>
							</div>
						</div>
						<div className="desktop-100" style={{ maxWidth: '100%' }}>
							<div className="fw-space">
								<h2 style={{ marginBottom: '5px' }}>Thumbnail Preview</h2>
								<div className="thumbnail-preview">
									<MediaRenderer src={thumbnailSrc} fileExtension={thumbnailFileExtension}/>
								</div>
							</div>
						</div>
					</div>

					<div className="page-form desktop-50 tablet-100">
						<h1 style={{ textAlign: 'right', marginBottom: '5px' }}>Share what you know</h1>
						<h2 style={{ fontSize: '1.5em' }}>Add a video or sound file</h2>
						<form action={`/videos/${this.state._id ? 'edit/' + this.state._id : 'add'}`} method="POST" encType="multipart/form-data" className="flex-col x-end fw-form">
							<div className="field text desktop-100" htmlFor="titleField">
								<label htmlFor="titleField">Title</label>
								<input type="text" name="title" id="titleField" value={title} onChange={this.handleTitleChange} aria-label="title" required/>
							</div>
							<LanguageSelector name="languageOfTopic" id="languageOfTopicField" className="desktop-100" onChange={(event) => this.setState({ languageOfTopic: event.target.value })} value={languageOfTopic}/>
							<div className="flex-container flex-vertical-center">
								<p><b>Upload</b> a video or sound file here:</p>
								<span>&nbsp;</span>
								<div className="upload-container">
									<input type="file" name="video" onChange={this.handleVideoUploadChange} required={!mediaSource}/>
									<label htmlFor="video">
										Media
										<FontAwesomeIcon icon={faUpload}/>
									</label>
								</div>
							</div>
							<p><b>OR</b> record sound here:</p>
							<div className="sound-recording-field">
								<ReactMic
									record={recording}
									onStop={this.saveRecording}
								/>
								<div className="flex-container flex-horizontal-right">
									<button onClick={this.startRecording} className="button" type="button">
										Start
										<FontAwesomeIcon icon={faMicrophone}/>
									</button>
									<span>&nbsp;</span>
									<button onClick={this.stopRecording} className="button" type="button">
										Stop
										<FontAwesomeIcon icon={faStop}/>
									</button>
								</div>
								<input type="file" name="soundRecording" className="desktop-hide"/>
								{video == 'soundrecording.mp3' ?
									<input type="hidden" name="useSoundRecording" value={true}/>
									:
									''
								}
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