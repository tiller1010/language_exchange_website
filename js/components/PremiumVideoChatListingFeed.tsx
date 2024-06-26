import * as React from 'react';
import PremiumVideoChatListing from './PremiumVideoChatListing.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBan } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
import Slider from 'react-slick';
import LanguageSelector from './LanguageSelector.js';

interface PremiumVideoChatListingObject {
  topic: string;
  languageOfTopic: string;
  thumbnailSrc: string;
  userID: string;
  timeSlots: [VideoChatTimeSlot?];
}

interface VideoChatTimeSlot {
  customerUserID?: string;
  time: string;
  completed?: boolean;
  booked?: boolean;
  paid?: boolean;
}

interface PremiumVideoChatListingFeedState {
  topic: string;
  languageOfTopic: string;
  premiumVideoChatListings?: [PremiumVideoChatListingObject?];
  loaded: boolean;
}

interface PremiumVideoChatListingFeedProps {
  initialPremiumVideoChatListings?: [PremiumVideoChatListingObject?]
  authenticatedUserID?: string
  SearchFormHeading?: string;
  HideClearFilters?: boolean;
}

export default class PremiumVideoChatListingFeed extends React.Component<PremiumVideoChatListingFeedProps, PremiumVideoChatListingFeedState>{
  constructor(props: PremiumVideoChatListingFeedProps){
    super(props);
    let state: PremiumVideoChatListingFeedState = {
      topic: '',
      languageOfTopic: '',
      premiumVideoChatListings: [],
      loaded: false,
    }
    this.state = state;
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  async componentDidMount(){

    const query = `query getRecentPremiumVideoChatListings{
      getRecentPremiumVideoChatListings{
        listings {
          _id
          topic
          languageOfTopic
          duration
          price
          currency
          thumbnailSrc
          userID
          timeSlots {
            date
            time
            customerUserID
            completed
            booked
            paid
          }
        }
      }
    }`;
    const data = await graphQLFetch(query);
    if(data.getRecentPremiumVideoChatListings){
      if(data.getRecentPremiumVideoChatListings.listings){
        this.setState({
          premiumVideoChatListings: data.getRecentPremiumVideoChatListings.listings,
          loaded: true,
        });
      }
    }
  }

  handleLanguageChange(event) {
    this.setState({ languageOfTopic: event.target.value });
    // const searchButton = event.target.form.querySelector('button[value="Search"]');
    // searchButton.contentEditable = true; // Trick browser to use ":focus-within" for outline effect
    // searchButton.focus();
    // setTimeout(() => {
    //   searchButton.contentEditable = false;
    // }, 1)
  }

  async handleSearchSubmit(event){

    event.preventDefault();

    let {
      topic,
      languageOfTopic
    } = this.state;
    topic = topic.replace(/\s$/, '');

    const query = `query searchPremiumVideoChatListings($topic: String, $languageOfTopic: String){
      searchPremiumVideoChatListings(topic: $topic, languageOfTopic: $languageOfTopic){
        listings {
          _id
          topic
          languageOfTopic
          duration
          price
          currency
          thumbnailSrc
          userID
          timeSlots {
            date
            time
            customerUserID
            completed
            booked
            paid
          }
        }
      }
    }`;
    const data = await graphQLFetch(query, {
      topic,
      languageOfTopic,
    });
    if(data.searchPremiumVideoChatListings){
      if(data.searchPremiumVideoChatListings.listings){
        this.setState({
          premiumVideoChatListings: data.searchPremiumVideoChatListings.listings
        });
      }
    }
  }

  render(){

    const { authenticatedUserID } = this.props;

    let {
      premiumVideoChatListings,
      topic,
      languageOfTopic,
      loaded,
    } = this.state;

    return(
      <section>
        <div className="page-form" style={{ marginBottom: '60px' }}>
          { this.props.SearchFormHeading ? <h1 style={{ textAlign: 'right' }}>{this.props.SearchFormHeading}</h1> : '' }
          <form className="fw-form search-form">
            <div className="flex-container flex-vertical-stretch">
              <div className="field text tablet-100">
                <label htmlFor="topicField">Topic</label>
                <input type="text" name="topic" id="topicField" value={topic} onChange={(event) => this.setState({topic: event.target.value})}/>
              </div>
              <div className="flex-container tablet-100" style={{ flexWrap: 'nowrap' }}>
                <div className="tablet-100">
                  <LanguageSelector name="languageOfTopic" id="videoChat_languageOfTopicField" onChange={this.handleLanguageChange} value={languageOfTopic} required={false}/>
                </div>
                <button value="Search" className="button tablet-20" onClick={this.handleSearchSubmit} style={{ borderRadius: '0 5px 5px 0' }}>
                  Search
                  <FontAwesomeIcon icon={faSearch}/>
                </button>
              </div>
            </div>
          </form>
          {!this.props.HideClearFilters ?
            <div>
              <a href="/chats" aria-label="Clear filters" className="button">
                Clear filters
                <FontAwesomeIcon icon={faBan}/>
              </a>
            </div>
            :
            ''
          }
        </div>
        {premiumVideoChatListings.length ?
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
            {premiumVideoChatListings.map((listing) =>
              <div key={premiumVideoChatListings.indexOf(listing)}>
                <PremiumVideoChatListing premiumVideoChatListing={listing} authenticatedUserID={authenticatedUserID} view={authenticatedUserID == listing.userID ? 'owner' : 'customer'}/>
              </div>
            )}
          </Slider>
          :
          <>{loaded ? <p>No video chats found</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
        }
      </section>
    );
  }
}
