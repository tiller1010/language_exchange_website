import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

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
					<p>Topic: {productObject.topic}</p>
					<p>Language: {productObject.language}</p>
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

		return (
			<div>
				{this.renderProduct(product)}
				<p>Cost: {product.cost} {product.currency}</p>
				<p>Ordered on: {product.orderedOn}</p>
				<p>Status: {product.status}</p>
			</div>
		);
	}
}