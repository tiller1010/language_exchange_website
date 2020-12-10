import React from 'react';

class VideosAdd extends React.Component {
	constructor(){
		super();
		this.state = {
		}
		// this.handleImageUploadChange = this.handleImageUploadChange.bind(this);
		this.handleVideoUploadChange = this.handleVideoUploadChange.bind(this);
	}

	componentDidMount(){
	}

	// handleImageUploadChange(event){
	// 	let key = event.target.name;
	// 	let newState = {};
	//     let image = event.target.files[0];
	//     if(image){
	// 		newState[key] = image.name;
	// 		this.setState(newState);

	//     	// Set preview
	//     	let reader = new FileReader();
	//     	let frame = document.querySelector(`.${key}-preview`);
	// 		reader.addEventListener('load', function () {
	// 		  frame.style.background = `url(${ reader.result }) no-repeat center center/contain`;
	// 		  // sessionStorage.setItem(key, reader.result);
	// 		}, false);
	//     	reader.readAsDataURL(image);
	//     }
	// }

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
			  frame.src = `${ reader.result }`;
			  console.log(reader.result)
			  // sessionStorage.setItem(key, reader.result);
			}, false);
	    	reader.readAsDataURL(video);
	    }
	}

				// <div className="image-preview" style={{height: '300px'}}></div>
					// <div style={{display: 'flex'}}>
					// 	<label htmlFor="title">Image</label>
					// 	<input type="file" name="image" onChange={this.handleImageUploadChange} required/>
					// </div>
				
	render(){

		return (
			<div className="pad">
				<h1>Video Add</h1>
				<a href={`/videos`}>Back</a>
				<div style={{height: '300px'}}>
					<video type="video/mp4" className="video-preview" height="225" width="400" controls>
					</video>
				</div>
				<form action="/videos/add" method="POST" encType="multipart/form-data">
					<input type="text" name="title" required/>
					<div style={{display: 'flex'}}>
						<label htmlFor="video">Video</label>
						<input type="file" name="video" onChange={this.handleVideoUploadChange} required/>
					</div>
					<input type="submit" value="Submit"/>
				</form>
			</div>
		);
	}
}

export default VideosAdd;