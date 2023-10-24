import React, { useEffect, useState } from 'react';
import { api } from '../App'

export function Home() {
	const [apiData, setApiData] = useState({});
	const [error, setError] = useState(null);
	console.log(api);

	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const response = await api.get('/');
		  setApiData(response.data);
		} catch (err: any) {
		  setError(err.message);
		}
	  };

	  fetchData();
	}, []);

	return (
	  <div>
		<h1>Home page</h1>
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
