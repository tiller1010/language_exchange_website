// Initialize Cloud Firestore through Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseApp = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost',
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = getFirestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// const pc = new RTCPeerConnection(servers);
// let localStream = null;
// let remoteStream = null;

// callButton.onclick = async () => {
// // Reference Firestore collections for signaling
//   const callDoc = firestore.collection('calls').doc();
//   const offerCandidates = callDoc.collection('offerCandidates');
//   const answerCandidates = callDoc.collection('answerCandidates');

//   callInput.value = callDoc.id;

//   // Get candidates for caller, save to db
//   pc.onicecandidate = event => {
//     event.candidate && offerCandidates.add(event.candidate.toJSON());
//   };

//   // Create offer
//   const offerDescription = await pc.createOffer();
//   await pc.setLocalDescription(offerDescription);

//   const offer = {
//     sdp: offerDescription.sdp,
//     type: offerDescription.type,
//   };

//   await callDoc.set({ offer });

//   // Listen for remote answer
//   callDoc.onSnapshot((snapshot) => {
//     const data = snapshot.data();
//     if (!pc.currentRemoteDescription && data?.answer) {
//       const answerDescription = new RTCSessionDescription(data.answer);
//       pc.setRemoteDescription(answerDescription);
//     }
//   });

//   // Listen for remote ICE candidates
//   answerCandidates.onSnapshot(snapshot => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === 'added') {
//         const candidate = new RTCIceCandidate(change.doc.data());
//         pc.addIceCandidate(candidate);
//       }
//     });
//   });
// }

module.exports = firebaseApp;