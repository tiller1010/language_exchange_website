import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCheck, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
const languages = require('language-list')();
import graphQLFetch from '../graphQLFetch.js';
import PremiumVideoChatListing from './PremiumVideoChatListing.js';
import RemoveConfirmationModal from './RemoveConfirmationModal.js';
import LanguageSelector from './LanguageSelector.js';

function findInputElement(element) {
  if (!element) return;
  let answerElement = element.querySelector('input');
  if (!answerElement) {
    return findInputElement(element.parentElement)
  } else {
    return answerElement;
  }
}

interface User {
  _id: string;
  displayName: string
  premiumVideoChatListing?: PremiumVideoChatListingObject
}

interface PremiumVideoChatListingObject {
  _id: string;
  topic: string;
  languageOfTopic: string
  duration: string
  price: number
  currency: string
  thumbnailSrc: string
  userID: string
  timeSlots: VideoChatTimeSlot[]
}

interface VideoChatTimeSlot {
  customerUserID?: string
  date: string
  time: string
  completed?: boolean
  booked?: boolean
  paid?: boolean
}

interface PremiumVideoChatListingFormState {
  topic: string;
  languageOfTopic: string
  duration: string
  price: number
  currency: string
  timeSlots?: VideoChatTimeSlot[]
  thumbnailSrc: string
  thumbnailFile?: File
  savedPremiumVideoChatListing?: PremiumVideoChatListingObject
  savedAllChanges: boolean
}

interface PremiumVideoChatListingFormProps {
  user: User
}

export default class PremiumVideoChatListingForm extends React.Component<PremiumVideoChatListingFormProps, PremiumVideoChatListingFormState>{
  constructor(props: PremiumVideoChatListingFormProps) {
    super(props);
    let state: PremiumVideoChatListingFormState = {
      topic: '',
      languageOfTopic: '',
      duration: '',
      price: 0,
      currency: 'usd',
      thumbnailSrc: '',
      timeSlots: [
        {
          date: '',
          time: '',
          completed: false,
          booked: false,
          paid: false,
        }
      ],
      savedAllChanges: true,
    }
    this.state = state;
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
    this.handleTimeSlotChange = this.handleTimeSlotChange.bind(this);
    this.handleRemoveTimeSlot = this.handleRemoveTimeSlot.bind(this);
    this.handleAddTimeSlot = this.handleAddTimeSlot.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteListing = this.handleDeleteListing.bind(this);
  }

  componentDidMount() {
    if (this.props.user.premiumVideoChatListing) {
      this.setState({ ...this.props.user.premiumVideoChatListing });
      this.setState({ savedPremiumVideoChatListing: this.props.user.premiumVideoChatListing });
    }

    // Make sure generated buttons effect state
    const numericButtonsCheck = setInterval(() => {
      const generatedButtons = document.querySelectorAll('.field.numeric > span')
      if (generatedButtons.length === 2) {
        clearInterval(numericButtonsCheck)
        generatedButtons.forEach((controlIcon) => {
          controlIcon.addEventListener('click', (e) => {
            // @ts-ignore
            const input = findInputElement(e.target.parentElement);
            this.handlePriceChange({ target: { value: input.value } });
          });
        });
      }
    }, 100);
  }

  handlePriceChange(event) {
    this.setState({price: Number(event.target.value), savedAllChanges: false});
  }

