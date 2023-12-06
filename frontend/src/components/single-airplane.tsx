import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App';
import { AirplaneModel, CompleteTestMade, Flight, Location } from '../api/schemas';

interface SingleAirplaneProps {
	data: Record<string, any>;
};

const popupStyle: React.CSSProperties = {
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	background: 'rgb(250, 250, 250)',
	border: '2px solid rgb(250, 250, 250)',
	padding: '20px',
	boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
	borderRadius: '10px',
	color: 'rgb(32, 35, 41)',
	width: '550px',
	minHeight: '650px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
};

const highlightedButtonStyle: React.CSSProperties = {
	background: 'rgb(32, 35, 41)',
	color: 'rgb(250, 250, 250)',
	border: '1px solid rgb(32, 35, 41)',
	padding: '10px 20px',
	cursor: 'pointer',
	borderRadius: '10px',
};

const buttonStyle: React.CSSProperties = {
	background: 'rgb(250, 250, 250)',
	color: 'rgb(42, 45, 51)',
	border: '1px solid rgb(32, 35, 41)',
	padding: '10px 20px',
	cursor: 'pointer',
	borderRadius: '10px',
	fontSize: '16px'
};

const testStyle: React.CSSProperties = {
	background: 'rgb(250, 250, 250)',
	border: '1px solid rgb(32, 35, 41)',
	padding: '10px',
	boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
	borderRadius: '5px',
	marginTop: '5px',
	marginBottom: '5px'
};

const buttonWithImageStyle: React.CSSProperties = {
	background: 'none',
	border: 'none',
	width: '32px',
	height: '32px',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
};

const TestEntry: React.FC<{ testId: string }> = ({ testId }) => {
	const [apiData, setApiData] = useState<CompleteTestMade | null>(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response;
				if (testId) {
					response = await api.get(`/completeTest/${testId}`);
				} else {
					response = await api.get(`/completeTest`);
				}
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, [testId]);

	if (apiData === null) {
		return <div>Loading...</div>;
	}

	const isPassed = apiData.obtained_score >= apiData.minimum_score;

	const handleEditClick = () => {
		// Implement edit functionality here
	};

	const handleDeleteClick = () => {
		// Implement delete functionality here
	};

	const calculateDuration = () => {
		const start = new Date(apiData.start_date);
		const finish = new Date(apiData.finish_date);

		const durationInMillis = finish.getTime() - start.getTime();

		const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
		const minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60));

		return `${hours} horas ${minutes} minutos`;
	};

	return (
		<div key={testId} style={testStyle}>
			<div style={{ display: 'flex' }}>
				<button style={{ ...buttonWithImageStyle, marginRight: '10px' }}>
					<img
						src={'/edit.png'}
						alt="Editar"
						onClick={handleEditClick}
					/>
				</button>
				<button style={{ ...buttonWithImageStyle, marginLeft: '10px' }}>
					<img
						src={'/delete.png'}
						alt="Remover"
						onClick={handleDeleteClick}
					/>
				</button>
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Nome:</strong> {apiData.test_name}
			</div>
			<div style={{ margin: '5px' }}>
				<strong>{isPassed ? 'Passou' : 'Falhou'}: </strong> ({ apiData.obtained_score } / { apiData.minimum_score })
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Realizado por:</strong> <Link to={`/technician/${String(apiData.technician_id)}`}>{String(apiData.technician_id)}</Link>
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Duração:</strong> {calculateDuration()}
			</div>
		</div>
	);
};

