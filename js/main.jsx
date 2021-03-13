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
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

if(document.getElementById('home')){
	ReactDOM.render(<Home/>, document.getElementById('home'));
}
if(document.getElementById('videos')){
	var userLikedVideos = document.getElementById('videos').getAttribute('userLikedVideos');
	ReactDOM.render(<VideosIndex userLikedVideos={userLikedVideos}/>, document.getElementById('videos'));
}
if(document.getElementById('videos-add')){
	ReactDOM.render(<VideosAdd/>, document.getElementById('videos-add'));
}
if(document.getElementById('level')){
	var levelID = document.getElementById('level').getAttribute('levelID');
	ReactDOM.render(<Level levelID={levelID}/>, document.getElementById('level'));
}
if(document.getElementById('topic')){
	var levelID = document.getElementById('topic').getAttribute('levelID');
	var topicID = document.getElementById('topic').getAttribute('topicID');
	ReactDOM.render(<Topic levelID={levelID} topicID={topicID}/>, document.getElementById('topic'));
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
	var identifier = document.getElementById('account-profile').getAttribute('identifier');
	ReactDOM.render(<AccountProfile identifier={identifier}/>, document.getElementById('account-profile'));
}