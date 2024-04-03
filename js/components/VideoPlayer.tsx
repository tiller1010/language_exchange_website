import * as React from 'react';
import ReadMore from '@jamespotz/react-simple-readmore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
import MediaRenderer from './MediaRenderer.js';

interface User {
  _id: string;
  displayName: string;
}

interface VideoPlayerState {
  likes: number;
  likedByCurrentUser: boolean;
}

interface VideoPlayerProps {
  _id: string;
  title: string;
  languageOfTopic?: string;
  src: string;
  thumbnailSrc: string;
  uploadedBy: User;
  likes: number;
  likedByCurrentUser: boolean;
  authenticatedUserID: string;
  authenticatedUserIsAdmin?: boolean;
  handleDeleteVideo: Function;
  afterToggleLike: Function;
}

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
  constructor(props: VideoPlayerProps){
    super(props);
    let state: VideoPlayerState = {
      likes: 0,
      likedByCurrentUser: false
    }
    this.state = state;
    this.toggleLike = this.toggleLike.bind(this);
  }

  componentDidMount(){
    const { likes, likedByCurrentUser } = this.props;
    this.setState({
      likes,
      likedByCurrentUser
    });
  }

  componentDidUpdate(prevProps){
    if(this.props.likedByCurrentUser != prevProps.likedByCurrentUser){
      this.setState({
        likedByCurrentUser: this.props.likedByCurrentUser
      });
    }
    if(this.props.likes != prevProps.likes){
      this.setState({
        likes: this.props.likes
      });
    }
  }

  async toggleLike(videoID){
    if(!this.props.authenticatedUserID){
      alert('Must be signed in to send like.');
      return;
    }
    const apiSegment = this.state.likedByCurrentUser ? 'removeLike' : 'addLike';
    const query = `mutation addLike($userID: ID!, $videoID: ID!){
      ${apiSegment}(userID: $userID, videoID: $videoID){
        _id
        title
         languageOfTopic
        src
        originalName
        thumbnailSrc
        originalThumbnailName
        created
        likes
        uploadedBy {
          _id
          displayName
        }
      }
    }`;
    const data = await graphQLFetch(query, {
      userID: this.props.authenticatedUserID,
      videoID: videoID
    });
    const newVideo = data[apiSegment];

    if(newVideo.message){
      // Display error message if included in response
      alert(newVideo.message);
    }

    this.setState(prevState => ({
      likes: newVideo.likes,
      likedByCurrentUser: !prevState.likedByCurrentUser
    }));

    if(this.props.afterToggleLike){
      this.props.afterToggleLike(newVideo, this.state.likedByCurrentUser);
    }
  }

  render(){

    const { likes, likedByCurrentUser } = this.state;
    const {
      _id,
      title,
      languageOfTopic,
      uploadedBy,
      src,
      thumbnailSrc,
      handleDeleteVideo,
      authenticatedUserIsAdmin,
    } = this.props;

    const canEdit = handleDeleteVideo || authenticatedUserIsAdmin;

    return (
      <div style={{ position: 'relative' }}>
        <div className="flex x-center">
          <div className="desktop-100" style={{ maxWidth: '400px' }}>
            <div className="flex x-space-between y-center" style={{ flexWrap: 'nowrap' }}>
              <div style={{ maxWidth: '65%' }}>
                <ReadMore
                        fade
                        minHeight={65}
                        btnStyles={{
                          position: 'absolute',
                          bottom: '-30px',
                          border: '1px solid #000',
                          borderRadius: '5px',
                          margin: 0,
                          padding: '5px',
                          zIndex: 1,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                  <h3>{title}</h3>
                  {languageOfTopic ?
                    <h4>{languageOfTopic}</h4>
                    :
                    ''
                  }
                </ReadMore>
              </div>
              {handleDeleteVideo ?
                <form action="/videos/remove" method="POST" className="fw-form">
                  <input type="hidden" name="videoID" value={this.props._id}/>
                  <a className="button" style={{ position: 'absolute', right: '-10px', bottom: '150px', height: '36px' }} href="#remove-video" title="Remove Video" onClick={(event) => this.props.handleDeleteVideo(event)}>
                    <FontAwesomeIcon icon={faTrash}/>
                  </a>
                </form>
                :
                ''
              }
              {canEdit ?
                <div>
                  <a className="button" style={{ position: 'absolute', right: '-10px', bottom: '190px', height: '36px' }} href={`/videos/edit/${this.props._id}`} title="Edit Video">
                    <FontAwesomeIcon icon={faEdit}/>
                  </a>
                </div>
                :
                ''
              }
              {uploadedBy._id ?
                <div>
                  <p>By: <a href={`/account-profile/${uploadedBy._id}`} aria-label={`${uploadedBy.displayName} profile`}>{uploadedBy.displayName}</a></p>
                </div>
                :
                <div>
                  <p>By: {uploadedBy.displayName}</p>
                </div>
              }
            </div>
            <MediaRenderer src={src} thumbnailSrc={thumbnailSrc}/>
          </div>
        </div>
        <div className="flex x-space-around y-center">
          <p>Likes: {likes || 0}</p>
            <button className="button" onClick={() => this.toggleLike(_id)}>
            {likedByCurrentUser ?
              <span>
                Liked
                <FontAwesomeIcon icon={faStar}/>
              </span>
              :
              <span>
                Like
                <FontAwesomeIcon icon={farStar}/>
              </span>
            }
            </button>
        </div>
      </div>
    );
  }
}
