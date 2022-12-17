import React from 'react';

const SSRView = (props) => {
  return (
		<div>
			<style>
				{"nav svg { max-width: 5px; }\
					.lds-facebook {\
					display: inline-block;\
					position: relative;\
					width: 80px;\
					height: 80px;\
					}\
					.lds-facebook div {\
					display: inline-block;\
					position: absolute;\
					left: 8px;\
					width: 16px;\
					background: #555;\
					animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;\
					}\
					.lds-facebook div:nth-child(1) {\
					left: 8px;\
					animation-delay: -0.24s;\
					}\
					.lds-facebook div:nth-child(2) {\
					left: 32px;\
					animation-delay: -0.12s;\
					}\
					.lds-facebook div:nth-child(3) {\
					left: 56px;\
					animation-delay: 0;\
					}\
					@keyframes lds-facebook {\
					0% {\
					top: 8px;\
					height: 64px;\
					}\
					50%, 100% {\
					top: 24px;\
					height: 32px;\
					}\
					}\
					.window-component{\
					transition: transform .25s ease;\
					}\
				"}
			</style>
			<nav><div className="flex"><div className="add-content-btn-container flex flex-vertical-center"><a href="/videos/add" title="Add content of your own" className="add-content-btn"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" className="svg-inline--fa fa-plus fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></a></div><div className="small-pad"><a href="/" className="button"><span>Home</span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="home" className="svg-inline--fa fa-home fa-w-18 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg></a></div><div className="small-pad"><a href="/lessons" className="button"><span>Lessons</span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book" className="svg-inline--fa fa-book fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"></path></svg></a></div><div className="small-pad"><a href="/videos" className="button"><span>Videos</span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" className="svg-inline--fa fa-play fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></a></div><div className="small-pad"><a href="/chats" className="button"><span>Chat</span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comments" className="svg-inline--fa fa-comments fa-w-18 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"></path></svg></a></div><div className="small-pad"><a href="/account-profile" className="button"><span>Account Profile</span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" className="svg-inline--fa fa-user fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></a></div></div></nav>
			<div className="home-banner flex-container fw-typography-spacing" style={{ background: 'url("/images/glacier-landscape.jpeg") center center / cover no-repeat' }}><div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(rgb(116, 125, 232), rgb(159, 116, 228))', opacity: '0.1', top: '0px', left: '0px' }}></div><div className="desktop-100 home-banner-content" style={{ position: 'relative' }}><div className="fw-container"><div className="fw-space"><h1 style={{ marginBottom: '5px' }}>Use the language you are learning today</h1><p>Language can only be learned if it is used. Why not start using the language you want to learn today?</p></div></div></div><div className="desktop-100 fw-container flex-container flex-vertical-bottom" style={{ position: 'relative' }}><div className="fw-space"><div className="flex-container flex-vertical-stretch"><div className="desktop-33 tablet-100"><div className="fw-space"><a href="/lessons" className="home-banner-link"><div className="fw-space"><h2 style={{ marginBottom: '5px' }}>Improve your skills</h2><p>Complete free lessons and challenges to sharpen your skills.</p></div></a></div></div><div className="desktop-33 tablet-100"><div className="fw-space"><a href="/videos" className="home-banner-link"><div className="fw-space"><h2 style={{ marginBottom: '5px' }}>Share what you have learned</h2><p>Practice your new skills with language learners around the world.</p></div></a></div></div><div className="desktop-33 tablet-100"><div className="fw-space"><a href="/chats" className="home-banner-link"><div className="fw-space"><h2 style={{ marginBottom: '5px' }}>Practice with a native speaker</h2><p>Schedule a time to get real practice with a native speaker.</p></div></a></div></div></div></div></div></div>
			<div style={{
			  position: 'absolute',
			  width: '100%',
			  height: '100%',
			  display: 'flex',
			  background: '#eee',
			  top: '0',
			  left: '0',
			  alignItems: 'center',
			  justifyContent: 'center',
			}}>
				<div className="lds-facebook"><div></div><div></div><div></div></div>
			</div>
		</div>
  );
}

export default SSRView;
