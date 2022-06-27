import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

function renderMedia(FeaturedMedia) {
	if (FeaturedMedia.data) {
		switch (FeaturedMedia.data.attributes.mime) {
			case 'image/jpeg':
				return (
					<div className="img-container desktop-100">
						<img src={`${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}
							alt={FeaturedMedia.data.attributes.alternativeText}
						/>
					</div>
				);
			default:
				return <p>Invalid media</p>
		}
	}
	return <p>Invalid media</p>
}

export default function TopicLink(props) {

	let { topic, levelID } = props;

	/*
		If topic was completed and saved with Strapi 3,
		format like Strapi 4 API
	*/
	if (!topic.attributes) {
		topic.attributes = { ...topic };
		topic.attributes.FeaturedMedia = { data: { attributes: { ...topic.FeaturedImage } } };
		topic.attributes.FeaturedMedia.data.attributes.alternativeText = topic.FeaturedImage.name;
	}

	return (
		<div className="flex flex-vertical-center x-space-between">
			<h3 className="pad no-y no-left">{topic.attributes.Topic}</h3>
			<a href={`/level/${levelID}/topic/${topic.id}`} aria-label={`View challenges on ${topic.attributes.Topic}`} className="button" style={{ alignSelf: 'center' }}>
				View Topic
				<FontAwesomeIcon icon={faLongArrowAltRight}/>
			</a>
			<a href={`/level/${levelID}/topic/${topic.id}`} aria-label={`View challenges on ${topic.attributes.Topic}`} className="desktop-100">
				{renderMedia(topic.attributes.FeaturedMedia)}
			</a>
		</div>
	);
}