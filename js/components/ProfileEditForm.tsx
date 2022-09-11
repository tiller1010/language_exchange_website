import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCheck, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import graphQLFetch from '../graphQLFetch.js';
// @ts-ignore
import RemoveConfirmationModal from './RemoveConfirmationModal.tsx';
import Navigation from './Navigation.jsx';

interface User {
	_id: string;
	email: string
	displayName: string
	firstName: string
	lastName: string
	password: string
}

interface ProfileEditState {
	email: string
	displayName: string
	firstName: string
	lastName: string
	password: string
	confirmPassword: string
	profilePictureSrc: string
	profilePictureFile?: File
	savedUser?: User
	savedAllChanges: boolean
}

interface ProfileEditProps {
	userID: string
}

export default class ProfileEditForm extends React.Component<ProfileEditProps, ProfileEditState>{
	constructor(props: ProfileEditProps){
		super(props);
		let state: ProfileEditState = {
			email: '',
			displayName: '',
			firstName: '',
			lastName: '',
			password: '',
			confirmPassword: '',
			profilePictureSrc: '',
			savedAllChanges: true,
		}
		this.state = state;
		this.handleProfilePictureChange = this.handleProfilePictureChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDeleteUser = this.handleDeleteUser.bind(this);
	}

	async componentDidMount(){
		let user = await fetch(`/user/${this.props.userID}`)
			.then((response) => response.json());

		if(user){
			// @ts-ignore
			this.setState({ ...user });
			this.setState({ savedUser: user });
		}
	}

	handleProfilePictureChange(event){
		const context = this;
	    const image = event.target.files[0];
	    context.setState({
		    profilePictureFile: image,
			savedAllChanges: false,
	    });
	    if(image){
	    	// Set preview
	  		const reader = new FileReader();
			reader.addEventListener('load', function () {
				if(typeof reader.result === 'string'){
					if(/jpeg|jpg|png/.test(reader.result.substr(0, 20))){
						context.setState({profilePictureSrc: reader.result});
					} else {
						alert('Invalid profile picture format.');
					}
				} else {
					alert('Invalid upload.');
				}

			}, false);
			reader.readAsDataURL(image);
	    }
	}

	async handleSubmit(event){

		event.preventDefault();

		let {
			email,
			displayName,
			firstName,
			lastName,
			password,
			confirmPassword,
			profilePictureSrc,
			profilePictureFile,
			savedUser
		} = this.state;

		if (password != '' && password != confirmPassword) {
			return alert('Passwords do not match.');
		}

		if(email && displayName && firstName){
			let query;
			let variables;
			let mutationName;
			if(savedUser){
				// If updating existing
				query = `mutation updateUser($userID: ID!, $user: UserInputs, $file: Upload){
					updateUser(userID: $userID, user: $user, profilePictureFile: $file){
						_id
						email
						displayName
						firstName
						lastName
						profilePictureSrc
					}
				}`;
				variables = {
					userID: savedUser._id,
					user: {
						email,
						displayName,
						firstName,
						lastName,
						password,
					}
				};
				if(profilePictureFile){
					variables.file = profilePictureFile;
				}
				mutationName = 'updateUser';
				var data = await graphQLFetch(query, variables, profilePictureFile ? true : false);
				this.setState({
					savedUser: data[mutationName],
					savedAllChanges: true,
				});
			}
		} else {
			const missingFields = [
				{ value: email, label: 'email' },
				{ value: displayName, label: 'displayName' },
				{ value: firstName, label: 'firstName' },
				{ value: profilePictureSrc, label: 'profilePicture' },
			].filter(field => !field.value);
			const missingFieldsString: string = missingFields.map(field => field.label).join(', ');
			alert('Missing fields: ' + missingFieldsString);
		}

		// DEBUG UPLOAD
		// const query = `mutation addUserProfilePictureTest($file: Upload){
		// 	addUserProfilePictureTest(profilePictureFile: $file){
		// 		profilePictureSrc
		// 	}
		// }`;
		// const data = await graphQLFetch(query, {
		// 	file: profilePictureFile
		// }, true);
	}

