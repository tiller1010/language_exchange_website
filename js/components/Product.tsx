import * as React from 'react';

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
				if(timeSlots){
					// timeSlots = timeSlots.filter((timeSlot) => timeSlot.customerUserID == product.userID);
				} else {
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
						timeSlots.map((timeSlot) => 
							<div key={timeSlots.indexOf(timeSlot)}>
								<a href={`/video-chat?withUserID=${productObject.userID}`}>Video Chat with User: {this.state.ownerDisplayName} on {timeSlot.time}</a>
							</div>
						)
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