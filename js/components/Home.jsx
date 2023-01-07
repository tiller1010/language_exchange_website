import React from 'react';
import axios from 'axios';
import lozad from 'lozad';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
import VideoSearchForm from './VideoSearchForm.js';
import VideoPlayer from './VideoPlayer.js';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.js';
import TopicLink from './TopicLink.js';
import LessonsFeed from './LessonsFeed.js';
import HomepageBanner from './HomepageBanner.js';
import decipher from '../decipher.js';

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

class Home extends React.Component {
  constructor(){
    super();
    this.state = {
      recentVideos: [],
      userLikedVideos: [],
      loaded: false,
    }
    this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
  }

  componentDidMount(){
    const myDecipher = decipher(process.env.PROP_SALT);

    let userLikedVideos = [];
    if (this.props.isLive) {
      let encryptedProps = myDecipher(this.props.p);
      encryptedProps = JSON.parse(encryptedProps);
      userLikedVideos = encryptedProps.userLikedVideos;
      this.setState({
        userID: encryptedProps.userID,
      });
    } else {
      userLikedVideos = JSON.parse(this.props.userLikedVideos);
      this.setState({
        userID: this.props.userID,
      });
    }

    // Get recent videos
    axios.get(`${document.location.origin}/recent-videos`)
      .then(res => {
        this.setState({
          recentVideos: res.data.videos
        }, () => {// Check if the current user has liked each video
          let likedRecentVideos = [];
          if(userLikedVideos){
            this.setState({
              userLikedVideos,
            }, () => {
              this.state.recentVideos.forEach((video) => {
                video.likedByCurrentUser = this.currentUserHasLikedVideo(video);
                likedRecentVideos.push(video);
              });
              this.setState({
                recentVideos: likedRecentVideos
              });
            });
          }
        });
      });
  }

  currentUserHasLikedVideo(video){
    let liked = false;
    this.state.userLikedVideos.forEach((userLikedVideo) => {
      if(userLikedVideo._id === video._id){
        liked = true;
      }
    });
    return liked;
  }

  render(){

    const { loaded } = this.state;

    return (
      <div>
        <Navigation/>

        <HomepageBanner/>

        <div className="pure-u-g fw-typography-spacing">

          <section>
            <div className="fw-container">
              <div className="fw-space">

                <div className="fw-space double noleft noright">
                  <h2>Learn from free resources and challenges.</h2>
                  <hr/>
                </div>

                <LessonsFeed HideClearFilters={true}/>

              </div>
            </div>
          </section>

          <section className="grey-section">
            <div className="fw-container">
              <div className="fw-space">

                <div className="fw-space double noleft noright">
                  <h2>Browse and upload words and phrases.</h2>
                  <hr/>
                </div>

                <div className="page-form">
                  <VideoSearchForm
                    keywords=""
                    sort="Recent"
                  />
                </div>

                {this.state.recentVideos.length ?
                  <div className="pad no-x">
                    <h2>Recent User Uploads</h2>
                    <Slider {...{
                      dots: false,
                      infinite: false,
                      speed: 500,
                      slidesToShow: 3,
                      slidesToScroll: 1,
                      responsive: [
                        {
                          breakpoint: 1024,
                          settings: {
                            slidesToShow: 1.5
                          }
                        }
                      ]
                    }}>
                      {this.state.recentVideos.map((video) =>
                        <div key={video._id}>
                          <VideoPlayer
                            _id={video._id}
                            title={video.title}
                            languageOfTopic={video.languageOfTopic}
                            src={video.src}
                            thumbnailSrc={video.thumbnailSrc}
                            uploadedBy={video.uploadedBy}
                            likes={video.likes}
                            likedByCurrentUser={this.currentUserHasLikedVideo(video)}
                            authenticatedUserID={this.state.userID}
                          />
                        </div>
                      )}
                    </Slider>
                  </div>
                  :
                  ''
                }

              </div>
            </div>
          </section>

          <section>
            <div className="fw-container">
              <div className="frame normaltop">

                <div className="fw-space double noleft noright">
                  <h2>Chat with a native speaker.</h2>
                  <hr/>
                </div>

                <div className="desktop-100">
                  <PremiumVideoChatListingFeed authenticatedUserID={this.state.userID} HideClearFilters={true}/>
                </div>

              </div>
            </div>
          </section>

        </div>

      </div>
    );
  }
}

export default Home;
