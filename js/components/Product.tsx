import * as React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { getConnectedStripeAccountID } from '../getConnectedStripeAccountID.js';

interface ProductObject {
  userID: string;
  cost: number;
  currency: string;
  orderedOn: string;
  productObject: any;
  productObjectCollection: string;
  priceID: string;
  status: string;
}

interface ProductProps {
  product: ProductObject
}

interface ProductState {
  ownerDisplayName: string;
}

export default class Product extends React.Component<ProductProps, ProductState> {
  constructor(props: ProductProps){
    super(props);
    let state: ProductState = {
      ownerDisplayName: '',
    }
    this.state = state;
    this.handleCompletePurchase = this.handleCompletePurchase.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
  }

  async componentWillMount(){
    const ownerDisplayName = await this.getUserNameByID(this.props.product.productObject.userID);
    this.setState({
      ownerDisplayName,
    });
  }

  async getUserNameByID(userID){
    const user = await fetch(`/user/${userID}`)
      .then((response) => response.json());
    return user.displayName;
  }

  async handleCompletePurchase(e) {

    // Mock submit for fw-form-process-event effect
    // const mockForm = document.createElement('form');
    // document.querySelector('.fw-form-process-event').append(mockForm);
    // let submitEvent = new Event('submit');
    // submitEvent.submitter = e.target;
    // mockForm.dispatchEvent(submitEvent);
    e.target.parentElement.parentElement.append((new DOMParser()).parseFromString('<div class="lds-facebook"><div></div><div></div><div></div></div>', 'text/html').body);

    const { product } = this.props;

    // Get the user that made the product
    const productUser = await fetch(`/user/${product.productObject.userID}`)
      .then((response) => response.json());

    const connectedStripeAccountID = getConnectedStripeAccountID(productUser);

    if (connectedStripeAccountID) {

      const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

      fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceID: product.priceID,
          connectedStripeAccountID,
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function(result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
          alert(result.error.message);
        }
      });
    }
  }

  renderProduct(product){
    const productObject = product.productObject;
    switch(product.productObjectCollection){
      case 'premium_video_chat_listings':
        let { timeSlots } = productObject;
        if(!timeSlots){
          timeSlots = [];
        }
        return (
          <>
          <div className="thumbnail-preview img-container">
            <img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={productObject.thumbnailSrc} alt={productObject.thumbnailSrc}/>
          </div>
          <div className="fw-space noleft noright">
            <h3 style={{ marginBottom: '5px' }}>Topic: {productObject.topic}</h3>
            <h4>Language: {productObject.languageOfTopic}</h4>
          </div>
          {timeSlots.length ?
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {timeSlots.map((timeSlot) =>
                <div key={timeSlots.indexOf(timeSlot)}>
                  <p><b>Video Chat with: {this.state.ownerDisplayName}</b></p>
                  <p><b>{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</b></p>
                  <a className="button" href={`/video-chat?withUserID=${productObject.userID}`} aria-label={`Go to Video Chat with ${this.state.ownerDisplayName}`}>
                    Go to Video Chat
                    <FontAwesomeIcon icon={faLongArrowAltRight}/>
                  </a>
                </div>
              )}
            </div>
            :
            ''
          }
          </>
        );
    }
  }

  render(){

    const { product } = this.props;
    let cost = product.cost;
    cost = cost / 100;
    cost = cost.toFixed(2);

    return (
      <div className="fw-form fw-form-process-event">
        {this.renderProduct(product)}
        <p>Cost: {cost} {product.currency}</p>
        <p>Ordered on: {product.orderedOn}</p>
        {product.status == 'Unpaid' ?

          <p>
            Status: <b>{product.status}:</b>&nbsp;
            <button className="button" onClick={this.handleCompletePurchase}>
              Complete Purchase
              <FontAwesomeIcon icon={faLongArrowAltRight}/>
            </button>
          </p>
          :
          <p>Status: {product.status}</p>
        }
      </div>
    );
  }
}
