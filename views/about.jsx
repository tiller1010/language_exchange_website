import React from 'react';

class About extends React.Component {
	constructor(){
		super();
		this.state = {
			items: []
		}
	}

	componentDidMount(){

		// var mongoClient = this.props.mongoClient;
		// var mongoURL = this.props.mongoURL;
		// var itemList;

		// mongoClient.connect(mongoURL, {useNewUrlParse: true})
		// 	.then((client) => {

		// 		db = client.db('test');
		// 		collection = db.collection('fun');
		// 		collection.find().toArray(function(err, items){
		// 			if(items){
		// 				this.setState({
		// 					items: items
		// 				})
		// 			}
		// 		});
		// 	})

	}

	render(){

		return (
			<div>
				{this.props.items[0].name}
				<h1>About World</h1>
			</div>
		);
	}
}

export default About;
