import React from 'react';
 
const DefaultLayout = (props) => {
	return (
		<html>
			<head><title>Video Lessons</title></head>
			<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<link href={`${props.pathResolver || ''}css/pure-min.css`} rel="stylesheet"></link>
			<link href={`${props.pathResolver || ''}css/grids-responsive-min.css`} rel="stylesheet"></link>
			<link href={`${props.pathResolver || ''}css/slick.css`} rel="stylesheet"></link>
			<link href={`${props.pathResolver || ''}css/slick-theme.css`} rel="stylesheet"></link>
			<link href={`${props.pathResolver || ''}css/custom.css`} rel="stylesheet"></link>
			<script async src={`${props.pathResolver || ''}js/main.js`}></script>
			<body>{props.children}</body>
		</html>
	);
}
 
export default DefaultLayout;