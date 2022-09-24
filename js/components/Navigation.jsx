import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faHome, faPlay, faUser, faComments, faBook
} from '@fortawesome/free-solid-svg-icons';

class Navigation extends React.Component {
  render() {
    return (
		<nav>
			<div className="flex">
				<div className="add-content-btn-container flex flex-vertical-center">
					<a href="/videos/add" title="Add content of your own" className="add-content-btn">
						<FontAwesomeIcon icon={faPlus}/>
					</a>
				</div>
				<div className="small-pad">
					<a href="/" className="button">
						<span>Home</span>
						<FontAwesomeIcon icon={faHome}/>
					</a>
				</div>
				<div className="small-pad">
					<a href="/lessons" className="button">
						<span>Learn</span>
						<FontAwesomeIcon icon={faBook}/>
					</a>
				</div>
				<div className="small-pad">
					<a href="/videos" className="button">
						<span>Share</span>
						<FontAwesomeIcon icon={faPlay}/>
					</a>
				</div>
				<div className="small-pad">
					<a href="/chats" className="button">
						<span>Chat</span>
						<FontAwesomeIcon icon={faComments}/>
					</a>
				</div>
				<div className="small-pad">
					<a href="/account-profile" className="button">
						<span>Account Profile</span>
						<FontAwesomeIcon icon={faUser}/>
					</a>
				</div>
			</div>
		</nav>
    );
  }
}

export default Navigation;
