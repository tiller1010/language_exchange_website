import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
// @ts-ignore
import LanguageSelector from './LanguageSelector.tsx';

interface LessonSearchFormProps {
	topicQuery: string;
	languageOfTopic: string;
	onSubmit?: CallableFunction
}

interface LessonSearchFormState {
	topicQuery: string;
	languageOfTopic: string;
}

export default class LessonSearchForm extends React.Component<LessonSearchFormProps, LessonSearchFormState> {
	constructor(props){
		super(props);
		let state: LessonSearchFormState = {
			topicQuery: '',
			languageOfTopic: '',
		}
		this.state = state;
		this.handleTopicQueryChange = this.handleTopicQueryChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
	}

	handleTopicQueryChange(event){
		this.setState({
			topicQuery: event.target.value
		});
	}

	async handleSearchSubmit(event) {
		event.preventDefault();

		let {
			topicQuery,
			languageOfTopic
		} = this.state;
		topicQuery = topicQuery.replace(/\s$/, '');

		const query = `query searchLessons($topicQuery: String, $languageOfTopic: String){
			searchLessons(topicQuery: $topicQuery, languageOfTopic: $languageOfTopic){
				levels {
					id
					attributes {
						Level
						topics {
							data {
								id
								attributes {
									Topic
									FeaturedMedia {
										data {
											attributes {
												mime
												url
												alternativeText
											}
										}
									}
									challenges {
										data {
											attributes {
												Title
												Content
												FeaturedMedia {
													data {
														attributes {
															mime
															url
															alternativeText
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				showChallenge
			}
		}`;
		const data = await graphQLFetch(query, {
			topicQuery,
			languageOfTopic,
		});

		if (this.props.onSubmit) {
			this.props.onSubmit(data);
		}
	}

	render(){

		const { topicQuery, languageOfTopic } = this.state;

		return(
			<form className="fw-form search-form">
				<div className="flex-container flex-vertical-stretch">
					<div className="field text tablet-100">
						<label htmlFor="topicQueryField">Search</label>
						<input type="text" name="topicQuery" id="topicQueryField" value={topicQuery} onChange={this.handleTopicQueryChange}/>
					</div>
					<div className="flex-container tablet-100" style={{ flexWrap: 'nowrap' }}>
						<div className="tablet-100">
							<LanguageSelector name="languageOfTopic" id="lessonContent_languageOfTopicField" onChange={(event) => this.setState({ languageOfTopic: event.target.value })} value={languageOfTopic} required={false}/>
						</div>
						<button value="Search" className="button tablet-20" onClick={this.handleSearchSubmit} style={{ borderRadius: '0 5px 5px 0' }}>
							Search
							<FontAwesomeIcon icon={faSearch}/>
						</button>
					</div>
				</div>
			</form>
		);
	}
}