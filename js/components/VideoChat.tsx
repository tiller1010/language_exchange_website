import * as React from 'react';
import Navigation from './Navigation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCamera, faSync } from '@fortawesome/free-solid-svg-icons';
import * as firebase from 'firebase/app';
import {
	getFirestore,
	query,
	where,
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	setDoc,
	updateDoc,
	onSnapshot
} from 'firebase/firestore';

interface CallOffer {
	callID: string;
	sdp: string;
	type: string;
	forUserID?: string;
	withUserID?: string;
	forUserDisplayName?: string;
	withUserDisplayName?: string;
	createdDate: string;
}

interface VideoChatProps {
	authenticatedUserID: string;
}

interface VideoChatState {
	firestore: any;
	peerConnection: any;
	callID: string;
	webcamButtonDisabled: boolean;
	callButtonDisabled: boolean;
	answerButtonDisabled: boolean;
	hangupButtonDisabled: boolean;
	forUserID?: string;
	forUserDisplayName?: string;
	WithUserID?: string;
	availableCalls?: [CallOffer];
}

export default class VideoChat extends React.Component<VideoChatProps, VideoChatState> {
	webcamVideo;
	remoteVideo;
	constructor(props){
		super(props);
		let state: VideoChatState = {
			firestore: null,
			peerConnection: null,
			callID: '',
			webcamButtonDisabled: false,
			callButtonDisabled: true,
			answerButtonDisabled: true,
			hangupButtonDisabled: true,
			forUserID: '',
			forUserDisplayName: '',
			WithUserID: '',
		}
		this.state = state;
		this.startWebcam = this.startWebcam.bind(this);
		this.createCall = this.createCall.bind(this);
		this.answerCall = this.answerCall.bind(this);
		this.hangup = this.hangup.bind(this);
		this.refreshCallOffers = this.refreshCallOffers.bind(this);

		this.webcamVideo = React.createRef();
		this.remoteVideo = React.createRef();
	}

