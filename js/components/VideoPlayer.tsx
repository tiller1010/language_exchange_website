import * as React from 'react';
import ReadMore from '@jamespotz/react-simple-readmore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import graphQLFetch from '../graphQLFetch.js';

interface User {
	_id: string;
	displayName: string;
}

interface VideoPlayerState {
	likes: number;
	likedByCurrentUser: boolean;
}

interface VideoPlayerProps {
	_id: string;
	title: string;
	src: string;
	thumbnailSrc: string;
	uploadedBy: User;
	likes: number;
	likedByCurrentUser: boolean;
	authenticatedUserID: string;
	handleDeleteVideo: Function;
	afterToggleLike: Function;
}

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
	constructor(props: VideoPlayerProps){
		super(props);
		let state: VideoPlayerState = {
			likes: 0,
			likedByCurrentUser: false
		}
		this.state = state;
		this.toggleLike = this.toggleLike.bind(this);
		this.renderMedia = this.renderMedia.bind(this);
	}

	componentDidMount(){
		const { likes, likedByCurrentUser } = this.props;
		this.setState({
			likes,
			likedByCurrentUser
		});
	}

	componentDidUpdate(prevProps){
		if(this.props.likedByCurrentUser != prevProps.likedByCurrentUser){
			this.setState({
				likedByCurrentUser: this.props.likedByCurrentUser
			});
		}
		if(this.props.likes != prevProps.likes){
			this.setState({
				likes: this.props.likes
			});
		}
	}

	async toggleLike(videoID){
		if(!this.props.authenticatedUserID){
			alert('Must be signed in to send like.');
			return;
		}
		const apiSegment = this.state.likedByCurrentUser ? 'removeLike' : 'addLike';
		const query = `mutation addLike($userID: ID!, $videoID: ID!){
			${apiSegment}(userID: $userID, videoID: $videoID){
				_id
				title
				src
				originalName
				thumbnailSrc
				originalThumbnailName
				created
				likes
				uploadedBy {
					_id
					displayName
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			userID: this.props.authenticatedUserID,
			videoID: videoID
		});
		const newVideo = data[apiSegment];

		if(newVideo.message){
			// Display error message if included in response
			alert(newVideo.message);
		}

		this.setState(prevState => ({
			likes: newVideo.likes,
			likedByCurrentUser: !prevState.likedByCurrentUser
		}));

		if(this.props.afterToggleLike){
			this.props.afterToggleLike(newVideo, this.state.likedByCurrentUser);
		}
	}

	renderMedia() {

		const { src, thumbnailSrc } = this.props;

		const fileExtension = src.split('.').reverse()[0];

		switch(fileExtension){
			case 'svg':
			case 'png':
			case 'jpg':
			case 'jpeg':
				return (
					<div className="img-container">
						<img src={fileExtension}/>
					</div>
				);
			case 'mov':
			case 'mp4':
				return (
					<video className="video-preview lozad" height="225" width="400" poster={
						thumbnailSrc || "/images/videoPlaceholder.png"
					} controls>
						<source type="video/mp4" src={src}></source>
					</video>
				);
			case 'mp3':
			case 'wav':
				return (
					<div style={{
						height: '225px',
						width: '400px',
						background: `url('${thumbnailSrc || "/images/videoPlaceholder.png"}')`,
						backgroundSize: 'cover',
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'center',
						borderRadius: '25px',
					    overflow: 'hidden',
					    maxWidth: '100%',
					}}>
						<audio className="lozad" controls>
							<source type="audio/wav" src={src}></source>
						</audio>
					</div>
				);
			default:
				return <p>Invalid media</p>
		}
	}

	render(){

		const { likes, likedByCurrentUser } = this.state;
		const { _id, title, uploadedBy } = this.props;

		return (
			<div>
				<div className="flex x-center">
					<div style={{ maxWidth: '100%' }}>
						<div className="flex x-space-between y-center">
							<div style={{ maxWidth: '65%' }}>
								<ReadMore
						            fade
						            minHeight={58}
						            btnStyles={{
						            	position: 'absolute',
						            	bottom: '-30px',
						            	border: '1px solid #000',
						            	borderRadius: '5px',
						            	margin: 0,
						            	padding: '5px',
						            	zIndex: 1,
						            	cursor: 'pointer',
						            }}
					            >
									<h3>{title}</h3>
								</ReadMore>
							</div>
							{this.props.handleDeleteVideo ?
								<form action="/videos/remove" method="POST" className="fw-form">
									<input type="hidden" name="videoID" value={this.props._id}/>
									<a className="button" href="#remove-video" onClick={(event) => this.props.handleDeleteVideo(event)}>
										Remove Video
										<FontAwesomeIcon icon={faTrash}/>
									</a>
								</form>
								:
								''
							}
							{uploadedBy._id ?
								<div>
									<p>By: <a href={`/account-profile/${uploadedBy._id}`} aria-label={`${uploadedBy.displayName} profile`}>{uploadedBy.displayName}</a></p>
								</div>
								:
								<div>
									<p>By: {uploadedBy.displayName}</p>
								</div>
							}
						</div>
						{this.renderMedia()}
					</div>
				</div>
				<div className="flex x-space-around y-center">
					<p>Likes: {likes || 0}</p>
						<button className="button" onClick={() => this.toggleLike(_id)}>
						{likedByCurrentUser ?
							<span>
								Liked
								<FontAwesomeIcon icon={faStar}/>
							</span>
							:
							<span>
								Like
								<FontAwesomeIcon icon={farStar}/>
							</span>
						}
						</button>
				</div>
			</div>
		);
	}
}