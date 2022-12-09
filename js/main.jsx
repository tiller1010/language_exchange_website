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
import ProfileEditForm from './components/ProfileEditForm.tsx';
import VideoChat from './components/VideoChat.tsx';
import Chats from './components/Chats.jsx';
import UserFeed from './components/UserFeed.tsx';
import Lessons from './components/Lessons.tsx';

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

if(document.getElementById('home')){
	if (window.isLive) {
		var p = document.getElementById('home').getAttribute('p');
		ReactDOM.render(<Home p={p} isLive={isLive}/>, document.getElementById('home'));
	} else {
		var userLikedVideos = document.getElementById('home').getAttribute('userlikedvideos');
		var userID = document.getElementById('home').getAttribute('userid');
		ReactDOM.render(<Home userLikedVideos={userLikedVideos} userID={userID} isLive={isLive}/>, document.getElementById('home'));
	}
}
if(document.getElementById('videos')){
	var userLikedVideos = document.getElementById('videos').getAttribute('userlikedvideos');
	var userID = document.getElementById('videos').getAttribute('userid');
	ReactDOM.render(<VideosIndex userLikedVideos={userLikedVideos} userID={userID}/>, document.getElementById('videos'));
}
if(document.getElementById('videos-add')){
	var video = document.getElementById('videos-add').getAttribute('video');
	ReactDOM.render(<VideosAdd video={video}/>, document.getElementById('videos-add'));
}
if(document.getElementById('level')){
	if (window.isLive) {
		var p = document.getElementById('level').getAttribute('p');
		ReactDOM.render(<Level p={p} isLive={isLive}/>, document.getElementById('level'));
	} else {
		var levelID = document.getElementById('level').getAttribute('levelid');
		ReactDOM.render(<Level levelID={levelID} isLive={isLive}/>, document.getElementById('level'));
	}
}
if(document.getElementById('topic')){
	var levelID = document.getElementById('topic').getAttribute('levelid');
	var topicID = document.getElementById('topic').getAttribute('topicid');
	var completed = document.getElementById('topic').getAttribute('completed');
	ReactDOM.render(<Topic levelID={levelID} topicID={topicID} completed={eval(completed)}/>, document.getElementById('topic'));
}
if(document.getElementById('login')){
	var errors = document.getElementById('login').getAttribute('errors');
	ReactDOM.render(<Login errors={errors}/>, document.getElementById('login'));
}
if(document.getElementById('register')){
	var errors = document.getElementById('register').getAttribute('errors');
	ReactDOM.render(<Register errors={errors}/>, document.getElementById('register'));
}
if(document.getElementById('account-profile')){
	if (window.isLive) {
		var p = document.getElementById('account-profile').getAttribute('p');
		ReactDOM.render(<AccountProfile p={p} isLive={isLive}/>, document.getElementById('account-profile'));
	} else {
		var userID = document.getElementById('account-profile').getAttribute('userid');
		var authenticatedUserID = document.getElementById('account-profile').getAttribute('authenticateduserid');
		var isCurrentUser = document.getElementById('account-profile').getAttribute('iscurrentuser');
		var stripeAccountPending = document.getElementById('account-profile').getAttribute('stripeaccountpending');
		var pathResolver = document.getElementById('account-profile').getAttribute('pathresolver');
		ReactDOM.render(<AccountProfile userID={userID} authenticatedUserID={authenticatedUserID} isCurrentUser={eval(isCurrentUser)} stripeAccountPending={eval(stripeAccountPending)} pathResolver={pathResolver} isLive={isLive}/>, document.getElementById('account-profile'));
	}
}
if(document.getElementById('account-profile-edit')){
	var userID = document.getElementById('account-profile-edit').getAttribute('userid');
	var pathResolver = document.getElementById('account-profile-edit').getAttribute('pathresolver');
	ReactDOM.render(<ProfileEditForm userID={userID} pathResolver={pathResolver}/>, document.getElementById('account-profile-edit'));
}
if(document.getElementById('find-users')){
	var authenticatedUserID = document.getElementById('find-users').getAttribute('authenticateduserid');
	ReactDOM.render(<UserFeed authenticatedUserID={authenticatedUserID} SearchFormHeading="Find friends"/>, document.getElementById('find-users'));
}
if(document.getElementById('video-chat')){
	var authenticatedUserID = document.getElementById('video-chat').getAttribute('authenticateduserid');
	ReactDOM.render(<VideoChat authenticatedUserID={authenticatedUserID}/>, document.getElementById('video-chat'));
}
if(document.getElementById('chats')){
	var authenticatedUserID = document.getElementById('chats').getAttribute('authenticateduserid');
	ReactDOM.render(<Chats authenticatedUserID={authenticatedUserID}/>, document.getElementById('chats'));
}
if(document.getElementById('lessons')){
	var authenticatedUserID = document.getElementById('lessons').getAttribute('authenticateduserid');
	ReactDOM.render(<Lessons authenticatedUserID={authenticatedUserID}/>, document.getElementById('lessons'));
}