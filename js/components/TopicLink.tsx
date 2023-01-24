import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import lozad from 'lozad';

// Enable lazy loading
// const lozadObserver = lozad();
// lozadObserver.observe();

function renderTopicMedia(FeaturedMedia) {
  if (FeaturedMedia) {
    if (FeaturedMedia.data) {
      switch (FeaturedMedia.data.attributes.mime) {
        case 'image/jpeg':
          return (
            <div className="img-container desktop-100">
              <img src={`${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}
                alt={FeaturedMedia.data.attributes.alternativeText}
                className="lozad"
              />
            </div>
          );
        default:
          return <p>Invalid media</p>
      }
    }
  }
  return <p>Invalid media</p>
}

function renderChallengeMedia(FeaturedMedia){
  if(FeaturedMedia){
    if(FeaturedMedia.data){
      switch(FeaturedMedia.data.attributes.mime){
        case 'image/jpeg':
          return (
            <div className="img-container">
              <img src={`${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}/>
            </div>
          );
        case 'video/mp4':
          return (
            <video height="225" width="400" controls tabIndex="-1" src={`${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}>
            </video>
          );
        case 'audio/wav':
        case 'audio/mp3':
        case 'audio/mpeg':
          return (
            <audio height="225" width="400" controls tabIndex="-1" src={`${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}>
            </audio>
          );
        default:
          return <p>Invalid media</p>
      }
    }
  }
}

export default function TopicLink(props) {

  let { topic, levelID, showChallenge } = props;

  /*
    If topic was completed and saved with Strapi 3,
    format like Strapi 4 API
  */
  if (!topic.attributes) {
    topic.attributes = { ...topic };
    topic.attributes.FeaturedMedia = { data: { attributes: { ...topic.FeaturedImage } } };
    topic.attributes.FeaturedMedia.data.attributes.alternativeText = topic.FeaturedImage.name;
  }

  let challenge = null;
  if (topic.attributes.challenges) {
    challenge = topic.attributes.challenges.data[0];
  }

  return (
    <div>
      <div className="flex x-space-between y-center" style={{ flexWrap: 'nowrap' }}>
        <h3 className="pad no-y no-left" style={{ margin: 0 }}>{topic.attributes.Topic}</h3>
        <a href={`/level/${levelID}/topic/${topic.id}`} aria-label={`View challenges on ${topic.attributes.Topic}`} className="button" style={{ alignSelf: 'center' }}>
          View Topic
          <FontAwesomeIcon icon={faLongArrowAltRight}/>
        </a>
      </div>
      <a href={`/level/${levelID}/topic/${topic.id}`} aria-label={`View challenges on ${topic.attributes.Topic}`} className="desktop-100">
        {renderTopicMedia(topic.attributes.FeaturedMedia)}
      </a>
      {showChallenge && challenge ?
        <div className="challenge">
          <div className="pad">
            <h3>{challenge.attributes.Title}</h3>
            <p>{challenge.attributes.Content}</p>
            {renderChallengeMedia(challenge.attributes.FeaturedMedia)}
          </div>
        </div>
        :
        ''
      }
    </div>
  );
}
