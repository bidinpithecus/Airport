import React, { useEffect, useState } from 'react';
import { api } from '../App';
import { useNavigate } from 'react-router-dom';
import * as schemas from '../api/schemas';

interface ExistantTestProps {
	formDataExistantTest: {
		start_date: string;
		finish_date: string;
		technician_id: string;
		test_id: string;
		airplane_id: string;
		score: number;
	};
	employeeData: schemas.Employee[] | null;
	testData: schemas.IntegrityTest[] | null;
	airplaneData: schemas.Airplane[] | null;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	selectStyle: React.CSSProperties;
	labelStyle: React.CSSProperties;
	inputStyle: React.CSSProperties;
}

const ExistantTest: React.FC<ExistantTestProps> = ({
	formDataExistantTest,
	employeeData,
	testData,
	airplaneData,
	handleInputChange,
	selectStyle,
	labelStyle,
	inputStyle,
}) => {
	return (
		<div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Nota:</label>
				</div>
				<input
					style={inputStyle}
					type="number"
					name="score"
					placeholder='Números apenas'
					value={formDataExistantTest.score}
					onChange={handleInputChange}
					min={1}
					required
				/>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Data e Hora início:</label>
				</div>
				<input
					style={inputStyle}
					type="datetime-local"
					name="start_date"
					value={formDataExistantTest.start_date}
					onChange={handleInputChange}
					min={1}
					required
				/>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Data e Hora fim:</label>
				</div>
				<input
					style={inputStyle}
					type="datetime-local"
					name="finish_date"
					value={formDataExistantTest.finish_date}
					onChange={handleInputChange}
					min={1}
					required
				/>
			</div>
			<div style={{ width: '55%', margin: 'auto' }}>
				<label style={{ ...labelStyle, textAlign: 'left' }}>Técnico realizador:</label>
			</div>
			<select
				style={selectStyle}
				onChange={handleInputChange}
				value={String(formDataExistantTest.technician_id)}
				name="technician_id"
			>
			{employeeData?.map((employee) => (
				<option key={String(employee.id)} value={String(employee.id)}>
					{employee.name}. ID: {String(employee.id)}
				</option>
			))}
			</select>
			<div style={{ width: '55%', margin: 'auto' }}>
				<label style={{ ...labelStyle, textAlign: 'left' }}>Teste realizado:</label>
			</div>
			<select
				style={selectStyle}
				onChange={handleInputChange}
				value={String(formDataExistantTest.test_id)}
				name="test_id"
			>
			{testData?.map((test) => (
				<option key={String(test.id)} value={String(test.id)}>
					{test.name}. ID: {String(test.id)}
				</option>
			))}
			</select>
			<div style={{ width: '55%', margin: 'auto' }}>
				<label style={{ ...labelStyle, textAlign: 'left' }}>Avião:</label>
			</div>
			<select
				style={selectStyle}
				onChange={handleInputChange}
				value={String(formDataExistantTest.airplane_id)}
				name="technician_id"
			>
			{airplaneData?.map((airplane) => (
				<option key={String(airplane.id)} value={String(airplane.id)}>
					{String(airplane.id)}
				</option>
			))}
			</select>
		</div>
	);
};

interface AnotherTestProps {
	formDataAnotherTest: {
		name: string;
		minimum_score: number;
	};
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	selectStyle: React.CSSProperties;
	inputStyle: React.CSSProperties;
	labelStyle: React.CSSProperties;
}

const AnotherTest: React.FC<AnotherTestProps> = ({
	formDataAnotherTest,
	handleInputChange,
	inputStyle,
	labelStyle,
}) => {
	return (
		<div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Nome:</label>
				</div>
				<input
					style={inputStyle}
					onChange={handleInputChange}
					type="text"
					name="name"
					value={formDataAnotherTest.name}
					placeholder='Nome do teste'
					required
				/>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Nota mínima:</label>
				</div>
				<input
					style={inputStyle}
					type="number"
					name="salary"
					placeholder='Números apenas.'
					value={formDataAnotherTest.minimum_score}
					onChange={handleInputChange}
					min={1}
					required
				/>
			</div>
		</div>
	)
}

