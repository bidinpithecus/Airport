import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SingleAirplane from '../components/single-airplane';
import ManyAirplanes from '../components/many-airplanes';
import { api } from '../App';

export function Airplane() {
	const [apiData, setApiData] = useState(null);
	const [error, setError] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response;
				if (id) {
					response = await api.get(`/completeAirplane/${id}`);
				} else {
					response = await api.get(`/completeAirplane`);
				}
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, [id]);

	if (!id) {
		return (
			<div>
				{apiData ? (
					<ManyAirplanes data={apiData} />
				) : (
					<div>Loading...</div>
				)}
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			{apiData ? (
				<SingleAirplane data={apiData} />
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
}
