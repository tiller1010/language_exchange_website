
import React from 'react';
import DisableDevtools from '../components/DisableDevtools';

const DefaultLayout = (props) => {
	return (
		<html style={{ fontFamily: 'sans-serif' }} translate="yes" lang="en">
			<head>
				<title>Open Education App</title>
				<meta name="description"
				content="Language can only be learned if it is used. Why not start using the language you want to learn today? Complete free lessons and challenges to sharpen your skills. Practice your new skills with language learners around the world. Schedule a time to get real practice with a native speaker."></meta>
				<script src={`${props.pathResolver || ''}js/main.js`}></script>
				<script type="text/javascript">{"window.isLive = " + props.isLive}</script>
				{props.isLive ?
					<DisableDevtools />
					:
					''
				}
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <script async src={`${props.pathResolver || ''}js/main.js`}></script>
        <script async src={`${props.pathResolver || ''}js/modal.js`}></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/fontawesome.min.css"/>

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NPHYEJZVPM"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NPHYEJZVPM');
        `}}></script>

			</head>
			<body style={{ backgroundColor: '#eee' }}>
				<div style={{ minHeight: '100vh' }}>
					{props.children}
				</div>
				<footer className="flex-container flex-horizontal-center grey-section">
					<div className="fw-container">
						<div className="fw-space" style={{ paddingBottom: '150px' }}>
							<p>&copy; {(new Date()).getFullYear()} Copyright Tyler Trout</p>
						</div>
					</div>
				</footer>
			</body>
		</html>
	);
}

export default DefaultLayout;