	async componentDidMount(){

		const firebaseConfig = await fetch('/video-chat-tokens', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			})
		})
		.then((response) => response.json())
		.catch((e) => console.log(e));

		let firebaseApp;
		// @ts-ignore
		if (!firebase.apps) {
			firebaseApp = firebase.initializeApp(firebaseConfig);
		}
		const firestore = getFirestore(firebaseApp);

		const servers = {
			iceServers: [
				{
					urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
				},
			],
			iceCandidatePoolSize: 10,
		};

		// Global State
		const peerConnection = new RTCPeerConnection(servers);

		this.setState({
			peerConnection,
			firestore,
		});

		const urlParams = new URLSearchParams(window.location.search);
		const forUserID = urlParams.get('forUserID'); // The customer ID, used by the owner to create calls for the customer ID
		const withUserID = urlParams.get('withUserID'); // The video chat owner ID, used by a customer to answer calls with this ID

		if(forUserID){
			const forUserDisplayName = await this.getUserNameByID(forUserID);
			this.setState({
				forUserID,
				forUserDisplayName,
			});
		} else if(withUserID){
			const withUserDisplayName = await this.getUserNameByID(withUserID);
			const callsCollection = query(collection(firestore, 'calls'), where('offer.forUserID', '==', this.props.authenticatedUserID));
			let callDocs = await getDocs(callsCollection)
			let callDocsArray = [];
			callDocs.forEach((doc) => {
				if(doc.id){
					let call = doc.data();
					call.offer.withUserDisplayName = withUserDisplayName;
					callDocsArray.push(call.offer);
				}
			});
			callDocsArray.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
			this.setState({
				withUserID,
				availableCalls: callDocsArray,
			});
		}
	}

	async startWebcam(){

		const { peerConnection } = this.state;

		const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		const remoteStream = new MediaStream();

		// Push tracks from local stream to peer connection
		localStream.getTracks().forEach((track) => {
		  peerConnection.addTrack(track, localStream);
		});

		// Pull tracks from remote stream, add to video stream
		peerConnection.ontrack = (event) => {
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
		};

		this.webcamVideo.current.srcObject = localStream;
		this.remoteVideo.current.srcObject = remoteStream;

		this.setState({
			callButtonDisabled: false,
			answerButtonDisabled: false,
			webcamButtonDisabled: true,
			hangupButtonDisabled: false,
		});

	}

	async getUserNameByID(userID){
		const user = await fetch(`/user/${userID}`)
			.then((response) => response.json());
		return user.displayName;
	}

	async createCall(){

		const { peerConnection, firestore, forUserID } = this.state;

		// Reference Firestore collections for signaling
		const callDocs = collection(firestore, 'calls');
		const callDoc = await addDoc(callDocs, {});
		const offerCandidates = collection(callDoc, 'offerCandidates');
		const answerCandidates = collection(callDoc, 'answerCandidates');

		this.setState({ callID: callDoc.id});

		// Get candidates for caller, save to db
		peerConnection.onicecandidate = async (event) => {
			if(event.candidate){
				await addDoc(offerCandidates, event.candidate.toJSON());
			}
		};

		// Create offer
		const offerDescription = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offerDescription);

		const offer = {
			callID: callDoc.id,
			sdp: offerDescription.sdp,
			type: offerDescription.type,
			forUserID,
			createdDate: (new Date()).toString()
		}: CallOffer;

		await setDoc(callDoc, ({ offer }));

		// Listen for remote answer
		onSnapshot(callDoc, (snapshot) => {
		  const data = snapshot.data();
		  if (!peerConnection.currentRemoteDescription && data?.answer) {
		    const answerDescription = new RTCSessionDescription(data.answer);
		    peerConnection.setRemoteDescription(answerDescription);
		  }
		});

		// When answered, add candidate to peer connection
		onSnapshot(answerCandidates, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const candidate = new RTCIceCandidate(change.doc.data());
					peerConnection.addIceCandidate(candidate);
				}
			});
		});

		this.setState({
			hangupButtonDisabled: false,
		})
	}

	async answerCall(){

		const { peerConnection, firestore } = this.state;

		const { callID } = this.state;
		const callDocs = collection(firestore, 'calls');
		const callDoc = await doc(callDocs, callID);
		const offerCandidates = collection(callDoc, 'offerCandidates');
		const answerCandidates = collection(callDoc, 'answerCandidates');

		peerConnection.onicecandidate = async (event) => {
			if(event.candidate){
				await addDoc(answerCandidates, event.candidate.toJSON());
			}
		};

		const callData = (await getDoc(callDoc)).data();

		const offerDescription = callData.offer;
		await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

		const answerDescription = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answerDescription);

		const answer = {
			type: answerDescription.type,
			sdp: answerDescription.sdp,
		};

		await updateDoc(callDoc, { answer });

		onSnapshot(offerCandidates, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					let data = change.doc.data();
					peerConnection.addIceCandidate(new RTCIceCandidate(data));
				}
			});
		});
	}

	hangup(){
		const { peerConnection, availableCalls } = this.state;

		peerConnection.close();

		this.webcamVideo.current.srcObject = null;
		this.remoteVideo.current.srcObject = null;

		this.setState({
			callID: '',
			webcamButtonDisabled: false,
			callButtonDisabled: true,
			answerButtonDisabled: true,
			hangupButtonDisabled: true,
		});
	}

	async refreshCallOffers(){

		const { firestore, withUserID } = this.state; // The video chat owner ID, used by a customer to answer calls with this ID

		if(withUserID){
			const withUserDisplayName = await this.getUserNameByID(withUserID);
			const callsCollection = query(collection(firestore, 'calls'), where('offer.forUserID', '==', this.props.authenticatedUserID));
			let callDocs = await getDocs(callsCollection)
			let callDocsArray = [];
			callDocs.forEach((doc) => {
				if(doc.id){
					let call = doc.data();
					call.offer.withUserDisplayName = withUserDisplayName;
					callDocsArray.push(call.offer);
				}
			});
			callDocsArray.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
			this.setState({
				availableCalls: callDocsArray,
			});
		}
	}

	renderCallControls(){

		const {
			availableCalls,
			forUserID,
			forUserDisplayName,
			withUserID,
			callButtonDisabled,
			answerButtonDisabled,
			callID,
		} = this.state;

		if(forUserID){
			return(
				<div className="pure-u-1 pure-u-md-1-2">
					<div className="pad">
						<h2>Create a new Call for {forUserDisplayName}</h2>
						<button id="callButton" disabled={callButtonDisabled} onClick={this.createCall}>
							{callID ? 'Dialed' : 'Create Call'}
							<FontAwesomeIcon icon={faPhone}/>
						</button>
					</div>
				</div>
			);
		} else if(withUserID){
			return(
				<div className="pure-u-1 pure-u-md-1-2">
					<div className="pad">
						<h2>Join a Call</h2>
						<p>Not seeing the right call? Try clicking refresh.</p>
						<button id="refreshButton" onClick={this.refreshCallOffers}>
							Refresh
							<FontAwesomeIcon icon={faSync}/>
						</button>
						<div className="flex y-center">
							{availableCalls ?
								availableCalls.map((callOffer) =>
									<div key={availableCalls.indexOf(callOffer)}>
										<input type="radio" id={`callOffer_${callOffer.callID}`} name="callID" onClick={() => this.setState({ callID: callOffer.callID})}/>
										<label htmlFor={`callOffer_${callOffer.callID}`}>With {callOffer.withUserDisplayName}, created call on {callOffer.createdDate}</label>
										<button id="answerButton" disabled={answerButtonDisabled || callID != callOffer.callID} onClick={this.answerCall}>
											Answer
											<FontAwesomeIcon icon={faPhone}/>
										</button>
									</div>
								)
								:
								''
							}
						</div>
					</div>
				</div>
			);
		}
		return '';
	}

	render(){

		const { availableCalls } = this.state;

		return (
			<div className="frame">
				<Navigation/>
				<div className="pure-u-g">

					<h2>Start your Webcam</h2>
					<div className="flex x-center">
						<div className="pure-u-1 pure-u-md-1-2">
							<div className="pad">
								<h3>Local Stream</h3>
								<video id="webcamVideo" autoPlay playsInline muted ref={this.webcamVideo}></video>
							</div>
						</div>
						<div className="pure-u-1 pure-u-md-1-2">
							<div className="pad">
								<h3>Remote Stream</h3>
								<video id="remoteVideo" autoPlay playsInline ref={this.remoteVideo}></video>
							</div>
						</div>
					</div>
					<div className="flex x-center pure-u-1">
						<button id="webcamButton" disabled={this.state.webcamButtonDisabled} onClick={this.startWebcam}>
							Start webcam
							<FontAwesomeIcon icon={faCamera}/>
						</button>
					</div>
					<div className="flex x-center y-center">
						{this.renderCallControls()}
					</div>
					<div className="flex x-center pure-u-1">
						<button id="hangupButton" disabled={this.state.hangupButtonDisabled} onClick={this.hangup}>
							Hangup
							<FontAwesomeIcon icon={faPhone}/>
						</button>
					</div>
				</div>
			</div>
		);
	}
}