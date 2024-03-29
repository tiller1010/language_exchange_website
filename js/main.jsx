import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';
import VideosIndex from './components/VideosIndex.jsx';
import VideosAdd from './components/VideosAdd.jsx';
import Level from './components/Level.jsx';
import Topic from './components/Topic.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AccountProfile from './components/AccountProfile.jsx';
import ProfileEditForm from './components/ProfileEditForm.js';
import VideoChat from './components/VideoChat.js';
import Chats from './components/Chats.jsx';
import UserFeed from './components/UserFeed.js';
import Lessons from './components/Lessons.js';
import NotificationModal from './components/NotificationModal.js';
import ForgotPasswordForm from './components/ForgotPasswordForm.js';
import ResetPasswordForm from './components/ResetPasswordForm.js';

import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'css-modal/build/modal.css';

import { io } from "socket.io-client";


// Initialize Framewerk after app is rendered
import { initFramewerk } from 'werkbot-framewerk';
setTimeout(() => {
  initFramewerk(false);
  window.dispatchEvent(new Event('load'));
}, 1000);


// Add a string method to convert times to AM/PM format
String.prototype.convertTo12HourTime = function() {
  // Should be called like: '21:00.convertTo12HourTime()'. '1/1/2000' is an arbitrary valid date.
  return new Date('1/1/2000 ' + this).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};


// Attempt Login with JWT
(async function() {
  if (!sessionStorage.getItem('didJWTLogin')) {
    sessionStorage.setItem('didJWTLogin', true);
    await fetch('/do-jwt-login')
      .then((response) => response.json())
      .then((data) => data)
      .then(async (doJWTLogin) => {
        if (doJWTLogin) {
          await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              displayName: 'JWT_DISPLAYNAME',
              password: 'JWT_PASSWORD',
              backURL: document.location.pathname,
            })
          })
          .then((response) => document.location = response.url);
        }
      })
      .catch((e) => console.log('No JWT found.'));
  }
})();


