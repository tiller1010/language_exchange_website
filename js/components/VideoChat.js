"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Navigation_jsx_1 = require("./Navigation.jsx");
var emailFetch_js_1 = require("../emailFetch.js");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var firebase = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var decipher_js_1 = require("../decipher.js");
var VideoChat = /** @class */ (function (_super) {
    __extends(VideoChat, _super);
    function VideoChat(props) {
        var _this = _super.call(this, props) || this;
        var state = {
            firestore: null,
            peerConnection: null,
            callID: '',
            webcamButtonDisabled: false,
            callButtonDisabled: true,
            answerButtonDisabled: true,
            hangupButtonDisabled: true,
            forUserID: '',
            forUserDisplayName: '',
            withUserID: '',
            answered: false,
        };
        _this.state = state;
        _this.startPeerConnection = _this.startPeerConnection.bind(_this);
        _this.startWebcam = _this.startWebcam.bind(_this);
        _this.createCall = _this.createCall.bind(_this);
        _this.answerCall = _this.answerCall.bind(_this);
        _this.hangup = _this.hangup.bind(_this);
        _this.refreshCallOffers = _this.refreshCallOffers.bind(_this);
        _this.renderCallControls = _this.renderCallControls.bind(_this);
        _this.webcamVideo = React.createRef();
        _this.remoteVideo = React.createRef();
        return _this;
    }
    VideoChat.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myDecipher, newState, encryptedProps;
            var _this = this;
            return __generator(this, function (_a) {
                myDecipher = (0, decipher_js_1.default)(process.env.PROP_SALT);
                newState = {};
                if (this.props.isLive) {
                    encryptedProps = myDecipher(this.props.p);
                    encryptedProps = JSON.parse(encryptedProps);
                    newState = {
                        authenticatedUserID: encryptedProps.authenticatedUserID,
                        usersEmail: encryptedProps.usersEmail,
                    };
                }
                else {
                    newState = {
                        authenticatedUserID: this.props.authenticatedUserID,
                        usersEmail: this.props.usersEmail,
                    };
                }
                this.setState(newState, function () { return __awaiter(_this, void 0, void 0, function () {
                    var firebaseConfig, firebaseApp, firestore, urlParams, forUserID, withUserID, forUserDisplayName, withUserDisplayName_1, callsCollection_1, filteredCallsCollection, callDocs, callDocsArray_1, availableCalls_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch('/video-chat-tokens', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({})
                                })
                                    .then(function (response) { return response.json(); })
                                    .catch(function (e) { return console.log(e); })];
                            case 1:
                                firebaseConfig = _a.sent();
                                // @ts-ignore
                                if (!firebase.apps) {
                                    firebaseApp = firebase.initializeApp(firebaseConfig);
                                }
                                firestore = (0, firestore_1.getFirestore)(firebaseApp);
                                this.setState({
                                    firestore: firestore,
                                });
                                urlParams = new URLSearchParams(window.location.search);
                                forUserID = urlParams.get('forUserID');
                                withUserID = urlParams.get('withUserID');
                                if (!forUserID) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.getUserNameByID(forUserID)];
                            case 2:
                                forUserDisplayName = _a.sent();
                                this.setState({
                                    forUserID: forUserID,
                                    forUserDisplayName: forUserDisplayName,
                                });
                                return [3 /*break*/, 6];
                            case 3:
                                if (!withUserID) return [3 /*break*/, 6];
                                return [4 /*yield*/, this.getUserNameByID(withUserID)];
                            case 4:
                                withUserDisplayName_1 = _a.sent();
                                callsCollection_1 = (0, firestore_1.collection)(firestore, 'calls');
                                filteredCallsCollection = (0, firestore_1.query)(callsCollection_1, (0, firestore_1.where)('offer.forUserID', '==', this.state.authenticatedUserID));
                                return [4 /*yield*/, (0, firestore_1.getDocs)(filteredCallsCollection)
                                    // Format call docs into array
                                ];
                            case 5:
                                callDocs = _a.sent();
                                callDocsArray_1 = [];
                                callDocs.forEach(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                                    var call;
                                    return __generator(this, function (_a) {
                                        if (doc.id) {
                                            call = doc.data();
                                            call.offer.withUserDisplayName = withUserDisplayName_1;
                                            callDocsArray_1.push(call.offer);
                                        }
                                        return [2 /*return*/];
                                    });
                                }); });
                                availableCalls_1 = [];
                                // @ts-ignore
                                callDocsArray_1.sort(function (a, b) { return new Date(b.createdDate) - new Date(a.createdDate); });
                                callDocsArray_1.forEach(function (callDoc) { return __awaiter(_this, void 0, void 0, function () {
                                    var oldDoc;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(availableCalls_1.length == 5)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, (0, firestore_1.doc)(callsCollection_1, callDoc.callID)];
                                            case 1:
                                                oldDoc = _a.sent();
                                                (0, firestore_1.deleteDoc)(oldDoc);
                                                return [3 /*break*/, 3];
                                            case 2:
                                                if (availableCalls_1.length) {
                                                    // Do nothing
                                                }
                                                else {
                                                    availableCalls_1.push(callDoc);
                                                }
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                this.setState({
                                    withUserID: withUserID,
                                    availableCalls: availableCalls_1,
                                    withUserDisplayName: withUserDisplayName_1,
                                });
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    VideoChat.prototype.startPeerConnection = function () {
        var servers = {
            iceServers: [
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
                },
            ],
            iceCandidatePoolSize: 10,
        };
        return new RTCPeerConnection(servers);
    };
    VideoChat.prototype.startWebcam = function () {
        return __awaiter(this, void 0, void 0, function () {
            var peerConnection, localStream, remoteStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        peerConnection = this.startPeerConnection();
                        this.setState({ peerConnection: peerConnection });
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                    case 1:
                        localStream = _a.sent();
                        remoteStream = new MediaStream();
                        // Push tracks from local stream to peer connection
                        localStream.getTracks().forEach(function (track) {
                            peerConnection.addTrack(track, localStream);
                        });
                        // Pull tracks from remote stream, add to video stream
                        peerConnection.ontrack = function (event) {
                            event.streams[0].getTracks().forEach(function (track) {
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
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoChat.prototype.getUserNameByID = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/user/".concat(userID))
                            .then(function (response) { return response.json(); })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user.displayName];
                }
            });
        });
    };
    VideoChat.prototype.createCall = function () {
        return __awaiter(this, void 0, void 0, function () {
            var context, _a, peerConnection, firestore, forUserID, authenticatedUserID, callDocs, callDoc, offerCandidates, answerCandidates, offerDescription, offer, host, host, host, emailResponse;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        context = this;
                        _a = this.state, peerConnection = _a.peerConnection, firestore = _a.firestore, forUserID = _a.forUserID, authenticatedUserID = _a.authenticatedUserID;
                        callDocs = (0, firestore_1.collection)(firestore, 'calls');
                        return [4 /*yield*/, (0, firestore_1.addDoc)(callDocs, {})];
                    case 1:
                        callDoc = _b.sent();
                        offerCandidates = (0, firestore_1.collection)(callDoc, 'offerCandidates');
                        answerCandidates = (0, firestore_1.collection)(callDoc, 'answerCandidates');
                        this.setState({ callID: callDoc.id });
                        // Get candidates for caller, save to db
                        peerConnection.onicecandidate = function (event) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!event.candidate) return [3 /*break*/, 2];
                                        return [4 /*yield*/, (0, firestore_1.addDoc)(offerCandidates, event.candidate.toJSON())];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, peerConnection.createOffer()];
                    case 2:
                        offerDescription = _b.sent();
                        return [4 /*yield*/, peerConnection.setLocalDescription(offerDescription)];
                    case 3:
                        _b.sent();
                        offer = {
                            callID: callDoc.id,
                            sdp: offerDescription.sdp,
                            type: offerDescription.type,
                            forUserID: forUserID,
                            createdDate: (new Date()).toString().split(' ').slice(0, 5).join(' '),
                        };
                        return [4 /*yield*/, (0, firestore_1.setDoc)(callDoc, ({ offer: offer }))];
                    case 4:
                        _b.sent();
                        try {
                            host = "https://".concat(process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL);
                        }
                        catch (e) {
                            try {
                                host = "https://localhost:".concat(process.env.APP_PORT);
                            }
                            catch (e) {
                                host = 'https://localhost:3000';
                            }
                        }
                        emailResponse = (0, emailFetch_js_1.sendEmailToUser)(forUserID, "Call Started", "<p><b>Your video call has started. <a href=\"".concat(host, "/video-chat?withUserID=").concat(authenticatedUserID, "\">Use this link to go to your video call.</a></p>      <br>      <p><b>Or go to your account profile and click the video chat link under your purchase.</b>"));
                        // @ts-ignore
                        window.socket.emit('Call Sent', forUserID, "<p><b>Your video call has started. <a href=\"/video-chat?withUserID=".concat(authenticatedUserID, "\">Use this link to go to your video call.</a></p>      <br>      <p><b>Or go to your account profile and click the video chat link under your purchase.</b>"));
                        // Listen for remote answer
                        (0, firestore_1.onSnapshot)(callDoc, function (snapshot) {
                            var data = snapshot.data();
                            if (!peerConnection.currentRemoteDescription && (data === null || data === void 0 ? void 0 : data.answer)) {
                                var answerDescription = new RTCSessionDescription(data.answer);
                                peerConnection.setRemoteDescription(answerDescription);
                            }
                        });
                        // When answered, add candidate to peer connection
                        (0, firestore_1.onSnapshot)(answerCandidates, function (snapshot) {
                            snapshot.docChanges().forEach(function (change) {
                                if (change.type === 'added') {
                                    var candidate = new RTCIceCandidate(change.doc.data());
                                    peerConnection.addIceCandidate(candidate);
                                    context.setState({ answered: true });
                                }
                            });
                        });
                        this.setState({
                            hangupButtonDisabled: false,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoChat.prototype.answerCall = function () {
        return __awaiter(this, void 0, void 0, function () {
            var context, _a, peerConnection, firestore, withUserID, authenticatedUserID, callID, callDocs, callDoc, offerCandidates, answerCandidates, callData, offerDescription, answerDescription, answer, host, host, host, emailResponse;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        context = this;
                        _a = this.state, peerConnection = _a.peerConnection, firestore = _a.firestore, withUserID = _a.withUserID, authenticatedUserID = _a.authenticatedUserID;
                        callID = this.state.callID;
                        callDocs = (0, firestore_1.collection)(firestore, 'calls');
                        return [4 /*yield*/, (0, firestore_1.doc)(callDocs, callID)];
                    case 1:
                        callDoc = _b.sent();
                        offerCandidates = (0, firestore_1.collection)(callDoc, 'offerCandidates');
                        answerCandidates = (0, firestore_1.collection)(callDoc, 'answerCandidates');
                        peerConnection.onicecandidate = function (event) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!event.candidate) return [3 /*break*/, 2];
                                        return [4 /*yield*/, (0, firestore_1.addDoc)(answerCandidates, event.candidate.toJSON())];
                                    case 1:
                                        _a.sent();
                                        context.setState({ answered: true });
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, (0, firestore_1.getDoc)(callDoc)];
                    case 2:
                        callData = (_b.sent()).data();
                        offerDescription = callData.offer;
                        return [4 /*yield*/, peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription))];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, peerConnection.createAnswer()];
                    case 4:
                        answerDescription = _b.sent();
                        return [4 /*yield*/, peerConnection.setLocalDescription(answerDescription)];
                    case 5:
                        _b.sent();
                        answer = {
                            type: answerDescription.type,
                            sdp: answerDescription.sdp,
                        };
                        return [4 /*yield*/, (0, firestore_1.updateDoc)(callDoc, { answer: answer })];
                    case 6:
                        _b.sent();
                        try {
                            host = "https://".concat(process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL);
                        }
                        catch (e) {
                            try {
                                host = "https://localhost:".concat(process.env.APP_PORT);
                            }
                            catch (e) {
                                host = 'https://localhost:3000';
                            }
                        }
                        if (withUserID) {
                            emailResponse = (0, emailFetch_js_1.sendEmailToUser)(withUserID, "Call Answered", "<p><b>The video call has started. The customer has answered your call.</p>        <p></p>        <p><a href=\"".concat(host, "/video-chat?forUserID=").concat(authenticatedUserID, "\">Use this link to go to your video call.</a></b></p>"));
                        }
                        (0, firestore_1.onSnapshot)(offerCandidates, function (snapshot) {
                            snapshot.docChanges().forEach(function (change) {
                                if (change.type === 'added') {
                                    var data = change.doc.data();
                                    peerConnection.addIceCandidate(new RTCIceCandidate(data));
                                }
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoChat.prototype.hangup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var peerConnection, localStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        peerConnection = this.state.peerConnection;
                        peerConnection.close();
                        this.webcamVideo.current.srcObject = null;
                        this.remoteVideo.current.srcObject = null;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                    case 1:
                        localStream = _a.sent();
                        localStream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        this.setState({
                            callID: '',
                            webcamButtonDisabled: false,
                            callButtonDisabled: true,
                            answerButtonDisabled: true,
                            hangupButtonDisabled: true,
                            answered: false,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoChat.prototype.refreshCallOffers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, firestore, withUserID, withUserDisplayName_2, callsCollection, callDocs, callDocsArray_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, firestore = _a.firestore, withUserID = _a.withUserID;
                        if (!withUserID) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getUserNameByID(withUserID)];
                    case 1:
                        withUserDisplayName_2 = _b.sent();
                        callsCollection = (0, firestore_1.query)((0, firestore_1.collection)(firestore, 'calls'), (0, firestore_1.where)('offer.forUserID', '==', this.state.authenticatedUserID));
                        return [4 /*yield*/, (0, firestore_1.getDocs)(callsCollection)];
                    case 2:
                        callDocs = _b.sent();
                        callDocsArray_2 = [];
                        callDocs.forEach(function (doc) {
                            if (doc.id) {
                                var call = doc.data();
                                call.offer.withUserDisplayName = withUserDisplayName_2;
                                if (call.offer.forUserID == _this.state.authenticatedUserID) {
                                    callDocsArray_2.push(call.offer);
                                }
                            }
                        });
                        callDocsArray_2.sort(function (a, b) { return Date.parse(b.createdDate) - Date.parse(a.createdDate); });
                        callDocsArray_2 = callDocsArray_2.slice(0, 2);
                        this.setState({
                            availableCalls: callDocsArray_2,
                        });
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VideoChat.prototype.renderCallControls = function () {
        var _this = this;
        var _a = this.state, availableCalls = _a.availableCalls, forUserID = _a.forUserID, forUserDisplayName = _a.forUserDisplayName, withUserID = _a.withUserID, callButtonDisabled = _a.callButtonDisabled, answerButtonDisabled = _a.answerButtonDisabled, callID = _a.callID, withUserDisplayName = _a.withUserDisplayName, usersEmail = _a.usersEmail;
        if (forUserID) {
            return (React.createElement("div", { className: "pure-u-1 pure-u-md-1-2" },
                React.createElement("div", { className: "pad" },
                    React.createElement("h2", null,
                        "Call ",
                        forUserDisplayName),
                    React.createElement("button", { className: "button", id: "callButton", disabled: callButtonDisabled, onClick: this.createCall },
                        callID ? 'Dialed' : 'Create Call',
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPhone })))));
        }
        else if (withUserID) {
            return (React.createElement("div", { className: "pure-u-1 pure-u-md-1-2" },
                React.createElement("div", { className: "pad" },
                    React.createElement("h2", null, "Join a Call"),
                    React.createElement("p", null, "Select the most recent call offer"),
                    React.createElement("p", null, "Not seeing the right call? Try clicking refresh."),
                    React.createElement("button", { className: "button", id: "refreshButton", onClick: this.refreshCallOffers },
                        "Refresh",
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSync })),
                    React.createElement(React.Fragment, null, "\u00A0"),
                    React.createElement("button", { className: "button", id: "hardRefreshButton", onClick: function () { return window.location = window.location; } },
                        "Hard Refresh",
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSync })),
                    React.createElement("div", { className: "fw-form" },
                        React.createElement("div", { className: "flex y-center field optionset" }, availableCalls ?
                            availableCalls.map(function (callOffer) {
                                return React.createElement("div", { key: availableCalls.indexOf(callOffer), style: { maxWidth: '100%' } },
                                    React.createElement("div", { className: "fw-space", style: availableCalls.indexOf(callOffer) == 0 ? { boxShadow: '0 0 3px #9f74e4' } : {} },
                                        availableCalls.indexOf(callOffer) == 0 ?
                                            React.createElement("h4", null, "Most Recent")
                                            :
                                                '',
                                        React.createElement("p", null,
                                            React.createElement("b", null, callOffer.withUserDisplayName)),
                                        React.createElement("div", { style: { whiteSpace: 'nowrap' } },
                                            React.createElement("input", { type: "radio", id: "callOffer_".concat(callOffer.callID), name: "callID", onClick: function () { return _this.setState({ callID: callOffer.callID }); } }),
                                            React.createElement("label", { htmlFor: "callOffer_".concat(callOffer.callID), style: { maxWidth: '100%', whiteSpace: 'normal' } },
                                                "\u00A0Call created on ",
                                                callOffer.createdDate)),
                                        React.createElement("button", { className: "button", id: "answerButton", disabled: answerButtonDisabled || callID != callOffer.callID, onClick: _this.answerCall },
                                            "Answer",
                                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPhone }))));
                            })
                            :
                                '')),
                    React.createElement("p", null, "If you are still not seeing the right call, you can try emailing the user to ask them to send you a call offer."),
                    React.createElement("p", null,
                        withUserDisplayName,
                        "'s email address: ",
                        React.createElement("a", { href: "mailto:".concat(usersEmail) }, usersEmail)))));
        }
        return '';
    };
    VideoChat.prototype.render = function () {
        var answered = this.state.answered;
        return (React.createElement("div", { className: "frame fw-container" },
            React.createElement(Navigation_jsx_1.default, null),
            React.createElement("div", { className: "fw-typography-spacing pure-u-g" },
                React.createElement("h2", null, "Your video chat"),
                React.createElement("div", { className: "flex x-center" },
                    React.createElement("div", { className: "pure-u-1 pure-u-md-1-2" },
                        React.createElement("div", { className: "pad" },
                            React.createElement("h3", null, "Your feed"),
                            React.createElement("video", { id: "webcamVideo", className: "desktop-100", style: { maxHeight: '310px' }, autoPlay: true, playsInline: true, muted: true, ref: this.webcamVideo }))),
                    React.createElement("div", { className: "pure-u-1 pure-u-md-1-2" },
                        React.createElement("div", { className: "pad" },
                            React.createElement("h3", null, "Chat feed"),
                            React.createElement("video", { id: "remoteVideo", className: "desktop-100", style: { maxHeight: '310px' }, autoPlay: true, playsInline: true, ref: this.remoteVideo })))),
                this.state.webcamButtonDisabled ?
                    React.createElement("div", { className: "flex x-center y-center" }, !answered ?
                        this.renderCallControls()
                        :
                            '')
                    :
                        React.createElement("div", { className: "flex x-center pure-u-1" },
                            React.createElement("button", { className: "button", id: "webcamButton", onClick: this.startWebcam },
                                "Start webcam",
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faCamera }))),
                React.createElement("div", { className: "flex x-center pure-u-1" },
                    React.createElement("button", { className: "button", id: "hangupButton", disabled: this.state.hangupButtonDisabled, onClick: this.hangup },
                        "Hangup",
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPhone }))))));
    };
    return VideoChat;
}(React.Component));
exports.default = VideoChat;
