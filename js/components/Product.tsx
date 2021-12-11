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
}

export default class Product extends React.Component<ProductProps, ProductState> {
	constructor(props: ProductProps){
		super(props);
		let state: ProductState = {
		}
		this.state = state;
		this.renderProduct = this.renderProduct.bind(this);
	}

	renderProduct(product){
		const productObject = product.productObject;
		switch(product.productObjectCollection){
			case 'premium_video_chat_listings':
				return (
					<>
					<div className="thumbnail-preview img-container">
						<img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={productObject.thumbnailSrc} alt={productObject.thumbnailSrc}/>
					</div>
					<p>Topic: {productObject.topic}</p>
					<p>Language: {productObject.language}</p>
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