import React from 'react';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome, faSlidersH, faBan } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';
import VideoSearchForm from './VideoSearchForm.js';
import Slider from 'react-slick';
import VideoPlayer from './VideoPlayer.js';
import decipher from '../decipher.js';

function getVideosSearchString(pageNumber = null) {
  var urlParams = new URLSearchParams(window.location.search);
  var keywords = urlParams.get('keywords') || '';
  var languageOfTopic = urlParams.get('languageOfTopic') || '';
  var page = pageNumber || urlParams.get('page');
  var sort = urlParams.get('sort') || 'Recent';
  var search = new URLSearchParams({ keywords, languageOfTopic, page, sort });
  return search.toLocaleString();
}

async function getVideos(){
  var searchString = getVideosSearchString();
  return fetch(`${document.location.origin}/videos.json?${searchString}`, { credentials: 'include' })
    .then((response) => response.json());
}

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

class VideosIndex extends React.Component {
  constructor(){
    super();
    this.state = {
      videos: [],
      pages: [],
      currentPage: 1,
      userLikedVideos: [],
      loaded: false,
    }
    this.refreshVideos = this.refreshVideos.bind(this);
    this.pagination = this.pagination.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
  }

  async componentDidMount(){
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

    this.refreshVideos();
    this.setState({
      userLikedVideos,
    });
  }

  async refreshVideos(){
    var urlParams = new URLSearchParams(window.location.search);
    var page = urlParams.get('page') || 1;

    var newVideos = await getVideos();
    if(newVideos){
      // Check if the current user has liked each video
      newVideos.videos.forEach((video) => {
        video.likedByCurrentUser = this.currentUserHasLikedVideo(video);
      });

      this.setState({
        videos: newVideos.videos,
        pages: this.pagination(newVideos.pages),
        currentPage: page,
        loaded: true,
      });
    }
  }

  handleChangePage(event){
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    this.refreshVideos();
  }

  handleSearch(event){
    event.preventDefault();
    var url = event.target.action + '?' + (new URLSearchParams(new FormData(event.target)).toString());
    window.history.pushState({}, '', url);
    this.refreshVideos();
  }

  pagination(pages){
    var pageLinks = [];
    for(var i = 1; i <= pages; i++){
      pageLinks.push({pageNumber: i});
    }
    return pageLinks;
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

    var urlParams = new URLSearchParams(window.location.search);
    var keywords = urlParams.get('keywords') || '';
    var languageOfTopic = urlParams.get('languageOfTopic') || '';
    var sort = urlParams.get('sort') || 'Recent';
    var context = this;

    // When using back or forward buttons in browser
    window.addEventListener('popstate', function(event){
      if(event != null){
        context.refreshVideos();
      }
    });

    return (
      <div className="frame fw-container">
        <Navigation/>
        <div className="page-form">
          <h1 style={{ textAlign: 'right' }}>Words and phrases from users</h1>
          <VideoSearchForm
            keywords={keywords}
            languageOfTopic={languageOfTopic}
            sort={sort}
          />
            <div className="flex">
              <div>
              <button className="button" onClick={this.refreshVideos}>
                Refresh
                    <FontAwesomeIcon icon={faSync}/>
              </button>
              </div>
              <span>&nbsp;</span>
              <div>
                <a onClick={this.handleChangePage} href="/videos" className="button">
                  Clear filters
                    <FontAwesomeIcon icon={faBan}/>
                </a>
              </div>
            </div>
          </div>

        <div>
          {this.state.pages.length ?
            <ul className="pagination flex">
              {this.state.currentPage > 1 ?
                <li>
                  <a onClick={this.handleChangePage}
                    href={`/videos?${getVideosSearchString(Number(this.state.currentPage) - 1)}`}
                    className="button icon-left"
                    aria-label="previous"
                  >
                        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
                    Prev
                  </a>
                </li>
                :
                ''
              }
              {this.state.pages.map((page) =>
                <li key={this.state.pages.indexOf(page)}>
                  <a onClick={this.handleChangePage}
                    href={`/videos?${getVideosSearchString(page.pageNumber)}`}
                    className={`button no-icon ${page.pageNumber == this.state.currentPage ? 'selected' : ''}`}
                    aria-label={`page ${page.pageNumber}`}
                  >
                    {page.pageNumber}
                  </a>
                </li>
              )}
              {this.state.currentPage < this.state.pages.length ?
                <li>
                  <a onClick={this.handleChangePage}
                    href={`/videos?${getVideosSearchString(Number(this.state.currentPage) + 1)}`}
                    className="button"
                  >
                    Next
                    <FontAwesomeIcon icon={faLongArrowAltRight}/>
                  </a>
                </li>
                :
                ''
              }
            </ul>
            :
            <p></p>
          }
          {this.state.videos.length ?
              <div className="flex">
              {this.state.videos.map((video) =>
                <div key={video._id} className="pure-u-1 pure-u-lg-1-3">
                  <div style={{ padding: '0 10px' }}>
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
                </div>
              )}
            </div>
            :
            <>{loaded ? <p>No user uploads found</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
          }
          {this.state.pages.length ?
            <ul className="pagination flex">
              {this.state.currentPage > 1 ?
                <li>
                  <a onClick={this.handleChangePage}
                    href={`/videos?${getVideosSearchString(Number(this.state.currentPage) - 1)}`}
                    className="button icon-left"
                    aria-label="previous"
                  >
                        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
                    Prev
                  </a>
                </li>
                :
                ''
              }
              {this.state.pages.map((page) =>
                <li key={this.state.pages.indexOf(page)}>
                  <a onClick={this.handleChangePage}
                    href={`/videos?${getVideosSearchString(page.pageNumber)}`}
                    className={`button no-icon ${page.pageNumber == this.state.currentPage ? 'selected' : ''}`}
                    aria-label={`page ${page.pageNumber}`}
                  >
                    {page.pageNumber}
                  </a>
                </li>
              )}
              {this.state.currentPage < this.state.pages.length ?
                <li>
                  <a onClick={this.handleChangePage}
                    href={`/videos?${getVideosSearchString(Number(this.state.currentPage) + 1)}`}
                    className="button"
                  >
                    Next
                    <FontAwesomeIcon icon={faLongArrowAltRight}/>
                  </a>
                </li>
                :
                ''
              }
            </ul>
            :
            <p></p>
          }
        </div>

          <div className="small-pad">
            <a href="/videos/add" className="button">
              <span>Upload a word or phrase</span>
                <FontAwesomeIcon icon={faPlus}/>
            </a>
          </div>

      </div>
    );
  }
}

export default VideosIndex;
