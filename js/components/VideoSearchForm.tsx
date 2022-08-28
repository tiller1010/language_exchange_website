import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import LanguageSelector from './LanguageSelector.tsx';

enum SortControlStatus {
	open = 'open',
	closed = 'closed'
}

interface VideoSearchFormProps {
	keywords: string;
	languageOfTopic: string;
	sort: string;
}

interface VideoSearchFormState {
	keywords: string;
	languageOfTopic: string;
	sortControlStatus: SortControlStatus;
	sort: string;
}

export default class VideoSearchForm extends React.Component<VideoSearchFormProps, VideoSearchFormState> {
	constructor(props){
		super(props);
		let state: VideoSearchFormState = {
			keywords: '',
			languageOfTopic: '',
			sortControlStatus: SortControlStatus.closed,
			sort: 'Recent'
		}
		this.state = state;
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
	}

	componentDidMount(){
		const { keywords, languageOfTopic, sort } = this.props;
		this.setState({
			keywords,
			languageOfTopic,
			sort
		});
	}

	componentDidUpdate(prevProps){
		if(this.props != prevProps){
			const { keywords, languageOfTopic, sort } = this.props;
			this.setState({
				keywords,
				languageOfTopic,
				sort
			});
		}
	}

	toggleSortControls(){
		let { sortControlStatus } = this.state;
		let newStatus = sortControlStatus === SortControlStatus.open ? SortControlStatus.closed : SortControlStatus.open;
		this.setState({
			sortControlStatus: newStatus
		});
	}

	handleKeywordsChange(event){
		this.setState({
			keywords: event.target.value
		});
	}

	handleSortChange(event){
		this.setState({
			sort: event.target.value
		});
		// This approach triggers the onSubmit handler
		event.target.form.querySelector('button[type="submit"]').click();
	}

	render(){

		const { keywords, languageOfTopic, sortControlStatus, sort} = this.state;

		return(
			<form action="/videos" method="GET" className="fw-form video-search-form">
				<div className="flex-container flex-vertical-stretch">
					<div className="field text tablet-100">
						<label htmlFor="keywordsField">Search</label>
						<input type="text" name="keywords" id="keywordsField" value={keywords} onChange={this.handleKeywordsChange}/>
					</div>
					<div className="flex-container tablet-100" style={{ flexWrap: 'nowrap' }}>
						<div className="tablet-100">
							<LanguageSelector name="languageOfTopic" id="userContent_languageOfTopicField" onChange={(event) => this.setState({ languageOfTopic: event.target.value })} value={languageOfTopic} required={false}/>
						</div>
						<button type="submit" value="Search" className="button tablet-20">
							Search
							<FontAwesomeIcon icon={faSearch}/>
						</button>
						<div className="sort-controls flex tablet-20">
							<button className={`button no-icon hamburger hamburger--collapse ${sortControlStatus == 'open' ? 'is-active' : ''}`} type="button" onClick={this.toggleSortControls}>
								<span className="hamburger-box">
									<span className="hamburger-inner"></span>
								</span>
							</button>
							<div className={`sort-options flex pure-u-1 ${sortControlStatus}`}>
								<div>
									<label htmlFor="sort-recent">Recent</label>
									<input type="radio" name="sort" value="Recent" id="sort-recent" checked={sort === 'Recent' ? true : false} onChange={this.handleSortChange}/>
								</div>
								<div>
									<label htmlFor="sort-oldest">Oldest</label>
									<input type="radio" name="sort" value="Oldest" id="sort-oldest" checked={sort === 'Oldest' ? true : false} onChange={this.handleSortChange}/>
								</div>
								<div>
									<label htmlFor="sort-AZ">A-Z</label>
									<input type="radio" name="sort" value="A-Z" id="sort-AZ" checked={sort === 'A-Z' ? true : false} onChange={this.handleSortChange}/>
								</div>
								<div>
									<label htmlFor="sort-ZA">Z-A</label>
									<input type="radio" name="sort" value="Z-A" id="sort-ZA" checked={sort === 'Z-A' ? true : false} onChange={this.handleSortChange}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
	}
}