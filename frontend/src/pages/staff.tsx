import React, { useEffect, useState } from 'react';
import { api } from '../App'

export function Staff() {
	const [apiData, setApiData] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get('/staff');
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, []);

	return (
	  <div>
		<h1>Staff page</h1>
		{error ? (
		  <div>Error: {error}</div>
		) : (
		  <div>
			<h2>Data from API:</h2>
			<pre>{JSON.stringify(apiData, null, 2)}</pre>
		  </div>
		)}
	  </div>
	);
}
