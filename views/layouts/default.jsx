import React from 'react';
 
const DefaultLayout = (props) => {
	return (
		<html>
			<head><title>Video Lessons</title></head>
			<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<script async src={`${props.pathResolver || ''}js/main.js`}></script>
			<script async src={`${props.pathResolver || ''}js/modal.js`}></script>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/fontawesome.min.css"/>
			<body>{props.children}</body>
		</html>
	);
}
 
export default DefaultLayout;