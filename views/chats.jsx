import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

const Chats = (props) => {

  const { premiumVideoChatListings } = props;

  return (
    <DefaultLayout isLive={props.isLive}>
      <div id="chats" authenticateduserid={props.authenticatedUserID} p={props.p}>
        <SSRView/>
        {premiumVideoChatListings.map((listing) =>
          <div key={listing._id}>
            <div className="fw-typography-spacing">
              <h2>{listing.topic}</h2>
              <h3>{listing.languageOfTopic}</h3>
              <p><b>{listing.duration}</b></p>
              <p><b>{listing.price}&nbsp;{listing.currency}</b></p>
            </div>
            <div className="thumbnail-preview img-container">
              <img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={listing.thumbnailSrc} alt={listing.topic}/>
            </div>
            <button className="button">
              Buy Now
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Chats;
