import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltLeft, faSync, faPlus, faTimes, faCheckCircle, faDumbbell } from '@fortawesome/free-solid-svg-icons';
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
			inChallengeMode: false,
			allChallengesAnswered: false,
			topic: '',
			loaded: false,
		}
		this.handleToggleOptions = this.handleToggleOptions.bind(this);
		this.checkAnswerInput = this.checkAnswerInput.bind(this);
		this.handleResetTopic = this.handleResetTopic.bind(this);
		this.handleToggleChallengeMode = this.handleToggleChallengeMode.bind(this);
	}

	componentDidMount(){
		axios.get(`${process.env.STRAPI_API_URL}/topics/${this.props.topicID}?populate[challenges][populate][0]=FeaturedMedia`)
			.then(res => {
				if(res.data){
					const topic = res.data.data.attributes.Topic;
					this.setState({
						topic,
						challenges: res.data.data.attributes.challenges.data,
						loaded: true,
					});
				}
				if(this.props.completed){
					let completedChalleges = [];
					this.state.challenges.forEach((stateChallenge) => {
						stateChallenge.answered = 'correct';
						completedChalleges.push(stateChallenge);
					});
					this.setState({
						challenges: completedChalleges,
						inChallengeMode: true,
						allChallengesAnswered: true,
					});
				}
			})
	}

	handleToggleOptions(){
		this.setState({
			optionsStatus: this.state.optionsStatus == 'opened' ? '' : 'opened'
		})
	}

	checkAnswerInput(input, challenge){
		if(input.toLowerCase() == challenge.attributes.Title.toLowerCase()){
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
		if(allChallengesAnswered && !this.state.allChallengesAnswered){
			// Wait for final input before congratulating with alert.
			setTimeout(() => {
				alert('Congratulations! You have answered each challenge correctly.');
			}, 100);
			axios.post(`/level/${this.props.levelID}/topic/${this.props.topicID}`)
				.then(res => {
					if(res.data){
					}
				})
			this.setState({
				allChallengesAnswered
			});
		}
	}

	handleResetTopic(){

		/* Actually removes the topic from the user's completed lessons */
		// axios.post(`/level/${this.props.levelID}/topic/${this.props.topicID}/reset`);

		this.setState({
			inChallengeMode: false,
			allChallengesAnswered: false,
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

	handleToggleChallengeMode() {
		// Currently this only sets "inChallengeMode" to true, as the reset button sets this to false.
		const { inChallengeMode, challenges } = this.state;
		this.setState({
			inChallengeMode: !inChallengeMode,
			challenges: shuffleArray(challenges),
		});

		// Trigger fw effect on new inputs
		setTimeout(() => {
			window.dispatchEvent(new Event('load'));
		}, 100);
	}

	renderMedia(challenge){
		if(challenge.attributes.FeaturedMedia){
			if(challenge.attributes.FeaturedMedia.data){
				switch(challenge.attributes.FeaturedMedia.data.attributes.mime){
					case 'image/jpeg':
						return (
							<div className="img-container">
								<img src={`${process.env.STRAPI_PUBLIC_URL}${challenge.attributes.FeaturedMedia.data.attributes.url}`}/>
							</div>
						);
					case 'video/mp4':
						return (
							<video height="225" width="400" controls tabIndex="-1" src={`${process.env.STRAPI_PUBLIC_URL}${challenge.attributes.FeaturedMedia.data.attributes.url}`}>
							</video>
						);
					case 'audio/wav':
						return (
							<audio height="225" width="400" controls tabIndex="-1" src={`${process.env.STRAPI_PUBLIC_URL}${challenge.attributes.FeaturedMedia.data.attributes.url}`}>
							</audio>
						);
					default:
						return <p>Invalid media</p>
				}
			}
		}
	}

	render(){

		const {
			challenges,
			optionsStatus,
			inChallengeMode,
			allChallengesAnswered,
			topic,
			loaded,
		} = this.state;

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
					<h2 className="text-center pure-u-1">{topic}</h2>
					<div className="tablet-hide">
						<div className="pad">
							<button className={`button no-icon flex-vertical-center hamburger hamburger--collapse ${optionsStatus == 'opened' ? 'is-active' : ''}`} type="button" onClick={this.handleToggleOptions} style={{ display: 'flex' }}>
								<span className="hamburger-box">
									<span className="hamburger-inner"></span>
								</span>
								<span style={{ padding: '10px' }}>
					    			Available Answers
				    			</span>
							</button>
			    		</div>
		    		</div>
					{allChallengesAnswered || inChallengeMode ?
						<div className="pure-u-1 flex x-center">
							<button className="button" onClick={this.handleResetTopic}>
								Reset Topic
								<FontAwesomeIcon icon={faSync}/>
							</button>
						</div>
						:
						<div className="desktop-100 flex-container flex-horizontal-center">
							<div className="pad">
								<button className="button" onClick={this.handleToggleChallengeMode}>
									Begin challenge
									<FontAwesomeIcon icon={faDumbbell}/>
								</button>
							</div>
						</div>
					}
				</div>



			    {challenges.length ?
			    	<div className={`challenge-options ${optionsStatus}`} onClick={this.handleToggleOptions}>
				    	<FontAwesomeIcon icon={faTimes} className="close"/>
				    	{shuffleArray(challenges).map((challenge) => 
				    		<div key={challenges.indexOf(challenge)}>
					    		<div className="pad">
					    			<div className={`challenge-option ${challenge.answered || ''}`}>
						    			<p>{challenge.attributes.Title}</p>
						    			<FontAwesomeIcon icon={faCheckCircle}/>
					    			</div>
					    		</div>
				    		</div>
			    		)}
		    		</div>
			    	:
			    	''
			    }

			    {challenges.length ?
			    	<form className="challenges pure-u-1 fw-form flex x-space-around">
				    	{challenges.map((challenge) => 
				    		<div key={challenges.indexOf(challenge)} className="flex x-center pure-u-1 pure-u-lg-1-2">
					    		<div className="challenge">
						    		<div className="pad">
						    			<div className={`challenge-input ${challenge.answered || ''}`}>
							    			<h3 className={`${inChallengeMode ? 'correct-answer' : ''} desktop-100`}>{challenge.attributes.Title}</h3>
							    			{inChallengeMode ?
							    				<>
												<div className="field text">
													<label htmlFor={`meaning${challenge.attributes.Title}Field`}>Guess meaning</label>
													<input type="text" name={`meaning${challenge.attributes.Title}Field`} id={`meaning${challenge.attributes.Title}Field`} onChange={(event) => this.checkAnswerInput(event.target.value, challenge)}/>
												</div>
												<div className="input-correct">
													<p>Correct!</p>
													<FontAwesomeIcon icon={faCheckCircle}/>
												</div>
							    				</>
							    				:
							    				''
							    			}
						    			</div>
						    			<p>{challenge.attributes.Content}</p>
						    			{challenge.attributes.FeaturedMedia.data ?
						    				<div className="desktop-100">
							    				{this.renderMedia(challenge)}
						    				</div>
						    				:
						    				''
						    			}
						    			{allChallengesAnswered || !inChallengeMode ?
							    			<div className="flex x-space-between">
								    			<a href={`/videos?keywords=${challenge.attributes.Title}`} className="button">
									    			View others
													<FontAwesomeIcon icon={faSearch}/>
								    			</a>
								    			<a href={`/videos/add?challenge=${challenge.attributes.Title}`} className="button">
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
		    		</form>
			    	:
			    	<>{loaded ? <h2>No challenges</h2> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
			    }

				{allChallengesAnswered || inChallengeMode ?
					<div className="pure-u-1 flex x-center">
						<button className="button" onClick={this.handleResetTopic}>
							Reset Topic
							<FontAwesomeIcon icon={faSync}/>
						</button>
					</div>
					:
					<div className="desktop-100 flex-container flex-horizontal-center">
						<div className="pad">
							<button className="button" onClick={this.handleToggleChallengeMode}>
								Begin challenge
								<FontAwesomeIcon icon={faDumbbell}/>
							</button>
						</div>
					</div>
				}

			</div>
		);
	}
}

export default Topic;