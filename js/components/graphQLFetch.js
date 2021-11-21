export default async function graphQLFetch(query, variables = {}, multipart = false){
	let request;
	if(multipart){
		const data = {
			operations: JSON.stringify({
				query,
				variables: {
					...variables,
					file: null
				}
			}),
			map: JSON.stringify({
				'0': [
					'variables.file'
				]
			})
		};
		const requestBody = new FormData();
		for(const name in data) {
			requestBody.append(name, data[name]);
		}
		requestBody.append('0', variables.file);
		request = {
			method: 'POST',
			body: requestBody
		}
	} else {
		request = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, variables })
		}
	}
	const response = await fetch('/graphql', request);
	const responseBody = await response.text();
	let result;
	if(multipart){
		result = responseBody;
	} else {
		result = JSON.parse(responseBody);
	}
	return result.data;
}