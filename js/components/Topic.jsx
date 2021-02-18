import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import Navigation from './Navigation.jsx';

function shuffleArray(array) {
	let newArray = [...array];
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    newArray = newArray.sort((a, b) => a.answered ? -1 : 1);
    return newArray;
}

class Topic extends React.Component {
	constructor(){
		super();
		this.state = {
			challenges: [],
			optionsStatus: ''
		}
		this.handleToggleOptions = this.handleToggleOptions.bind(this);
		this.checkAnswerInput = this.checkAnswerInput.bind(this);
	}

	componentDidMount(){
		axios.get(`${process.env.STRAPI_URL}/topics/${this.props.topicID}`)
			.then(res => {
				console.log(res)
				if(res.data){
					this.setState({
						topic: res.data.Topic
					})
				}
			})

		axios.get(`${process.env.STRAPI_URL}/challenges`)
			.then(res => {
				if(res.data){
					res.data.forEach((challenge) => {
						if(challenge.topic){
							var challenges = this.state.challenges;
							if(this.props.topicID == challenge.topic.id){
								challenges = challenges.concat(challenge);
								this.setState({
									challenges
								});
							}
						}
					})
				}
			})
	}

	handleToggleOptions(){
		this.setState({
			optionsStatus: this.state.optionsStatus == 'opened' ? '' : 'opened'
		})
	}

	checkAnswerInput(input, challenge){
		if(input.toLowerCase() == challenge.Title.toLowerCase()){
			console.log('correct')
			const newState = this.state;
			const challengeIndex = newState.challenges.indexOf(challenge);
			challenge.answered = 'correct';
			newState.challenges[challengeIndex] = challenge;
			this.setState({ ...newState });
		}
	}

	renderMedia(challenge){
		if(challenge.FeaturedMedia){
			if(challenge.FeaturedMedia.length){
				switch(challenge.FeaturedMedia[0].mime){
					case 'image/jpeg':
						return (
							<div className="img-container">
								<img src={`${process.env.STRAPI_URL}${challenge.FeaturedMedia[0].url}`}/>
							</div>
						);
					case 'video/mp4':
						return (
							<video height="225" width="400" controls>
								<source src={`${process.env.STRAPI_URL}${challenge.FeaturedMedia[0].url}`} type="video/mp4"/>
							</video>
						);
					default:
						return <p>Invalid media</p>
				}
			}
		}
	}

	render(){
		return (
			<div className="frame">
				<Navigation/>
				<div className="flex x-center">
					<div>
						<a href={`/level/${this.props.levelID}`} className="button icon-left">
							<FontAwesomeIcon icon={faLongArrowAltLeft}/>
							Topics
						</a>
						<h2 className="text-center">{this.state.topic}</h2>
					</div>
				</div>

			    {this.state.challenges ?
			    	<div className={`challenge-options ${this.state.optionsStatus}`} onClick={this.handleToggleOptions}>
				    	{shuffleArray(this.state.challenges).map((challenge) => 
				    		<div key={this.state.challenges.indexOf(challenge)}>
					    		<div className="pad">
					    			<p className={challenge.answered}>{challenge.Title}</p>
					    		</div>
				    		</div>
			    		)}
		    		</div>
			    	:
			    	<h2>No options</h2>
			    }

			    {this.state.challenges ?
			    	<div className="challenges pure-u-1 flex x-space-around">
				    	{this.state.challenges.map((challenge) => 
				    		<div key={this.state.challenges.indexOf(challenge)} className="flex x-center pure-u-1 pure-u-lg-1-2">
					    		<div className="challenge">
						    		<div className="pad">
						    			<input type="text" onChange={(event) => this.checkAnswerInput(event.target.value, challenge)}/>
						    			<p>{challenge.Content}</p>
						    			{challenge.FeaturedMedia.length ?
						    				this.renderMedia(challenge)
						    				:
						    				''
						    			}
						    			<div className="flex x-space-between">
							    			<a href={`/videos?keywords=${challenge.Title}`} className="button">
								    			View others
												<FontAwesomeIcon icon={faSearch}/>
							    			</a>
							    			<a href={`/videos/add?challenge=${challenge.Title}`} className="button">
								    			Submit your own
												<FontAwesomeIcon icon={faPlus}/>
							    			</a>
						    			</div>
						    		</div>
					    		</div>
				    		</div>
			    		)}
		    		</div>
			    	:
			    	<h2>No challenges</h2>
			    }
			</div>
		);
	}
}

export default Topic;