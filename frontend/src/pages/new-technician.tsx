import React, { useEffect, useState } from 'react';
import { api } from '../App';
import { useNavigate } from 'react-router-dom';
import * as schemas from '../api/schemas';

interface ExistantEmployeeProps {
	formDataExistantEmployee: {
		employee_id: string;
	};
	employeeData: schemas.Employee[] | null;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	selectStyle: React.CSSProperties;
	labelStyle: React.CSSProperties;
}

const ExistantEmployee: React.FC<ExistantEmployeeProps> = ({
	formDataExistantEmployee,
	employeeData,
	handleInputChange,
	selectStyle,
	labelStyle,
}) => {
	return (
		<div>
			<div style={{ width: '55%', margin: 'auto' }}>
				<label style={{ ...labelStyle, textAlign: 'left' }}>Funcionário:</label>
			</div>
			<select
				style={selectStyle}
				onChange={handleInputChange}
				value={String(formDataExistantEmployee.employee_id)}
				name="employee_id"
			>
			{employeeData?.map((employee) => (
				<option key={String(employee.id)} value={String(employee.id)}>
					{employee.name}. ID: {String(employee.id)}
				</option>
			))}
			</select>
		</div>
	);
};

interface NewEmployeeProps {
	formDataNewEmployee: {
		name: string;
		house_location_id: string;
		phone_number: string;
		salary: number;
		syndicate_id: string;
	};
	locationData: schemas.Location[] | null;
	syndicateData: schemas.Syndicate[] | null;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	selectStyle: React.CSSProperties;
	inputStyle: React.CSSProperties;
	labelStyle: React.CSSProperties;
}

const NewEmployee: React.FC<NewEmployeeProps> = ({
	formDataNewEmployee,
	locationData,
	syndicateData,
	handleInputChange,
	selectStyle,
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
					value={formDataNewEmployee.name}
					placeholder='Nome do funcionário'
					required
				/>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
						<label style={{ ...labelStyle, textAlign: 'left' }}>Endereco:</label>
				</div>
				<select
					style={selectStyle}
					onChange={handleInputChange}
					value={String(formDataNewEmployee?.house_location_id)}
					name="house_location_id"
					>
					{
						locationData?.map((location) => (
							<option
								key={String(location.id)}
								value={String(location.id)}
							>
								{ location.country_abbreviation }, { location.state }, { location.city }, { location.street }, { location.number }
							</option>
						))
					}
				</select>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Número de Telefone:</label>
				</div>
				<input
					style={inputStyle}
					type="text"
					name="phone_number"
					placeholder='Números apenas'
					value={formDataNewEmployee.phone_number}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Salário:</label>
				</div>
				<input
					style={inputStyle}
					type="number"
					name="salary"
					placeholder='Números apenas. Sem casas decimais'
					value={formDataNewEmployee.salary}
					onChange={handleInputChange}
					min={1}
					required
				/>
			</div>
			<div>
				<div style={{ width: '55%', margin: 'auto' }}>
					<label style={{ ...labelStyle, textAlign: 'left' }}>Sindicato:</label>
				</div>
				<select
					style={selectStyle}
					onChange={handleInputChange}
					value={String(formDataNewEmployee?.syndicate_id)}
					name="syndicate_id"
					>
					{
						syndicateData?.map((syndicate) => (
							<option
								key={String(syndicate.id)}
								value={String(syndicate.id)}
							>
								{syndicate.name}. ID: {String(syndicate.id)}
							</option>
						))
					}
				</select>
			</div>
		</div>
	)
}

