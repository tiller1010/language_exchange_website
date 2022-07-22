import * as React from 'react';
const languages = require('language-list')();

export default function LanguageSelector(props) {

	const { name, id, onChange, value } = props;

	// Required unless specified otherwise
	let required = true;
	if (props.required === false) {
		required = false;
	}

	return (
		<div className="field dropdown">
			<label htmlFor={id}>Language</label>
			<select name={name} id={id} onChange={onChange} value={value} required={required}>
				<option value="">Select a language</option>
				<option>ASL</option>
				{languages.getLanguageCodes().map((langCode) => 
					<option key={langCode}>{languages.getLanguageName(langCode)}</option>
				)}
			</select>
		</div>
	)
}