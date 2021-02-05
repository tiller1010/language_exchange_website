import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome, faPlay, faUpload } from '@fortawesome/free-solid-svg-icons';

class VideosAdd extends React.Component {
	constructor(){
		super();
		this.state = {
			title: ''
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
		let key = event.target.name;
		let newState = {};
	    let image = event.target.files[0];
	    if(image){
			newState[key] = image.name;
			this.setState(newState);

	    	// Set preview
	    	let reader = new FileReader();
	    	let frame = document.querySelector(`.${key}-preview`);
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

	handleVideoUploadChange(event){
		let key = event.target.name;
		let newState = {};
	    let video = event.target.files[0];
	    if(video){
			newState[key] = video.name;
			this.setState(newState);

	    	// Set preview
	    	let reader = new FileReader();
	    	let frame = document.querySelector(`.${key}-preview`);
			reader.addEventListener('load', function () {
				if(/mp4|quicktime/.test(reader.result.substr(0, 20))){
					  frame.src = URL.createObjectURL(video);
					  URL.revokeObjectURL(video);
				} else {
					alert('Invalid video format.');
				}
			}, false);
	    	reader.readAsDataURL(video);
	    }
	}
				
	render(){

		return (
			<div className="pad">
				<h1>Video Add</h1>
				<a href={`/`} className="button">
					Home
			        <FontAwesomeIcon icon={faHome}/>
				</a>
				<a href={`/videos`} className="button">
					Videos
			        <FontAwesomeIcon icon={faPlay}/>
				</a>
				<div className="flex" style={{maxWidth: '1300px'}}>
					<div className="pure-u-1-2" style={{height: '300px'}}>
						<h2>Video Preview</h2>
						<video type="video/mp4" className="video-preview" height="225" width="400" controls>
						</video>
					</div>
					<div className="pure-u-1-2">
						<h2>Thumbnail Preview</h2>
						<div className="thumbnail-preview img-container" style={{height: '225px', width: '400px', border: '1px solid'}}></div>
					</div>
				</div>
				<form action="/videos/add" method="POST" encType="multipart/form-data">
					<input type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} placeholder="Title" required/>
					<div className="upload-container">
						<input type="file" name="video" onChange={this.handleVideoUploadChange} required/>
						<label htmlFor="video">
							Video
							<FontAwesomeIcon icon={faUpload}/>
						</label>
					</div>
					<div className="upload-container">
						<input type="file" name="thumbnail" onChange={this.handleThumbnailUploadChange} required/>
						<label htmlFor="thumbnail">Thumbnail
							<FontAwesomeIcon icon={faUpload}/>
						</label>
					</div>
					<button type="submit">
						Submit
						<FontAwesomeIcon icon={faPlus}/>
					</button>
				</form>
			</div>
		);
	}
}

export default VideosAdd;