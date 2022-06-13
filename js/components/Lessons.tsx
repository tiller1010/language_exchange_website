import * as React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLongArrowAltRight, faLongArrowAltLeft, faSlidersH, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';

interface LevelAttributes {
	Level: string;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
}

interface LevelData {
	id: number;
	attributes: LevelAttributes;
}

interface StrapiPagination {
	page: number;
	pageCount: number;
	pageSize: number;
	total: number;
}

interface LevelMetaData {
	pagination: StrapiPagination;
}

interface StrapiData {
	data: LevelData[];
	meta: LevelMetaData
}

interface LessonsProps {
}

interface LessonsState {
	levels?: LevelData[];
}

class Lessons extends React.Component<LessonsProps, LessonsState> {
	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		axios.get(`${process.env.STRAPI_API_URL}/levels?populate[topics][populate]=FeaturedMedia`)
			.then(res => {
				const data: StrapiData = res.data;
				const levels: LevelData[] = data.data;
				this.setState({ levels });
			});
	}

	renderMedia(topic){
		if(topic.attributes.FeaturedMedia){
			if(topic.attributes.FeaturedMedia.data){
				switch(topic.attributes.FeaturedMedia.data.attributes.mime){
					case 'image/jpeg':
						return (
							<div className="img-container">
								<img src={`${process.env.STRAPI_PUBLIC_URL}${topic.attributes.FeaturedMedia.data.attributes.url}`}/>
							</div>
						);
					default:
						return <p>Invalid media</p>
				}
			}
		}
	}

	randomTopics(level){
		if(level.attributes.topicsRandomized){
			return level.attributes.topics.data;
		} else {
			level.topicsRandomized = true;
			level.attributes.topics.data = level.attributes.topics.data.sort(() => .5 - Math.random()).slice(0, 5);
			return level.attributes.topics.data;
		}
	}

	render(){

		return (
			<div className="frame">
				<Navigation/>

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<div key={level.id} className="flex x-center">
				    		<h2 className="pad">{level.attributes.Level}</h2>
				    		<a href={`/level/${level.id}`} className="button" style={{ alignSelf: 'center' }}>
					    		View Level
					    		<FontAwesomeIcon icon={faLongArrowAltRight}/>
				    		</a>
				    		<div className="pure-u-1">
					    		<hr/>
				    		</div>
				    		{level.attributes.topics.data ?
				    			<div className="topics pure-u-1 flex x-space-around">
					    			{this.randomTopics(level).map((topic) =>
					    				<div className="topic pure-u-1 pure-u-md-1-3" key={topic.id}>
						    				<div className="pad">
							    				<div className="flex flex-vertical-center x-space-between">
							    					<h3 className="pad no-y no-left">{topic.attributes.Topic}</h3>
							    					<a href={`/level/${level.id}/topic/${topic.id}`} className="button">
													    View Topic
													    <FontAwesomeIcon icon={faLongArrowAltRight}/>
												    </a>
											    </div>
						    					<a href={`/level/${level.id}/topic/${topic.id}`}>
							    					{this.renderMedia(topic)}
						    					</a>
					    					</div>
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

export default Lessons;