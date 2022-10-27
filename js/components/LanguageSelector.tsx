import * as React from 'react';
const languages = require('language-list')();

export default function LanguageSelector(props) {

	const { name, id, onChange, value } = props;

	// Required unless specified otherwise
	let required = true;
	if (props.required === false) {
		required = false;
	}

	// Get all languages and format the selection array
	let languagesArray = [];
	languages.getLanguageCodes().forEach((langCode) => {
		languagesArray.push({
			languageName: languages.getLanguageName(langCode),
			langCode,
		});
	});

	// Filter for select languages
	const validLanguages = [
		'English',
		'Spanish',
		'French',
		'German',
		'Italian',
		'Japanese',
		'Korean',
		'Russian',
		'Chinese',
		'Portugese',
		'Swedish',
		'Finnish',
		'Arabic',
		'Hebrew',
	];
	languagesArray = languagesArray.filter((lang) => validLanguages.indexOf(lang.languageName) != -1);

	// Custom languages
	languagesArray.push({
		languageName: 'ASL',
		langCode: 'ASL',
	});
	languagesArray.push({
		languageName: 'Ukrainian',
		langCode: 'Ukrainian',
	});

	// Sort langauges by name
	languagesArray = languagesArray.sort((a, b) => a.languageName.localeCompare(b.languageName));

	return (
		<div className={`field dropdown ${props.className || ''}`}>
			<label htmlFor={id}>Language</label>
			<select name={name} id={id} onChange={onChange} value={value} required={required}>
				<option value="">Select a language</option>
				{languagesArray.map((lang) =>
					<option key={lang.langCode}>{lang.languageName}</option>
				)}
			</select>
		</div>
	)
}