function initializeReactApp() {
  var homeElement = document.getElementById('home');
  if (homeElement) {
    if (!homeElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = homeElement.getAttribute('p');
        homeElement.dataset.loaded = true;
        return ReactDOM.render(<Home p={p} isLive={isLive}/>, homeElement);
      } else {
        var userLikedVideos = homeElement.getAttribute('userlikedvideos');
        var userID = homeElement.getAttribute('userid');
        homeElement.dataset.loaded = true;
        return ReactDOM.render(<Home userLikedVideos={userLikedVideos} userID={userID} isLive={isLive}/>, homeElement);
      }
    }
  }

  var videosElement = document.getElementById('videos');
  if (videosElement) {
    if (!videosElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = videosElement.getAttribute('p');
        videosElement.dataset.loaded = true;
        return ReactDOM.render(<VideosIndex p={p} isLive={isLive}/>, videosElement);
      } else {
        var userLikedVideos = videosElement.getAttribute('userlikedvideos');
        var userID = videosElement.getAttribute('userid');
        videosElement.dataset.loaded = true;
        return ReactDOM.render(<VideosIndex userLikedVideos={userLikedVideos} userID={userID} isLive={isLive}/>, videosElement);
      }
    }
  }

  var videosAddElement = document.getElementById('videos-add');
  if (videosAddElement) {
    if (!videosAddElement.hasAttribute('data-loaded')) {
      var video = videosAddElement.getAttribute('video');
      videosAddElement.dataset.loaded = true;
      return ReactDOM.render(<VideosAdd video={video}/>, videosAddElement);
    }
  }

  var levelElement = document.getElementById('level');
  if (levelElement) {
    if (!levelElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = levelElement.getAttribute('p');
        levelElement.dataset.loaded = true;
        return ReactDOM.render(<Level p={p} isLive={isLive}/>, levelElement);
      } else {
        var levelID = levelElement.getAttribute('levelid');
        levelElement.dataset.loaded = true;
        return ReactDOM.render(<Level levelID={levelID} isLive={isLive}/>, levelElement);
      }
    }
  }

  var topicElement = document.getElementById('topic');
  if (topicElement) {
    if (!topicElement.hasAttribute('data-loaded')) {
      var levelID = topicElement.getAttribute('levelid');
      var topicID = topicElement.getAttribute('topicid');
      var completed = topicElement.getAttribute('completed');
      topicElement.dataset.loaded = true;
      return ReactDOM.render(<Topic levelID={levelID} topicID={topicID} completed={eval(completed)}/>, topicElement);
    }
  }

  var loginElement = document.getElementById('login');
  if (loginElement) {
    if (!loginElement.hasAttribute('data-loaded')) {
      var errors = loginElement.getAttribute('errors');
      loginElement.dataset.loaded = true;
      return ReactDOM.render(<Login errors={errors}/>, loginElement);
    }
  }

  var registerElement = document.getElementById('register');
  if (registerElement) {
    if (!registerElement.hasAttribute('data-loaded')) {
      var errors = registerElement.getAttribute('errors');
      registerElement.dataset.loaded = true;
      return ReactDOM.render(<Register errors={errors}/>, registerElement);
    }
  }

  var accountProfileElement = document.getElementById('account-profile');
  if (accountProfileElement) {
    if (!accountProfileElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = accountProfileElement.getAttribute('p');
        accountProfileElement.dataset.loaded = true;
        return ReactDOM.render(<AccountProfile p={p} isLive={isLive}/>, accountProfileElement);
      } else {
        var userID = accountProfileElement.getAttribute('userid');
        var authenticatedUserID = accountProfileElement.getAttribute('authenticateduserid');
        var isCurrentUser = accountProfileElement.getAttribute('iscurrentuser');
        var stripeAccountPending = accountProfileElement.getAttribute('stripeaccountpending');
        var pathResolver = accountProfileElement.getAttribute('pathresolver');
        accountProfileElement.dataset.loaded = true;
        return ReactDOM.render(<AccountProfile userID={userID} authenticatedUserID={authenticatedUserID} isCurrentUser={eval(isCurrentUser)} stripeAccountPending={eval(stripeAccountPending)} pathResolver={pathResolver} isLive={isLive}/>, accountProfileElement);
      }
    }
  }

  var accountProfileEditElement = document.getElementById('account-profile-edit');
  if (accountProfileEditElement) {
    if (!accountProfileEditElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = accountProfileEditElement.getAttribute('p');
        accountProfileEditElement.dataset.loaded = true;
        return ReactDOM.render(<ProfileEditForm p={p} isLive={isLive}/>, accountProfileEditElement);
      } else {
        var userID = accountProfileEditElement.getAttribute('userid');
        var pathResolver = accountProfileEditElement.getAttribute('pathresolver');
        accountProfileEditElement.dataset.loaded = true;
        return ReactDOM.render(<ProfileEditForm userID={userID} pathResolver={pathResolver} isLive={isLive}/>, accountProfileEditElement);
      }
    }
  }

  var findUsersElement = document.getElementById('find-users');
  if (findUsersElement) {
    if (!findUsersElement.hasAttribute('data-loaded')) {
      findUsersElement.dataset.loaded = true;
      return ReactDOM.render(<UserFeed SearchFormHeading="Find friends"/>, findUsersElement);
    }
  }

  var videoChatElement = document.getElementById('video-chat');
  if (videoChatElement) {
    if (!videoChatElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = videoChatElement.getAttribute('p');
        videoChatElement.dataset.loaded = true;
        return ReactDOM.render(<VideoChat p={p} isLive={isLive}/>, videoChatElement);
      } else {
        var authenticatedUserID = videoChatElement.getAttribute('authenticateduserid');
        var usersEmail = videoChatElement.getAttribute('usersemail');
        videoChatElement.dataset.loaded = true;
        return ReactDOM.render(<VideoChat authenticatedUserID={authenticatedUserID} usersEmail={usersEmail} isLive={isLive}/>, videoChatElement);
      }
    }
  }

  var chatsElement = document.getElementById('chats');
  if (chatsElement) {
    if (!chatsElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = chatsElement.getAttribute('p');
        chatsElement.dataset.loaded = true;
        return ReactDOM.render(<Chats p={p} isLive={isLive}/>, chatsElement);
      } else {
        var authenticatedUserID = chatsElement.getAttribute('authenticateduserid');
        chatsElement.dataset.loaded = true;
        return ReactDOM.render(<Chats authenticatedUserID={authenticatedUserID} isLive={isLive}/>, chatsElement);
      }
    }
  }

  var lessonsElement = document.getElementById('lessons');
  if (lessonsElement) {
    if (!lessonsElement.hasAttribute('data-loaded')) {
      if (window.isLive) {
        var p = lessonsElement.getAttribute('p');
        lessonsElement.dataset.loaded = true;
        return ReactDOM.render(<Lessons p={p} isLive={isLive}/>, lessonsElement);
      } else {
        var authenticatedUserID = lessonsElement.getAttribute('authenticateduserid');
        lessonsElement.dataset.loaded = true;
        return ReactDOM.render(<Lessons authenticatedUserID={authenticatedUserID} isLive={isLive}/>, lessonsElement);
      }
    }
  }

  var forgotPasswordElement = document.getElementById('forgot-password');
  if (forgotPasswordElement) {
    if (!forgotPasswordElement.hasAttribute('data-loaded')) {
      forgotPasswordElement.dataset.loaded = true;
      return ReactDOM.render(<ForgotPasswordForm/>, forgotPasswordElement);
    }
  }

  var resetPasswordElement = document.getElementById('reset-password');
  if (resetPasswordElement) {
    if (!resetPasswordElement.hasAttribute('data-loaded')) {
      var errors = resetPasswordElement.getAttribute('errors');
      resetPasswordElement.dataset.loaded = true;
      return ReactDOM.render(<ResetPasswordForm errors={errors}/>, resetPasswordElement);
    }
  }
}
initializeReactApp();
window.addEventListener('load', initializeReactApp);


/* Uses Webpack Plugin. "process.env" is not a real variable */
try {
  var socketHost = `https://${process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL}`;
} catch(e) {
  try {
    var socketHost = `https://localhost:${process.env.APP_PORT}`;
  } catch(e) {
    var socketHost = 'https://localhost:3000';
  }
}
window.socket = io(socketHost);
fetch('/current-user-id')
  .then(res => res.json())
  .then(socketUserID => {
    window.socket.emit('Hello Server', socketUserID)
    window.socket.on('Hello Client', (...args) => {
      console.log('Hello Client')
    });
    window.socket.on('Call Incoming', ({ content, from }) => {
      console.log('Call Incoming From server')
      var callModal = document.createElement('div');
      callModal = document.body.appendChild(callModal);
      ReactDOM.render(<NotificationModal buttonAnchor={`call-modal-from-${from}`} modalTitle={'You have an incoming call!'} modalContent={content} />, callModal);
      document.location += `#call-modal-from-${from}`;
    });
  })
  .catch((e) => e);