const NewTechnician = () => {
	const [error, setError] = useState<string | null>(null);
	const [showExistantEmployeeForm, setShowExistantEmployeeForm] = useState(true);
	const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
	const [employeeData, setEmployeeData] = useState<schemas.Employee[] | null>(null);
	const [syndicateData, setSyndicateData] = useState<schemas.Syndicate[] | null>(null);
	const [locationData, setLocationData] = useState<schemas.Location[] | null>(null);

	const [formDataExistantEmployee, setFormDataExistantEmployee] = useState<{
		employee_id: string;
	}>({
		employee_id: '',
	});

	const [formDataNewEmployee, setFormDataNewEmployee] = useState<{
		name: string;
		house_location_id: string;
		phone_number: string;
		salary: number;
		syndicate_id: string;
	}>({
		name: '',
		house_location_id: '',
		phone_number: '',
		salary: 1,
		syndicate_id: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response = await api.get(`/employeesNotTechnician`);
				setEmployeeData(response.data);
				response = await api.get(`/syndicate`);
				setSyndicateData(response.data);
				response = await api.get(`/locationNotAirports`);
				setLocationData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (employeeData && employeeData.length > 0) {
		  setFormDataExistantEmployee({
			employee_id: String(employeeData[0].id),
		  });
		}
	}, [employeeData]);

	useEffect(() => {
		if (locationData && locationData.length > 0) {
		  setFormDataNewEmployee({
			...formDataNewEmployee,
			house_location_id: String(locationData[0].id),
		  });
		}
	}, [locationData]);

	useEffect(() => {
		if (syndicateData && syndicateData.length > 0) {
		  setFormDataNewEmployee({
			...formDataNewEmployee,
			syndicate_id: String(syndicateData[0].id),
		  });
		}
	}, [syndicateData]);

	const handleExistantEmployeeClick = () => {
		setShowNewEmployeeForm(false);
		setShowExistantEmployeeForm(!showExistantEmployeeForm);
	}

	const handleNewEmployeeClick = () => {
		setShowExistantEmployeeForm(false);
		setShowNewEmployeeForm(!showNewEmployeeForm);
	}

	const navigate = useNavigate();

	const isFormValid = () => {
		if (showExistantEmployeeForm) {
			window.alert(employeeData ? String(employeeData[0].id) : '');
			window.alert(formDataExistantEmployee.employee_id);
			return Boolean(formDataExistantEmployee.employee_id);
		} else if (showNewEmployeeForm) {
			return Boolean(formDataNewEmployee.name && formDataNewEmployee.house_location_id && formDataNewEmployee.phone_number && formDataNewEmployee.salary && formDataNewEmployee.syndicate_id);
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
			if (showExistantEmployeeForm) {
				formDataToSend.append('employee_id', formDataExistantEmployee.employee_id);

				response = await api.post('/technician', formDataToSend);
			} else if (showNewEmployeeForm) {
				formDataToSend.append('name', formDataNewEmployee.name);
				formDataToSend.append('house_location_id', formDataNewEmployee.house_location_id);
				formDataToSend.append('phone_number', formDataNewEmployee.phone_number);
				formDataToSend.append('salary', String(formDataNewEmployee.salary));
				formDataToSend.append('syndicate_id', formDataNewEmployee.syndicate_id);

				response = await api.post('/employeeTechnician', formDataNewEmployee);
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
		msTransform: 'translate(-50%, -60%)',
		transform: 'translate(-50%, -60%)',
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
		transform: showNewEmployeeForm ? 'translate(88.65%, 68%)' : 'translate(88.65%, 405.0%)',
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
		transform: showNewEmployeeForm ? 'translate(88.65%, 68%)' : 'translate(88.65%, 405.0%)',
		borderTopLeftRadius: formStyle.borderBottomLeftRadius,
		borderTopRightRadius: formStyle.borderBottomRightRadius,
		background: 'rgb(250, 250, 250)',
		color: 'rgb(32, 35, 41)',
		cursor: 'not-allowed',
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		if (showNewEmployeeForm) {
			setFormDataNewEmployee((prevData) => ({
				...prevData,
				[name]: type === 'number' ? parseInt(value) : value,
			}));
		} else {
			setFormDataExistantEmployee((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	return (
		<div>
			<button style={ showExistantEmployeeForm ? toggledOnStyle : toggledOffStyle } disabled={ showExistantEmployeeForm } onClick={handleExistantEmployeeClick}>Funcionário existente</button>
			<button style={ showNewEmployeeForm ? toggledOnStyle : toggledOffStyle } disabled={ showNewEmployeeForm } onClick={handleNewEmployeeClick}>Novo funcionário</button>
			<div style={formStyle}>
				<h1>{ showExistantEmployeeForm ? 'Técnico' : 'Novo técnico' }</h1>
				{error && <div>Error: {error}</div>}
				<form onSubmit={ handleSubmit } method="post" encType="multipart/form-data">
					{showNewEmployeeForm ? (
					<NewEmployee
						formDataNewEmployee={formDataNewEmployee}
						locationData={locationData}
						syndicateData={syndicateData}
						handleInputChange={handleInputChange}
						selectStyle={selectStyle}
						inputStyle={inputStyle}
						labelStyle={labelStyle}
					/>
					) : (
					<ExistantEmployee
						formDataExistantEmployee={formDataExistantEmployee}
						employeeData={employeeData}
						handleInputChange={handleInputChange}
						selectStyle={selectStyle}
						labelStyle={labelStyle}
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

export default NewTechnician;
