import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';

enum SortControlStatus {
	open = 'open',
	closed = 'closed'
}

interface VideoSearchFormProps {
	keywords: string;
	sort: string;
}

interface VideoSearchFormState {
	keywords: string;
	sortControlStatus: SortControlStatus;
	sort: string;
}

export default class VideoSearchForm extends React.Component<VideoSearchFormProps, VideoSearchFormState> {
	constructor(props){
		super(props);
		let state: VideoSearchFormState = {
			keywords: '',
			sortControlStatus: SortControlStatus.closed,
			sort: ''
		}
		this.state = state;
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
	}

	componentDidMount(){
		const { keywords, sort } = this.props;
		this.setState({
			keywords,
			sort
		});
	}

	componentDidUpdate(prevProps){
		if(this.props != prevProps){
			const { keywords, sort } = this.props;
			this.setState({
				keywords,
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
		event.target.form.querySelector('input[type="submit"]').click();
	}

	render(){

		const { keywords, sortControlStatus, sort} = this.state;

		return(
			<form action="/videos" method="GET">
				<div className="flex">
					<div className="search-input">
						<input type="text" name="keywords" value={keywords} onChange={this.handleKeywordsChange}  placeholder="Search video submissions"/>
				        <FontAwesomeIcon icon={faSearch}/>
						<input type="submit" value="Search"/>
					</div>
					<div className="sort-controls flex">
						<div className="control-icon pure-u-1" onClick={this.toggleSortControls}>
							<FontAwesomeIcon icon={faSlidersH}/>
						</div>
						<div className={`sort-options flex pure-u-1 ${sortControlStatus}`}>
							<div>
								<label htmlFor="sort-all">All</label>
								<input type="radio" name="sort" value="" id="sort-all" checked={sort === '' ? true : false} onChange={this.handleSortChange}/>
							</div>
							<div>
								<label htmlFor="sort-oldest">Oldest</label>
								<input type="radio" name="sort" value="Oldest" id="sort-oldest" checked={sort === 'Oldest' ? true : false} onChange={this.handleSortChange}/>
							</div>
							<div>
								<label htmlFor="sort-recent">Recent</label>
								<input type="radio" name="sort" value="Recent" id="sort-recent" checked={sort === 'Recent' ? true : false} onChange={this.handleSortChange}/>
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
			</form>
		);
	}
}