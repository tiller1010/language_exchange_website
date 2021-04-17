import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSync, faPlus, faHome, faTimes, faCheckCircle, faBars } from '@fortawesome/free-solid-svg-icons';
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
			optionsStatus: '',
			allChallengesAnswered: false
		}
		this.handleToggleOptions = this.handleToggleOptions.bind(this);
		this.checkAnswerInput = this.checkAnswerInput.bind(this);
		this.handleResetTopic = this.handleResetTopic.bind(this);
	}

	componentDidMount(){
		axios.get(`${process.env.STRAPI_URL}/topics/${this.props.topicID}`)
			.then(res => {
				// console.log(res)
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
								}, () => {
									if(this.props.completed){
										let completedChalleges = [];
										this.state.challenges.forEach((stateChallenge) => {
											stateChallenge.answered = 'correct';
											completedChalleges.push(stateChallenge);
										});
										this.setState({
											challenges: completedChalleges,
											allChallengesAnswered: true
										});
									}
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
			const newState = this.state;
			const challengeIndex = newState.challenges.indexOf(challenge);
			challenge.answered = 'correct';
			newState.challenges[challengeIndex] = challenge;
			this.setState({ ...newState });
		}

		// Check to see if all challenges have been answered correctly
		let allChallengesAnswered = true;
		this.state.challenges.forEach((challenge) => {
			if(!challenge.answered){
				allChallengesAnswered = false;
			}
		});
		if(allChallengesAnswered){
			alert('Congratulations! You have answered each challenge correctly.');
			axios.post(`/level/${this.props.levelID}/topics/${this.props.topicID}`)
				.then(res => {
					if(res.data){
						// console.log(res.data)
					}
				})
			this.setState({
				allChallengesAnswered
			});
		}
	}

	handleResetTopic(){
		axios.post(`/level/${this.props.levelID}/topics/${this.props.topicID}/reset`);
		this.setState({
			allChallengesAnswered: false
		});
		let completedChalleges = [];
		this.state.challenges.forEach((stateChallenge) => {
			delete stateChallenge.answered;
			completedChalleges.push(stateChallenge);
		});
		this.setState({
			challenges: completedChalleges
		});
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
							<video height="225" width="400" controls tabIndex="-1">
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
					<div className="pad">
						<a href={`/level/${this.props.levelID}`} className="button icon-left">
							<FontAwesomeIcon icon={faLongArrowAltLeft}/>
							Back to Level
						</a>
					</div>
					<h2 className="text-center pure-u-1">{this.state.topic}</h2>
					<div className="pad">
			    		<button className="available-answers button icon-left" onClick={this.handleToggleOptions}>
							<FontAwesomeIcon icon={faBars}/>
			    			Available Answers
			    		</button>
		    		</div>
	    			{this.state.allChallengesAnswered ?
						<div className="pure-u-1 flex x-center">
							<button onClick={this.handleResetTopic}>
								Reset Topic
								<FontAwesomeIcon icon={faSync}/>
							</button>
						</div>
						:
						''
					}
				</div>



			    {this.state.challenges ?
			    	<div className={`challenge-options ${this.state.optionsStatus}`} onClick={this.handleToggleOptions}>
				    	<FontAwesomeIcon icon={faTimes} className="close"/>
				    	{shuffleArray(this.state.challenges).map((challenge) => 
				    		<div key={this.state.challenges.indexOf(challenge)}>
					    		<div className="pad">
					    			<div className={`challenge-option ${challenge.answered}`}>
						    			<p>{challenge.Title}</p>
						    			<FontAwesomeIcon icon={faCheckCircle}/>
					    			</div>
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
						    			<div className={`challenge-input ${challenge.answered}`}>
							    			<input type="text" placeholder="Guess meaning" onChange={(event) => this.checkAnswerInput(event.target.value, challenge)}/>
							    			<div className="correct-answer">{challenge.Title}</div>
							    			<div className="input-correct">
							    				<p>Correct!</p>
								    			<FontAwesomeIcon icon={faCheckCircle}/>
							    			</div>
						    			</div>
						    			<p>{challenge.Content}</p>
						    			{challenge.FeaturedMedia.length ?
						    				this.renderMedia(challenge)
						    				:
						    				''
						    			}
						    			{this.state.allChallengesAnswered ?
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
							    			:
							    			''
						    			}
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