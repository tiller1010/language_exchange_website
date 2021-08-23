import React from 'react';
import ReadMore from '@jamespotz/react-simple-readmore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

interface VideoAttributes {
	likes: number;
	likedByCurrentUser: boolean;
}

export default class VideoPlayer extends React.Component {
	constructor(props){
		super(props);
		let state: VideoAttributes = {
			likes: 0,
			likedByCurrentUser: false
		}
		this.state = state;
		this.toggleLike = this.toggleLike.bind(this);
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
	}

	async toggleLike(_id){
		const apiURLSegment = this.state.likedByCurrentUser ? 'removeLike' : 'sendLike';
		const likeIncrement = this.state.likedByCurrentUser ? -1 : 1;
		await fetch(`${document.location.origin}/${apiURLSegment}/${_id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		this.setState(prevState => ({
			likes: prevState.likes + likeIncrement,
			likedByCurrentUser: !prevState.likedByCurrentUser
		}));
	}

	render(){

		const { likes, likedByCurrentUser } = this.state;
		const { _id, title, src, thumbnailSrc, uploadedBy } = this.props;

		return (
			<div>
				<div className="flex x-center">
					<div>
						<div className="flex x-space-between y-center">
							<div style={{ maxWidth: '65%' }}>
								<ReadMore
						            fade
						            minHeight={58}
						            btnStyles={{
						            	position: 'absolute',
						            	bottom: '-15px',
						            	border: 'none',
						            	margin: 0,
						            	padding: '5px',
						            	zIndex: 1
						            }}
					            >
									<h3>{title}</h3>
								</ReadMore>
							</div>
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
						<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
							thumbnailSrc || "/images/videoPlaceholder.png"
						} controls>
							<source src={src}></source>
						</video>
					</div>
				</div>
				<div className="flex x-space-around y-center">
					<p>Likes: {likes || 0}</p>
						<button onClick={() => this.toggleLike(_id)}>
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