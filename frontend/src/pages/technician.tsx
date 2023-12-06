import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../App';
import SingleProTechnician from '../components/single-technician-pro';
import ManyProTechnicians from '../components/many-technician-pro';

export function Technician() {
	const [apiData, setApiData] = useState(null);
	const [error, setError] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response;
				if (id) {
					response = await api.get(`/completeTechnician/${id}`);
				} else {
					response = await api.get(`/completeTechnician`);
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
				{ apiData ? (
					<ManyProTechnicians data={apiData} />
				) : (
					<div>Carregando todos os peritos...</div>
				)}
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			{ apiData ? (
				<SingleProTechnician data = { apiData } />
			) : (
				<div>Carregando perito...</div>
			)}
		</div>
	);
}
