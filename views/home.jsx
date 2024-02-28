import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Home = (props) => {
  return (
    <DefaultLayout isLive={props.isLive}>
      <div id="home" userlikedvideos={JSON.stringify(props.userLikedVideos)} userid={props.userID} p={props.p}>
        <SSRView/>
      </div>
    </DefaultLayout>
  );
}

export default Home;
