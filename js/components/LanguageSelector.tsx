import * as React from 'react';
const languages = require('language-list')();

export default function LanguageSelector(props) {

	const { name, id, onChange, value } = props;

	return (
		<div className="field dropdown">
			<label htmlFor={id}>Language</label>
			<select name={name} id={id} onChange={onChange} value={value} required={true}>
				<option value="">Select a language</option>
				<option>ASL</option>
				{languages.getLanguageCodes().map((langCode) => 
					<option key={langCode}>{languages.getLanguageName(langCode)}</option>
				)}
			</select>
		</div>
	)
}