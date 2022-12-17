import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';
import VideosIndex from './components/VideosIndex.jsx';
import VideosAdd from './components/VideosAdd.jsx';
import Level from './components/Level.jsx';
import Topic from './components/Topic.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AccountProfile from './components/AccountProfile.jsx';
import ProfileEditForm from './components/ProfileEditForm.js';
import VideoChat from './components/VideoChat.js';
import Chats from './components/Chats.jsx';
import UserFeed from './components/UserFeed.js';
import Lessons from './components/Lessons.js';

import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'css-modal/build/modal.css';

// Initialize Framewerk after app is rendered
import { initFramewerk } from 'werkbot-framewerk';
setTimeout(() => {
	initFramewerk(false);
	window.dispatchEvent(new Event('load'));
}, 1000);

// Add a string method to convert times to AM/PM format
String.prototype.convertTo12HourTime = function(){
	// Should be called like: '21:00.convertTo12HourTime()'. '1/1/2000' is an arbitrary valid date.
	return new Date('1/1/2000 ' + this).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

// Attempt Login with JWT
(async function(){
	if (!sessionStorage.getItem('didJWTLogin')) {
		sessionStorage.setItem('didJWTLogin', true);
		await fetch('/do-jwt-login')
			.then((response) => response.json())
			.then((data) => data)
			.then(async (doJWTLogin) => {
				if(doJWTLogin){
					await fetch('/login', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							displayName: 'JWT_DISPLAYNAME',
							password: 'JWT_PASSWORD',
							backURL: document.location.pathname,
						})
					})
					.then((response) => document.location = response.url);
				}
			})
			.catch((e) => console.log('No JWT found.'));
	}
})();

var homeElement = document.getElementById('home');
if(homeElement){
	if (window.isLive) {
		var p = homeElement.getAttribute('p');
		ReactDOM.render(<Home p={p} isLive={isLive}/>, homeElement);
	} else {
		var userLikedVideos = homeElement.getAttribute('userlikedvideos');
		var userID = homeElement.getAttribute('userid');
		ReactDOM.render(<Home userLikedVideos={userLikedVideos} userID={userID} isLive={isLive}/>, homeElement);
	}
}

var videosElement = document.getElementById('videos');
if(videosElement){
	if (window.isLive) {
		var p = videosElement.getAttribute('p');
		ReactDOM.render(<VideosIndex p={p} isLive={isLive}/>, videosElement);
	} else {
		var userLikedVideos = videosElement.getAttribute('userlikedvideos');
		var userID = videosElement.getAttribute('userid');
		ReactDOM.render(<VideosIndex userLikedVideos={userLikedVideos} userID={userID} isLive={isLive}/>, videosElement);
	}
}

var videosAddElement = document.getElementById('videos-add');
if(videosAddElement){
	var video = videosAddElement.getAttribute('video');
	ReactDOM.render(<VideosAdd video={video}/>, videosAddElement);
}

var levelElement = document.getElementById('level');
if(levelElement){
	if (window.isLive) {
		var p = levelElement.getAttribute('p');
		ReactDOM.render(<Level p={p} isLive={isLive}/>, levelElement);
	} else {
		var levelID = levelElement.getAttribute('levelid');
		ReactDOM.render(<Level levelID={levelID} isLive={isLive}/>, levelElement);
	}
}

var topicElement = document.getElementById('topic');
if(topicElement){
	var levelID = topicElement.getAttribute('levelid');
	var topicID = topicElement.getAttribute('topicid');
	var completed = topicElement.getAttribute('completed');
	ReactDOM.render(<Topic levelID={levelID} topicID={topicID} completed={eval(completed)}/>, topicElement);
}

var loginElement = document.getElementById('login');
if(loginElement){
	var errors = loginElement.getAttribute('errors');
	ReactDOM.render(<Login errors={errors}/>, loginElement);
}

var registerElement = document.getElementById('register');
if(registerElement){
	var errors = registerElement.getAttribute('errors');
	ReactDOM.render(<Register errors={errors}/>, registerElement);
}

var accountProfileElement = document.getElementById('account-profile');
if(accountProfileElement){
	if (window.isLive) {
		var p = accountProfileElement.getAttribute('p');
		ReactDOM.render(<AccountProfile p={p} isLive={isLive}/>, accountProfileElement);
	} else {
		var userID = accountProfileElement.getAttribute('userid');
		var authenticatedUserID = accountProfileElement.getAttribute('authenticateduserid');
		var isCurrentUser = accountProfileElement.getAttribute('iscurrentuser');
		var stripeAccountPending = accountProfileElement.getAttribute('stripeaccountpending');
		var pathResolver = accountProfileElement.getAttribute('pathresolver');
		ReactDOM.render(<AccountProfile userID={userID} authenticatedUserID={authenticatedUserID} isCurrentUser={eval(isCurrentUser)} stripeAccountPending={eval(stripeAccountPending)} pathResolver={pathResolver} isLive={isLive}/>, accountProfileElement);
	}
}

var accountProfileEditElement = document.getElementById('account-profile-edit');
if(accountProfileEditElement){
	if (window.isLive) {
		var p = accountProfileEditElement.getAttribute('p');
		ReactDOM.render(<ProfileEditForm p={p} isLive={isLive}/>, accountProfileEditElement);
	} else {
		var userID = accountProfileEditElement.getAttribute('userid');
		var pathResolver = accountProfileEditElement.getAttribute('pathresolver');
		ReactDOM.render(<ProfileEditForm userID={userID} pathResolver={pathResolver} isLive={isLive}/>, accountProfileEditElement);
	}
}

var findUsersElement = document.getElementById('find-users');
if(findUsersElement){
	ReactDOM.render(<UserFeed SearchFormHeading="Find friends"/>, findUsersElement);
}

var videoChatElement = document.getElementById('video-chat');
if(videoChatElement){
	if (window.isLive) {
		var p = videoChatElement.getAttribute('p');
		ReactDOM.render(<VideoChat p={p} isLive={isLive}/>, videoChatElement);
	} else {
		var authenticatedUserID = videoChatElement.getAttribute('authenticateduserid');
		ReactDOM.render(<VideoChat authenticatedUserID={authenticatedUserID} isLive={isLive}/>, videoChatElement);
	}
}

var chatsElement = document.getElementById('chats');
if(chatsElement){
	if (window.isLive) {
		var p = chatsElement.getAttribute('p');
		ReactDOM.render(<Chats p={p} isLive={isLive}/>, chatsElement);
	} else {
		var authenticatedUserID = chatsElement.getAttribute('authenticateduserid');
		ReactDOM.render(<Chats authenticatedUserID={authenticatedUserID} isLive={isLive}/>, chatsElement);
	}
}

var lessonsElement = document.getElementById('lessons');
if(lessonsElement){
	if (window.isLive) {
		var p = lessonsElement.getAttribute('p');
		ReactDOM.render(<Lessons p={p} isLive={isLive}/>, lessonsElement);
	} else {
		var authenticatedUserID = lessonsElement.getAttribute('authenticateduserid');
		ReactDOM.render(<Lessons authenticatedUserID={authenticatedUserID} isLive={isLive}/>, lessonsElement);
	}
}