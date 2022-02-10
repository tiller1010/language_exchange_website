import React from 'react';
import DefaultLayout from './layouts/default';

const Home = (props) => {
  return (
		<DefaultLayout>
			<div id="home" userlikedvideos={JSON.stringify(props.userLikedVideos)} userid={props.userID}></div>
		</DefaultLayout>
  );
}

export default Home;
