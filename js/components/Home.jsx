import React from 'react';
import axios from 'axios';
import lozad from 'lozad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';

// Enable lazy loading
const lozadObserver = lozad();
lozadObserver.observe();

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
			sortControlStatus: ''
		}
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
	}

	componentDidMount(){

		// Get recent videos
		axios.get(`${document.location.origin}/recent-videos`)
			.then(res => {
				console.log(res)
				this.setState({
					recentVideos: res.data.videos
				});
			});

		axios.get(`${process.env.STRAPI_URL}/levels`)
			.then(res => {
				console.log(res)
				this.setState({
					levels: res.data
				});
			});
	}

	toggleSortControls(){
		let newStatus = this.state.sortControlStatus ? '' : 'open';
		this.setState({
			sortControlStatus: newStatus
		});
	}

	handleSortChange(event){
		this.setState({
			sort: event.target.value
		});
		// This approach triggers the onSubmit handler
		event.target.form.querySelector('input[type="submit"]').click();
	}

	renderMedia(topic){
		if(topic.FeaturedImage){
			switch(topic.FeaturedImage.mime){
				case 'image/jpeg':
					return (
						<div className="img-container">
							<img src={`${process.env.STRAPI_URL}${topic.FeaturedImage.url}`}/>
						</div>
					);
				default:
					return <p>Invalid media</p>
			}
		}
	}

	randomTopics(level){
		if(level.topicsRandomized){
			return level.topics;
		} else {
			level.topicsRandomized = true;
			level.topics = level.topics.sort(() => .5 - Math.random()).slice(0, 5);
			return level.topics;
		}
	}

	render(){
		var { strapiTestImage } = this.state || 'notfound';
		return (
			<div className="frame">
				<Navigation/>
				<div className="page-form">
					<p>Let's enjoy your</p>
					<h1>User Submissions</h1>
					<form action="/videos" method="GET">
						<div className="flex">
							<div className="search-input">
								<input type="text" name="keywords" placeholder="Search video submissions"/>
						        <FontAwesomeIcon icon={faSearch}/>
								<input type="submit" value="Search"/>
							</div>
							<div className="sort-controls flex">
								<div className="control-icon pure-u-1" onClick={this.toggleSortControls}>
									<FontAwesomeIcon icon={faSlidersH}/>
								</div>
								<div className={`sort-options flex pure-u-1 ${this.state.sortControlStatus}`}>
									<div>
										<label htmlFor="sort-all">All</label>
										<input type="radio" name="sort" value="" id="sort-all" checked={this.state.sort === '' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-oldest">Oldest</label>
										<input type="radio" name="sort" value="Oldest" id="sort-oldest" checked={this.state.sort === 'Oldest' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-recent">Recent</label>
										<input type="radio" name="sort" value="Recent" id="sort-recent" checked={this.state.sort === 'Recent' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-AZ">A-Z</label>
										<input type="radio" name="sort" value="A-Z" id="sort-AZ" checked={this.state.sort === 'A-Z' ? true : false} onChange={this.handleSortChange}/>
									</div>
									<div>
										<label htmlFor="sort-ZA">Z-A</label>
										<input type="radio" name="sort" value="Z-A" id="sort-ZA" checked={this.state.sort === 'Z-A' ? true : false} onChange={this.handleSortChange}/>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

			    {this.state.recentVideos ?
			    	<div className="pad no-x">
			    		<h2>Recent Submissions</h2>
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
					    	{this.state.recentVideos.map((video) => 
					    		<div key={video._id}>
									<h3>{video.title}</h3>
									<div style={{height: '300px'}}>
										<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
											video.thumbnailSrc || "/images/videoPlaceholder.png"
										} controls>
											<source src={video.src}></source>
										</video>
									</div>
								</div>
				    		)}
			    		</Slider>
			    	</div>
			    	:
			    	''
			    }

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<div key={this.state.levels.indexOf(level)} className="flex x-center">
				    		<h2 className="pad">Level {level.Level}</h2>
				    		<a href={`/level/${level.id}`} className="button" style={{ alignSelf: 'center' }}>
					    		View all
					    		<FontAwesomeIcon icon={faLongArrowAltRight}/>
				    		</a>
				    		{level.topics ?
				    			<div className="topics pure-u-1 flex x-space-around">
					    			{this.randomTopics(level).map((topic) =>
					    				<div className="topic pure-u-1 pure-u-md-11-24" key={level.topics.indexOf(topic)}>
						    				<div className="flex x-space-between">
						    					<h3 className="pad no-y no-left">{topic.Topic}</h3>
						    					<a href={`/level/${level.id}/topics/${topic.id}`} className="button">
												    View all
												    <FontAwesomeIcon icon={faLongArrowAltRight}/>
											    </a>
										    </div>
					    					<a href={`/level/${level.id}/topics/${topic.id}`}>
						    					{this.renderMedia(topic)}
					    					</a>
				    					</div>
				    				)}
			    				</div>
			    				:
			    				<p>No topics</p>
				    		}
			    		</div>
		    		) 
			    	:
			    	<h2>No levels</h2>
			    }
			</div>
		);
	}
}

export default Home;