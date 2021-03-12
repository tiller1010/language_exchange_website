import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';

class AccountProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: {}
		}
		this.findUser = this.findUser.bind(this);
	}

	componentDidMount(){
		if(this.props.identifier){
			this.findUser(this.props.identifier);
		}
	}

	async findUser(identifier){
		const user = await fetch(`${document.location.origin}/user.json/${identifier}`).then((res) => res.json());
		this.setState({user});
	}

	render(){
		return (
			<div className="frame">
				<Navigation/>
				<h1>Welcome, {this.state.user.firstName}</h1>
				<a href="/logout" className="button">
					Logout
					<FontAwesomeIcon icon={faSignOutAlt}/>
				</a>
				{this.state.user.likedVideos ?
					<div>
						<h2>Liked Videos</h2>
						{this.state.user.likedVideos.map((video) => 
							<div key={video._id} className="pure-u-1 pure-u-lg-1-3">
								<h3>{video.title}</h3>
								<div style={{height: '300px'}}>
									<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
										video.thumbnailSrc || "/images/videoPlaceholder.png"
									} controls>
										<source src={video.src}></source>
									</video>
								</div>
							</div>
						)}
					</div>
					:
					''
				}
			</div>
		);
	}
}

export default AccountProfile;