import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';
import VideosIndex from './components/VideosIndex.jsx';
import VideosAdd from './components/VideosAdd.jsx';
import Level from './components/Level.jsx';
import Topic from './components/Topic.jsx';
import AccountProfile from './components/AccountProfile.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

if(document.getElementById('home')){
	ReactDOM.render(<Home/>, document.getElementById('home'));
}
if(document.getElementById('videos')){
	ReactDOM.render(<VideosIndex/>, document.getElementById('videos'));
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
if(document.getElementById('account-profile')){
	var userGoogleID = document.getElementById('account-profile').getAttribute('userGoogleID');
	ReactDOM.render(<AccountProfile userGoogleID={userGoogleID}/>, document.getElementById('account-profile'));
}