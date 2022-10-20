import * as React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight, faBan } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import Navigation from './Navigation.jsx';
// @ts-ignore
import TopicLink from './TopicLink.tsx';
// @ts-ignore
import LessonSearchForm from './LessonSearchForm.tsx';

interface LevelAttributes {
	Level: string;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
	topics: any;
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
	SearchFormHeading?: string;
	HideClearFilters?: boolean;
}

interface LessonsState {
	levels: LevelData[];
	loaded: boolean;
	showChallenge: boolean;
	initialLoadView: boolean;
	languageOfTopic: string
}

class LessonsFeed extends React.Component<LessonsProps, LessonsState> {
	constructor(props){
		super(props);
		this.state = {
			levels: [],
			loaded: false,
			showChallenge: false,
			initialLoadView: true,
			languageOfTopic: '',
		}
		this.onSeachSubmitCallback = this.onSeachSubmitCallback.bind(this);
		this.renderLevels = this.renderLevels.bind(this);
	}

	componentDidMount(){
		const languageOfTopic = sessionStorage.getItem('lessonLanguageFilter');
		axios.get(`${process.env.STRAPI_API_URL}/levels\
?populate[topics][populate]=FeaturedMedia\
&sort[0]=Level\
&filters[Level][$contains]=1\
`)
			.then(res => {
				const data: StrapiData = res.data;
				const levels: LevelData[] = data.data;
				this.setState({
					levels,
					loaded: true,
					languageOfTopic,
				});
			});
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

	onSeachSubmitCallback(data){
		if(data.searchLessons){
			if(data.searchLessons.levels){
				sessionStorage.setItem('lessonLanguageFilter', data.lessonLanguageFilter);
				this.setState({
					levels: data.searchLessons.levels,
					showChallenge: data.searchLessons.showChallenge,
					initialLoadView: false,
				});
			}
		}
	}

	renderLevels() {

		const { levels, loaded, showChallenge, initialLoadView } = this.state;

		return (
			levels.map((level) => 
				<div key={level.id} className="flex x-center">
					{initialLoadView ?
						<>
						<h2 className="pad" style={{ margin: 0 }}>{level.attributes.Level.replace(/\d|\s/g, '')}</h2>
						<div className="desktop-100">
							<button className="button" onClick={() => this.setState({ languageOfTopic: level.attributes.Level.replace(/\d|\s/g, '') })}>
								Load more {level.attributes.Level.replace(/\d|\s/g, '')}
								<FontAwesomeIcon icon={faLongArrowAltRight}/>
							</button>
						</div>
						</>
						:
						<>
						<h2 className="pad" style={{ margin: 0 }}>{level.attributes.Level}</h2>
						<a href={`/level/${level.id}`} className="button" style={{ alignSelf: 'center' }}>
							View Level
							<FontAwesomeIcon icon={faLongArrowAltRight}/>
						</a>
						</>
					}
					<div className="pure-u-1">
						<hr/>
					</div>
					{level.attributes.topics.data ?
						<div className="topics pure-u-1 flex x-space-around">
							{this.randomTopics(level).map((topic) =>
								<div className="topic pure-u-1 pure-u-md-1-3" key={topic.id}>
									<div className="pad">
										<TopicLink topic={topic} levelID={level.id} showChallenge={showChallenge}/>
									</div>
								</div>
							)}
						</div>
						:
						<>{loaded ? <p>No topics</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
					}
				</div>
			);
		);
	}

	render(){

		const { levels, loaded, languageOfTopic, initialLoadView } = this.state;

		return (
			<div className="fw-container">
				<Navigation/>

				<div className="page-form" style={{ marginBottom: '60px' }}>
					{ this.props.SearchFormHeading ? <h1 style={{ textAlign: 'right' }}>{this.props.SearchFormHeading}</h1> : '' }
					<LessonSearchForm
						onSubmit={this.onSeachSubmitCallback}
						languageOfTopic={languageOfTopic || null}
					/>
					{!this.props.HideClearFilters ?
						<div>
							<a href="/lessons" aria-label="Clear filters" className="button" onClick={() => sessionStorage.setItem('lessonLanguageFilter', '')}>
								Clear filters
								<FontAwesomeIcon icon={faBan}/>
							</a>
						</div>
						:
						''
					}
				</div>

				{levels.length ?
					<>
					{initialLoadView ?
						<Slider {...{
							dots: false,
							infinite: false,
							speed: 500,
							slidesToShow: 1.3,
							slidesToScroll: 1,
						}}>
							{this.renderLevels()}
						</Slider>
						:
						<>
							{this.renderLevels()}
						</>
					}
					</>
					:
					<>{loaded ? <p>No levels</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
				}

			</div>
		);
	}
}

export default LessonsFeed;