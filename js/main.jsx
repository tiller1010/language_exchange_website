import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';
import VideosIndex from './components/VideosIndex.jsx';
import VideosAdd from './components/VideosAdd.jsx';

if(document.getElementById('home')){
	ReactDOM.render(<Home/>, document.getElementById('home'));
}
if(document.getElementById('videos')){
	ReactDOM.render(<VideosIndex/>, document.getElementById('videos'));
}
if(document.getElementById('videos-add')){
	ReactDOM.render(<VideosAdd/>, document.getElementById('videos-add'));
}