const NewTest = () => {
	const [error, setError] = useState<string | null>(null);
	const [showExistantTestForm, setShowExistantTestForm] = useState(true);
	const [showAnotherTestForm, setShowAnotherTestForm] = useState(false);
	const [employeeData, setEmployeeData] = useState<schemas.Employee[] | null>(null);
	const [testData, setTestData] = useState<schemas.IntegrityTest[] | null>(null);
	const [airplaneData, setAirplaneData] = useState<schemas.Airplane[] | null>(null);

	const [formDataExistantTest, setFormDataExistantTest] = useState<{
		technician_id: string;
		test_id: string;
		airplane_id: string;
		score: number;
		start_date: string;
		finish_date: string;
	}>({
		technician_id: '',
		test_id: '',
		airplane_id: '',
		score: 0,
		start_date: '',
		finish_date: ''
	});

	const [formDataAnotherTest, setFormDataAnotherTest] = useState<{
		name: string;
		minimum_score: number;
	}>({
		name: '',
		minimum_score: 1,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response = await api.get(`/employeesTechnician`);
				setEmployeeData(response.data);
				response = await api.get(`/integrityTests`);
				setTestData(response.data);
				response = await api.get(`/airplane`);
				setAirplaneData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (employeeData && employeeData.length > 0) {
		  setFormDataExistantTest({
			...formDataExistantTest,
			technician_id: String(employeeData[0].id),
		  });
		}
	}, [employeeData]);

	const handleExistantTestClick = () => {
		setShowAnotherTestForm(false);
		setShowExistantTestForm(!showExistantTestForm);
	}

	const handleAnotherTestClick = () => {
		setShowExistantTestForm(false);
		setShowAnotherTestForm(!showAnotherTestForm);
	}

	const navigate = useNavigate();

	const isFormValid = () => {
		if (showExistantTestForm) {
			window.alert(employeeData ? String(employeeData[0].id) : '');
			window.alert(formDataExistantTest.technician_id);
			return Boolean(formDataExistantTest.technician_id);
		} else if (showAnotherTestForm) {
			return Boolean(formDataAnotherTest.name && formDataAnotherTest.minimum_score);
		} else {
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid()) {
			setError('Preencha os campos corretamente.');
			return;
		}

		try {
			const formDataToSend = new FormData();
			let response;
			if (showExistantTestForm) {
				formDataToSend.append('technician_id', formDataExistantTest.technician_id);
				formDataToSend.append('airplane_id', formDataExistantTest.airplane_id);
				formDataToSend.append('test_id', formDataExistantTest.test_id);
				formDataToSend.append('start_date', formDataExistantTest.start_date);
				formDataToSend.append('finish_date', formDataExistantTest.finish_date);
				formDataToSend.append('score', String(formDataExistantTest.score));

				response = await api.post('/testMade', formDataToSend);
			} else if (showAnotherTestForm) {
				formDataToSend.append('name', formDataAnotherTest.name);
				formDataToSend.append('minimum_score', String(formDataAnotherTest.minimum_score));

				response = await api.post('/integrityTest', formDataAnotherTest);
			} else {
				setError('Erro de formulário');
				return error;
			}

			if (response.status === 200) {
				navigate('/');
			} else if (response.status === 400) {

			}
		} catch (err) {
			setError('An error occurred while adding the model.');
		}
		return;
	}

	const formStyle: React.CSSProperties = {
		width: '50%',
		verticalAlign: 'center',
		border: '1px solid #ccc',
		padding: '20px',
		borderBottomLeftRadius: '20px',
		borderBottomRightRadius: '20px',
		textAlign: 'center',
		margin: 0,
		position: 'absolute',
		top: '50%',
		left: '50%',
		msTransform: 'translate(-50%, -50%)',
		transform: 'translate(-50%, -50%)',
	};

	const labelStyle: React.CSSProperties = {
		display: 'block',
		marginBottom: '10px',
		fontSize: '16px',
	};

	const inputStyle: React.CSSProperties = {
		width: '53%',
		fontSize: '18px',
		padding: '10px',
		marginBottom: '20px',
		borderRadius: '10px',
		border: '1px solid #ccc',
	};

	const buttonStyle: React.CSSProperties = {
		width: '55%',
		padding: '10px',
		color: 'rgb(250, 250, 250)',
		background: 'rgb(32, 35, 41)',
		border: '1px solid rgb(250, 250, 250)',
		borderRadius: '10px',
		fontSize: '16px',
		cursor: 'pointer',
	};

	const selectStyle: React.CSSProperties = {
		width: '55%',
		height: '40px',
		fontSize: '18px',
		padding: '10px',
		marginBottom: '20px',
		borderRadius: '10px',
		border: '1px solid #ccc',
	};

	const toggledOffStyle: React.CSSProperties = {
		border: '1px solid #ccc',
		padding: '20px',
		width: '441px',
		fontSize: '20px',
		transform: showAnotherTestForm ? 'translate(88.65%, 350%)' : 'translate(88.65%, 67.0%)',
		borderTopLeftRadius: formStyle.borderBottomLeftRadius,
		borderTopRightRadius: formStyle.borderBottomRightRadius,
		color: 'rgb(250, 250, 250)',
		background: 'rgb(32, 35, 41)',
		cursor: 'pointer',
	};

	const toggledOnStyle: React.CSSProperties = {
		border: '1px solid #ccc',
		padding: '20px',
		width: '441px',
		fontSize: '20px',
		transform: showAnotherTestForm ? 'translate(88.65%, 350%)' : 'translate(88.65%, 67.0%)',
		borderTopLeftRadius: formStyle.borderBottomLeftRadius,
		borderTopRightRadius: formStyle.borderBottomRightRadius,
		background: 'rgb(250, 250, 250)',
		color: 'rgb(32, 35, 41)',
		cursor: 'not-allowed',
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		if (showAnotherTestForm) {
			setFormDataAnotherTest((prevData) => ({
				...prevData,
				[name]: type === 'number' ? parseInt(value) : value,
			}));
		} else {
			setFormDataExistantTest((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	return (
		<div>
			<button style={ showExistantTestForm ? toggledOnStyle : toggledOffStyle } disabled={ showExistantTestForm } onClick={handleExistantTestClick}>Teste existente</button>
			<button style={ showAnotherTestForm ? toggledOnStyle : toggledOffStyle } disabled={ showAnotherTestForm } onClick={handleAnotherTestClick}>Novo teste</button>
			<div style={formStyle}>
				<h1>{ showExistantTestForm ? 'Teste' : 'Novo teste' }</h1>
				{error && <div>Error: {error}</div>}
				<form onSubmit={ handleSubmit } method="post" encType="multipart/form-data">
					{showAnotherTestForm ? (
					<AnotherTest
						formDataAnotherTest={formDataAnotherTest}
						handleInputChange={handleInputChange}
						selectStyle={selectStyle}
						inputStyle={inputStyle}
						labelStyle={labelStyle}
					/>
					) : (
					<ExistantTest
						formDataExistantTest={formDataExistantTest}
						employeeData={employeeData}
						testData={testData}
						airplaneData={airplaneData}
						handleInputChange={handleInputChange}
						selectStyle={selectStyle}
						labelStyle={labelStyle}
						inputStyle={inputStyle}
					/>
					)}
					<div>
						<button type="submit" style={buttonStyle}>{ 'Enviar' }</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default NewTest;
