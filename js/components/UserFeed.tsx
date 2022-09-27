import * as React from 'react';
// @ts-ignore
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBan } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
import Navigation from './Navigation.jsx';
// @ts-ignore
import MediaRenderer from './MediaRenderer.tsx';

interface UserObject {
	_id: string;
	displayName: string;
	firstName: string;
	lastName: string;
	profilePictureSrc: string;
}

interface UserFeedState {
	searchQuery: string;
	users: [UserObject?],
	loaded: boolean;
}

interface UserFeedProps {
	initialUsers?: [UserObject?]
	authenticatedUserID?: string
	SearchFormHeading?: string;
	HideClearFilters?: boolean;
}

export default class UserFeed extends React.Component<UserFeedProps, UserFeedState>{
	constructor(props: UserFeedProps){
		super(props);
		let state: UserFeedState = {
			searchQuery: '',
			users: [],
			loaded: false,
		}
		this.state = state;
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
	}

	async componentDidMount(){

		const query = `query getRecentUsers{
			getRecentUsers{
				users {
					_id
					displayName
					firstName
					lastName
					profilePictureSrc
				}
			}
		}`;
		const data = await graphQLFetch(query);
		if(data){
		if(data.getRecentUsers){
			if(data.getRecentUsers.users){
				this.setState({
					users: data.getRecentUsers.users,
					loaded: true,
				});
			}
		}
		}
	}

	async handleSearchSubmit(event){

		event.preventDefault();

		let {
			searchQuery,
		} = this.state;
		searchQuery = searchQuery.replace(/\s$/, '');

		const query = `query searchUsers($searchQuery: String){
			searchUsers(searchQuery: $searchQuery){
				users {
					_id
					displayName
					firstName
					lastName
					profilePictureSrc
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			searchQuery,
		});
		if(data.searchUsers){
			if(data.searchUsers.users){
				this.setState({
					users: data.searchUsers.users
				});
			}
		}
	}

	render(){

		const { authenticatedUserID } = this.props;

		let {
			users,
			searchQuery,
			loaded,
		} = this.state;

		return(
			<div className="frame fw-container">
				<Navigation/>

				<section>
					<div className="page-form" style={{ marginBottom: '60px' }}>
						{ this.props.SearchFormHeading ? <h1 style={{ textAlign: 'right' }}>{this.props.SearchFormHeading}</h1> : '' }
						<form className="fw-form search-form">
							<div className="flex-container flex-vertical-stretch" style={{ flexWrap: 'nowrap' }}>
								<div className="field text tablet-100">
									<label htmlFor="searchQueryField">Search</label>
									<input type="text" name="searchQuery" id="searchQueryField" value={searchQuery} onChange={(event) => this.setState({searchQuery: event.target.value})}/>
								</div>
								<button value="Search" className="button tablet-20" onClick={this.handleSearchSubmit} style={{ borderRadius: '0 5px 5px 0' }}>
									Search
									<FontAwesomeIcon icon={faSearch}/>
								</button>
							</div>
						</form>
						{!this.props.HideClearFilters ?
							<div>
								<a href="/find-users" aria-label="Clear filters" className="button">
									Clear filters
									<FontAwesomeIcon icon={faBan}/>
								</a>
							</div>
							:
							''
						}
					</div>
					{users.length ?
						<table>
							<thead>
								<tr>
									<th></th>
									<th>Display Name</th>
									<th>First Name</th>
									<th>Last Name</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) =>
									<tr key={users.indexOf(user)} onClick={() => window.location = `/account-profile/${user._id}`} style={{ cursor: 'pointer' }}>
											<td style={{ maxWidth: '100px' }}>
												{user.profilePictureSrc ?
													<MediaRenderer src={user.profilePictureSrc}/>
													:
													''
												}
											</td>
											<td>{user.displayName}</td>
											<td>{user.firstName}</td>
											<td>{user.lastName}</td>
									</tr>
								)}
							</tbody>
						</table>
						:
						<>{loaded ? <p>No users found</p> : <div className="lds-facebook"><div></div><div></div><div></div></div>}</>
					}
				</section>
			</div>
		);
	}
}