	async handleDeleteUser(){

		// If adding new
		const query = `mutation removeUser($userID: ID!){
			removeUser(userID: $userID)
		}`;
		const variables = {
			userID: this.props.userID
		};
		const data = await graphQLFetch(query, variables);
		const emptyUserObject = {
			email: '',
			displayName: '',
			firstName: '',
			profilePictureSrc: ''
		}
		this.setState({
			...emptyUserObject,
			savedUser: null
		});
	}

	render(){

		let {
			email,
			displayName,
			firstName,
			lastName,
			password,
			confirmPassword,
			profilePictureSrc,
			savedUser
		} = this.state;

		return(

			<div className="frame fw-container fw-typography-spacing">
				<Navigation/>

				<section className="fw-space double noleft noright">

					<div className="pure-g">
						<h2 className="pure-u-1">User Profile</h2>
						<form className="pure-u-1 fw-form">
							<div className="flex-container desktop-100">
								<div className="desktop-50 phone-100">
									<div className="field text">
										<label htmlFor="emailField">Email</label>
										<input type="email" name="email" id="emailField" value={email} onChange={(event) => this.setState({email: event.target.value, savedAllChanges: false})}/>
									</div>
									<div className="field text">
										<label htmlFor="displayNameField">Display Name</label>
										<input type="text" name="displayName" id="displayNameField" value={displayName} onChange={(event) => this.setState({displayName: event.target.value, savedAllChanges: false})}/>
									</div>
									<div className="field text">
										<label htmlFor="firstNameField">First Name</label>
										<input type="text" name="firstName" id="firstNameField" value={firstName} onChange={(event) => this.setState({firstName: event.target.value, savedAllChanges: false})}/>
									</div>
									<div className="field text">
										<label htmlFor="lastNameField">Last Name</label>
										<input type="text" name="lastName" id="lastNameField" value={lastName} onChange={(event) => this.setState({lastName: event.target.value, savedAllChanges: false})}/>
									</div>
									<div className="field text">
										<label htmlFor="passwordField">Password</label>
										<input type="password" name="password" id="passwordField" value={password} onChange={(event) => this.setState({password: event.target.value, savedAllChanges: false})}/>
									</div>
									<div className="field text">
										<label htmlFor="confirmPasswordField">Confirm password</label>
										<input type="password" name="confirmPassword" id="confirmPasswordField" value={confirmPassword} onChange={(event) => this.setState({confirmPassword: event.target.value, savedAllChanges: false})}/>
									</div>

									<div className="upload-container">
										<input type="file" name="profilePicture" onChange={this.handleProfilePictureChange}/>
										<label htmlFor="profilePicture">
											Profile Picture
											<FontAwesomeIcon icon={faUpload}/>
										</label>
									</div>

									<div>
										<button className="button" onClick={this.handleSubmit} disabled={this.state.savedAllChanges}>
											{this.state.savedAllChanges ? 'Saved' : 'Save'}
											<FontAwesomeIcon icon={faCheck}/>
										</button>
									</div>

								</div>

								<div className="desktop-30 phone-100">
									<div className="desktop-100" style={{ maxWidth: '100%', height: '300px' }}>
										<div className="pad" style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
											<div className="profilePicture-preview img-container" style={{ height: '100%', width: '100%', background: `url(${ profilePictureSrc }) no-repeat top center/cover` }}></div>
										</div>
									</div>
								</div>

							</div>
						</form>
						<div className="pure-u-1 flex-container flex-horizontal-center">
							{/*savedUser ?
								<div className="desktop-100">
									<form>
										<a className="button" href="#remove-user" style={{ width: 'max-content' }}>
											Remove Profile
											<FontAwesomeIcon icon={faTrash}/>
										</a>
									</form>
									<RemoveConfirmationModal
										buttonText="Remove User"
										buttonAnchor="remove-user"
										modalTitle="Remove User"
										modalContent="Are you sure you want to remove this user?"
										handleDelete={this.handleDeleteUser}
									/>
								</div>
								:
								''
							*/}
						</div>
					</div>

				</section>
			</div>
		);
	}
}