const FlightEntry: React.FC<{ flightId: string, modelCapacity: number }> = ({ flightId, modelCapacity }) => {
	const [apiFlightData, setApiFlightData] = useState<Flight | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [startLocation, setStartLocation] = useState<Location | null>(null);
	const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);

	useEffect(() => {
	  const fetchData = async () => {
		try {
		  if (flightId) {
			const response = await api.get(`/flight/${flightId}`);
			setApiFlightData(response.data);
		  }
		} catch (err: any) {
		  setError(err.message);
		}
	  };

	  fetchData();
	}, [flightId]);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				if (apiFlightData) {
				const startLocationResponse = await api.get(`/location/${apiFlightData.start_location_id}`);
				const destinationLocationResponse = await api.get(`/location/${apiFlightData.destination_location_id}`);

				setStartLocation(startLocationResponse.data);
				setDestinationLocation(destinationLocationResponse.data);
				}
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchLocations();
	}, [apiFlightData]);

	if (apiFlightData === null || startLocation === null || destinationLocation === null) {
		return <div>Loading...</div>;
	}

	const handleEditClick = () => {
		// Implement edit functionality here
	};

	const handleDeleteClick = () => {
		// Implement delete functionality here
	};

	return (
		<div key={flightId} style={testStyle}>
			<div style={{ display: 'flex' }}>
				<button style={{ ...buttonWithImageStyle, marginRight: '10px' }}>
					<img
						src={'/edit.png'}
						alt="Editar"
						onClick={handleEditClick}
					/>
				</button>
				<button style={{ ...buttonWithImageStyle, marginLeft: '10px' }}>
					<img
						src={'/delete.png'}
						alt="Remover"
						onClick={handleDeleteClick}
					/>
				</button>
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Piloto:</strong> { String(apiFlightData.pilot_id) }
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Origem:</strong> { startLocation.number }, { startLocation.city }, { startLocation.country }
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Destino:</strong> { destinationLocation.number }, { destinationLocation.city }, { destinationLocation.country }
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Assentos:</strong> { apiFlightData.occupied_seats } / { modelCapacity }
			</div>
		</div>
	);
};

const useAirplaneModelData = (modelId: string) => {
	const [apiAirplaneModelData, setApiAirplaneModelData] = useState<AirplaneModel | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
			const response = await api.get(`/airplaneModel/${modelId}`);
			setApiAirplaneModelData(response.data);
			} catch (error) {
			console.error('Error fetching model data:', error);
			}
		};

		fetchData();
	}, [modelId]);

	return apiAirplaneModelData;
};

const SingleAirplane: React.FC<SingleAirplaneProps> = ({ data }) => {
	const apiAirplaneModelData = useAirplaneModelData(data.model_id);
	let modelCapacity = 1;

	if (apiAirplaneModelData !== null) {
		modelCapacity = apiAirplaneModelData.capacity;
	}

	const generateListItems = (listType: string) => {
	  if (listType === 'flight') {
		return (
		  <div>
			<ul>
			  <Link to={`/flight`} key={'new_flight'}>
				Adicionar novo voo
			  </Link>
			  {data.flight_ids.map((id: string) => (
				<FlightEntry key={id} flightId={id} modelCapacity={modelCapacity}></FlightEntry>
			  ))}
			</ul>
		  </div>
		);
	  } else if (listType === 'test') {
		return (
		  <div>
			<Link to={`/test`} key={'new_test'}>
			  Realizar novo teste
			</Link>
			{data.test_ids.map((id: string) => (
			  <TestEntry key={id} testId={id}></TestEntry>
			))}
		  </div>
		);
	  }
	  return null;
	};

	const [showFlightIdsList, setShowFlightIdsList] = useState(false);
	const [showTestsIdsList, setShowTestsIdsList] = useState(false);

	const handleShowFlightIdsList = () => {
	  setShowTestsIdsList(false);
	  setShowFlightIdsList(!showFlightIdsList);
	};

	const handleShowTestsIdsList = () => {
	  setShowFlightIdsList(false);
	  setShowTestsIdsList(!showTestsIdsList);
	};

	return (
	  <div style={popupStyle}>
		<h2 style={{ color: 'rgb(32, 35, 41)' }}>ID Avião: {data.airplane_id}</h2>
		<h2 style={{ color: 'rgb(32, 35, 41)' }}>Modelo: {apiAirplaneModelData?.code}</h2>
		<hr style={{ width: '100%' }}></hr>
		<div>
		  <button
			style={{
			  ...buttonStyle,
			  ...(showFlightIdsList ? highlightedButtonStyle : {}),
			  marginRight: '10px',
			}}
			onClick={handleShowFlightIdsList}
		  >
			{data.flight_ids.length + ' ' + (data.flight_ids.length > 1 || data.flight_ids.length === 0 ? 'Voos' : 'Voo')}
		  </button>
		  <button
			style={{
			  ...buttonStyle,
			  ...(showTestsIdsList ? highlightedButtonStyle : {}),
			  marginRight: '10px',
			}}
			onClick={handleShowTestsIdsList}
		  >
			{data.test_ids.length + ' ' + (data.test_ids.length > 1 || data.test_ids.length === 0 ? 'Testes' : 'Teste')}
		  </button>
		</div>
		{showFlightIdsList && generateListItems('flight')}
		{showTestsIdsList && generateListItems('test')}
	  </div>
	);
  };


export default SingleAirplane;
