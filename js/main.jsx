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
import loadWebRTC from './web-rtc.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'css-modal/build/modal.css';

(async function(){
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
					})
				})
				.then((response) => document.location = response.url);
			}
		})
		.catch((e) => console.log(e));
})();

if(document.getElementById('home')){
	var userLikedVideos = document.getElementById('home').getAttribute('userlikedvideos');
	var userID = document.getElementById('home').getAttribute('userid');
	ReactDOM.render(<Home userLikedVideos={userLikedVideos} userID={userID}/>, document.getElementById('home'));
}
if(document.getElementById('videos')){
	var userLikedVideos = document.getElementById('videos').getAttribute('userlikedvideos');
	var userID = document.getElementById('videos').getAttribute('userid');
	ReactDOM.render(<VideosIndex userLikedVideos={userLikedVideos} userID={userID}/>, document.getElementById('videos'));
}
if(document.getElementById('videos-add')){
	ReactDOM.render(<VideosAdd/>, document.getElementById('videos-add'));
}
if(document.getElementById('level')){
	var levelID = document.getElementById('level').getAttribute('levelid');
	ReactDOM.render(<Level levelID={levelID}/>, document.getElementById('level'));
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
	var userID = document.getElementById('account-profile').getAttribute('userid');
	var authenticatedUserID = document.getElementById('account-profile').getAttribute('authenticateduserid');
	var isCurrentUser = document.getElementById('account-profile').getAttribute('iscurrentuser');
	var pathResolver = document.getElementById('account-profile').getAttribute('pathresolver');
	ReactDOM.render(<AccountProfile userID={userID} authenticatedUserID={authenticatedUserID} isCurrentUser={eval(isCurrentUser)} pathResolver={pathResolver}/>, document.getElementById('account-profile'));
}
if(document.getElementById('web-rtc')){
	(async function(){
		const firebaseConfig = await fetch('/web-rtc-tokens', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			})
		})
		.then((response) => response.json())
		.catch((e) => console.log(e));
		loadWebRTC(firebaseConfig);
	}());
}