  handleThumbnailChange(event) {
    const context = this;
    const image = event.target.files[0];
    context.setState({
      thumbnailFile: image,
    savedAllChanges: false,
    });
    if (image) {
      // Set preview
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        if (typeof reader.result === 'string') {
          if (/jpeg|jpg|png/.test(reader.result.substr(0, 20))) {
            context.setState({thumbnailSrc: reader.result});
          } else {
            alert('Invalid thumbnail format.');
          }
        } else {
          alert('Invalid upload.');
        }

      }, false);
      reader.readAsDataURL(image);
    }
  }

  handleTimeSlotChange(valueKey, value, timeSlotIndex) {
    let { timeSlots } = this.state;
    let timeSlot = timeSlots[timeSlotIndex];
    timeSlot[valueKey] = value;
    timeSlots[timeSlotIndex] = timeSlot;
    this.setState({
      timeSlots,
      savedAllChanges: false,
    })
  }

  handleRemoveTimeSlot(e, timeSlotIndex) {
    e.preventDefault();
    let { timeSlots } = this.state;
    timeSlots.splice(timeSlotIndex, 1);
    this.setState({
      timeSlots,
      savedAllChanges: false,
    });
  }

  handleAddTimeSlot(e) {
    e.preventDefault();
    this.setState({
      timeSlots: [
        ...this.state.timeSlots,
        {
          date: '',
          time: '',
          completed: false,
          booked: false,
          paid: false,
        }
      ]
    });
    // Triggers fw effects for new elements
    setTimeout(() => {
      window.dispatchEvent(new Event('load'));
    }, 100);
  }

  async handleSubmit(event) {

    event.preventDefault();

    event.target.parentElement.parentElement.append((new DOMParser()).parseFromString('<div class="lds-facebook"><div></div><div></div><div></div></div>', 'text/html').body);

    let {
      topic,
      languageOfTopic,
      duration,
      price,
      currency,
      thumbnailSrc,
      thumbnailFile,
      timeSlots,
      savedPremiumVideoChatListing
    } = this.state;

    let { user } = this.props;

    if (user && topic && languageOfTopic && duration && thumbnailSrc) {
      let query;
      let variables;
      let mutationName;
      if (savedPremiumVideoChatListing) {
        // If updating existing
        query = `mutation updatePremiumVideoChatListing($listingID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload) {
          updatePremiumVideoChatListing(listingID: $listingID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file) {
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
        }`;
        variables = {
          listingID: savedPremiumVideoChatListing._id,
          premiumVideoChatListing: {
            topic,
            languageOfTopic,
            duration,
            price,
            currency,
            timeSlots,
          }
        };
        if (thumbnailFile) {
          variables.file = thumbnailFile;
        }
        mutationName = 'updatePremiumVideoChatListing';
      } else {
        // If adding new
        query = `mutation addPremiumVideoChatListing($userID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload) {
          addPremiumVideoChatListing(userID: $userID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file) {
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
        }`;
        variables = {
          userID: user._id,
          premiumVideoChatListing: {
            topic,
            languageOfTopic,
            duration,
            price,
            currency,
            timeSlots,
          },
          file: thumbnailFile
        };
        mutationName = 'addPremiumVideoChatListing';
      }
      const data = await graphQLFetch(query, variables, thumbnailFile ? true : false);
      this.setState({
        savedPremiumVideoChatListing: data[mutationName],
        savedAllChanges: true,
      });

      document.querySelector('.lds-facebook').remove();

    } else {
      const missingFields = [
        { value: topic, label: 'topic' },
        { value: languageOfTopic, label: 'language' },
        { value: duration, label: 'duration' },
        { value: thumbnailSrc, label: 'thumbnail' },
      ].filter(field => !field.value);
      const missingFieldsString: string = missingFields.map(field => field.label).join(', ');
      alert('Missing fields: ' + missingFieldsString);
    }

    // DEBUG UPLOAD
    // const query = `mutation addPremiumVideoChatListingThumbnailTest($file: Upload) {
    //   addPremiumVideoChatListingThumbnailTest(thumbnailFile: $file) {
    //     thumbnailSrc
    //   }
    // }`;
    // const data = await graphQLFetch(query, {
    //   file: thumbnailFile
    // }, true);
  }

  async handleDeleteListing() {

    const { user } = this.props;

    // If adding new
    const query = `mutation removePremiumVideoChatListing($userID: ID!) {
      removePremiumVideoChatListing(userID: $userID)
    }`;
    const variables = {
      userID: user._id
    };
    const data = await graphQLFetch(query, variables);
    const emptyListingObject = {
      topic: '',
      languageOfTopic: '',
      duration: '',
      thumbnailSrc: ''
    }
    this.setState({
      ...emptyListingObject,
      savedPremiumVideoChatListing: null
    });
  }

  render() {

    let {
      topic,
      languageOfTopic,
      duration,
      price,
      currency,
      thumbnailSrc,
      timeSlots,
      savedPremiumVideoChatListing
    } = this.state;

    price = price.toFixed(2);

    let { user } = this.props;

    return(
      <div className="pure-g">
        <h2 className="pure-u-1">Video chat listing</h2>
        <form className="pure-u-1 fw-form">
          <div className="flex-container desktop-100">
            <div className="desktop-50 phone-100">
              <div className="field text">
                <label htmlFor="topicField">Topic</label>
                <input type="text" name="topic" id="topicField" value={topic} onChange={(event) => this.setState({topic: event.target.value, savedAllChanges: false})}/>
              </div>
              <LanguageSelector name="languageOfTopic" id="languageOfTopicField" onChange={(event) => this.setState({languageOfTopic: event.target.value, savedAllChanges: false})} value={languageOfTopic}/>
              <div className="field text">
                <label htmlFor="durationField">Duration</label>
                <input type="text" name="duration" id="durationField" placeholder="5 minutes" value={duration} onChange={(event) => this.setState({duration: event.target.value, savedAllChanges: false})}/>
              </div>
              <div className="field numeric">
                <label htmlFor="priceField">Price</label>
                <input type="number" min="0.50" step="0.01" name="price" id="priceField" value={price} onChange={this.handlePriceChange}/>
                <p><i>Application fees will be applied</i></p>
              </div>
              <div className="field text">
                <label htmlFor="currencyField">Currency</label>
                <input type="text" name="currency" id="currencyField" value={currency} onChange={(event) => this.setState({currency: event.target.value, savedAllChanges: false})}/>
              </div>
            </div>

            <div className="desktop-20 phone-100" style={{ maxHeight: '385px', overflowY: 'auto' }}>
              <div className="fw-space notop">
                {timeSlots.length ?
                  <>
                    {timeSlots.map((timeSlot) =>
                      <div key={timeSlots.indexOf(timeSlot)}>
                        <div className="field text">
                          <label htmlFor={`date[${timeSlots.indexOf(timeSlot)}]`}>Date</label>
                          <input type="date" name={`date[${timeSlots.indexOf(timeSlot)}]`} id={`date[${timeSlots.indexOf(timeSlot)}]`} value={timeSlot.date} onChange={(e) => this.handleTimeSlotChange('date', e.target.value, timeSlots.indexOf(timeSlot))}/>
                        </div>
                        <div className="field text">
                          <label htmlFor={`time[${timeSlots.indexOf(timeSlot)}]`}>Time</label>
                          <input type="time" name={`time[${timeSlots.indexOf(timeSlot)}]`} id={`time[${timeSlots.indexOf(timeSlot)}]`} value={timeSlot.time} onChange={(e) => this.handleTimeSlotChange('time', e.target.value, timeSlots.indexOf(timeSlot))}/>
                        </div>
                        <button className="button" onClick={(e) => this.handleRemoveTimeSlot(e, timeSlots.indexOf(timeSlot))}>
                          Remove Time
                          <FontAwesomeIcon icon={faTimes}/>
                        </button>
                      </div>
                    )}
                  </>
                  :
                  ''
                }
                <button className="button" onClick={(e) => this.handleAddTimeSlot(e)}>
                  Add time slot
                  <FontAwesomeIcon icon={faPlus}/>
                </button>
              </div>
            </div>

            <div className="desktop-30 phone-100">
              <div className="desktop-100" style={{ maxWidth: '100%', height: '300px' }}>
                <div className="pad" style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
                  <div className="thumbnail-preview img-container" style={{ height: '100%', width: '100%', background: `url(${ thumbnailSrc }) no-repeat center center/cover` }}></div>
                </div>
              </div>
              <div className="upload-container">
                <input type="file" name="thumbnail" onChange={this.handleThumbnailChange}/>
                <label htmlFor="thumbnail">
                  Thumbnail
                  <FontAwesomeIcon icon={faUpload}/>
                </label>
              </div>

              <div>
                <button className="button" onClick={this.handleSubmit} disabled={this.state.savedAllChanges}>
                  {this.state.savedAllChanges ? 'Saved' : 'Save'}
                  <FontAwesomeIcon icon={faCheck}/>
                </button>
              </div>
            </div>

          </div>
        </form>
        <div className="pure-u-1 flex-container flex-horizontal-center">
          {savedPremiumVideoChatListing ?
            <div className="desktop-100">
              <h3>Your saved Video Chat Listing</h3>
              <PremiumVideoChatListing premiumVideoChatListing={savedPremiumVideoChatListing} authenticatedUserID={user._id} view={user._id == savedPremiumVideoChatListing.userID ? 'owner' : 'customer'}/>
              <form>
                <a className="button" href="#remove-listing" style={{ display: 'block', marginLeft: 'auto', width: 'max-content' }}>
                  Remove Listing
                  <FontAwesomeIcon icon={faTrash}/>
                </a>
              </form>
              <RemoveConfirmationModal
                buttonText="Remove Listing"
                buttonAnchor="remove-listing"
                modalTitle="Remove Listing"
                modalContent="Are you sure you want to remove this listing?"
                handleDelete={this.handleDeleteListing}
              />
            </div>
            :
            ''
          }
        </div>
      </div>
    );
  }
}
