import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App';
import { AirplaneModel, CompleteTestMade, Employee } from '../api/schemas';

interface SingleProTechnicianProps {
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

	let isPassed: boolean = false;
	let start: Date = new Date();
	let finish: Date = new Date();

	if (apiData !== null) {
		isPassed = apiData.obtained_score >= apiData.minimum_score;
		start = new Date(apiData?.start_date);
		finish = new Date(apiData?.finish_date);
	}

	const handleEditClick = () => {
		// Implement edit functionality here
	};

	const handleDeleteClick = () => {
		// Implement delete functionality here
	};

	const calculateDuration = () => {
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
				<strong>Nome:</strong> {apiData?.test_name}
			</div>
			<div style={{ margin: '5px' }}>
				<strong>{isPassed ? 'Passou' : 'Falhou'}: </strong> ({ apiData?.obtained_score } / { apiData?.minimum_score })
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Avião:</strong> <Link to={`/airplane/${String(apiData?.airplane_id)}`}>{ String(apiData?.airplane_id) }</Link>
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Duração:</strong> {calculateDuration()}
			</div>
		</div>
	);
};

const ModelEntry: React.FC<{ modelId: string }> = ({ modelId }) => {
	const [error, setError] = useState<string | null>(null);
	const [apiData, setApiData] = useState<AirplaneModel | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response;
				if (modelId) {
					response = await api.get(`/airplaneModel/${modelId}`);
				} else {
					response = await api.get(`/airplaneModel`);
				}
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, [modelId]);

	const handleEditClick = () => {
		// Implement edit functionality here
	};

	const handleDeleteClick = () => {
		// Implement delete functionality here
	};

	return (
		<div key={modelId} style={testStyle}>
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
				<strong>ID:</strong> { String(modelId) }
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Código:</strong> { String(apiData?.code) }
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Capacidade:</strong> { apiData?.capacity } Assentos
			</div>
			<div style={{ margin: '5px' }}>
				<strong>Peso:</strong> { apiData?.weight } Kg
			</div>
		</div>
	);
};

const SingleProTechnician: React.FC<SingleProTechnicianProps> = ({ data }) => {
	const [error, setError] = useState<string | null>(null);
	const [apiData, setApiData] = useState<Employee | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response;
				if (data.technician_id) {
					response = await api.get(`/employee/${data.technician_id}`);
				} else {
					response = await api.get(`/employees/`);
				}
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, [data]);

	const generateListItems = (listType: string) => {
		if (listType === 'model') {
			return (
				<div>
					<ul>
					<Link to={`/technician_pro`} state={{ employee_id: data.technician_id }}key={'new_model'}>
						Adicionar novo modelo de perícia
					</Link>
					{data.models_pro_id.map((id: string) => (
						<ModelEntry key={id} modelId={id}></ModelEntry>
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
					{data.tests_made_id.map((id: string) => (
					<TestEntry key={id} testId={id}></TestEntry>
					))}
				</div>
			);
		}
		return null;
	};

	const [showModelIdsList, setShowModelIdsList] = useState(false);
	const [showTestsIdsList, setShowTestsIdsList] = useState(false);

	const handleShowModelIdsList = () => {
		setShowTestsIdsList(false);
		setShowModelIdsList(!showModelIdsList);
	};

	const handleShowTestsIdsList = () => {
		setShowModelIdsList(false);
		setShowTestsIdsList(!showTestsIdsList);
	};

	return (
		<div style={popupStyle}>
			<h2 style={{ color: 'rgb(32, 35, 41)' }}>Perito {apiData?.name}</h2>
			<h3 style={{ color: 'rgb(32, 35, 41)' }}>ID: {data.technician_id}</h3>
			<h3 style={{ color: 'rgb(32, 35, 41)' }}>Salário: R$ {apiData?.salary},00</h3>
			<hr style={{ width: '100%' }}></hr>
			<div>
				<button
					style={{
					...buttonStyle,
					...(showModelIdsList ? highlightedButtonStyle : {}),
					marginRight: '10px',
					}}
					onClick={handleShowModelIdsList}
				>
					{data.models_pro_id.length + ' ' + (data.models_pro_id.length > 1 || data.models_pro_id.length === 0 ? 'Modelos' : 'Modelo')}
				</button>
				<button
					style={{
					...buttonStyle,
					...(showTestsIdsList ? highlightedButtonStyle : {}),
					marginRight: '10px',
					}}
					onClick={handleShowTestsIdsList}
				>
					{data.tests_made_id.length + ' ' + (data.tests_made_id.length > 1 || data.tests_made_id.length === 0 ? 'Testes' : 'Teste')}
				</button>
			</div>
			{showModelIdsList && generateListItems('model')}
			{showTestsIdsList && generateListItems('test')}
		</div>
	);
};

export default SingleProTechnician;
