import React from 'react';
import DefaultLayout from './layouts/default';

const Home = (props) => {
  return (
    <DefaultLayout>
      <h1>Home</h1>
      <div id="home"></div>
    </DefaultLayout>
  );
}

export default Home;
