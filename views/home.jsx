import React from 'react';
import DefaultLayout from './layouts/default';

const Home = (props) => {
  return (
	<DefaultLayout>
		<div id="home" data-userLikedVideos={JSON.stringify(props.userLikedVideos)}></div>
	</DefaultLayout>
  );
}

export default Home;
