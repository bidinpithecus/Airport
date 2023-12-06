import React, { useState, useEffect } from 'react';
import { api } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import * as schemas from '../api/schemas'

export function NewTechnicianPro() {
	const location = useLocation();

	const [apiData, setApiData] = useState<schemas.AirplaneModelsAndEmployees | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`/modelsAndEmployees`);
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, []);

	const [formData, setFormData] = useState<{
		model_id: string | null;
		employee_id: string;
	}>({
		model_id: location.state.model_id ? location.state.model_id : 'new_airplane_model',
		employee_id: location.state.employee_id ? location.state.employee_id : 'new_technician',
	});

	const navigate = useNavigate();

	const handleSelectTechnicianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		if (value === 'new_technician') {
			navigate('/technician');
		} else {
			setFormData((prevData) => ({
				...prevData,
				employee_id: value,
			}));
		}
	};

	const handleSelectModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		if (value === 'new_airplane_model') {
			navigate('/airplaneModel')
		} else {
			setFormData((prevData) => ({
				...prevData,
				model_id: value ? value : null,
			}));
		}
	};

	const isFormValid = () => {
		return formData.model_id !== null && formData.employee_id !== null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid()) {
			setError('Selecione o modelo e/ou técnico corretamente.');
			return;
		}

		try {
			if (formData.employee_id === 'new_technician') {
				navigate('/technician');
				return;
			}
			if (formData.model_id === 'new_airplane_model') {
				navigate('/airplaneModel');
				return;
			}
			const formDataToSend = new FormData();
			formDataToSend.append('model_id', formData.model_id || '');
			formDataToSend.append('employee_id', formData.employee_id || '');

			const response = await api.post('/technician_pro_at_model', formDataToSend);
			if (response.status === 200) {
				navigate('/');
			} else if (response.status === 400) {
				setError(response.data.message);
			}
		} catch (err) {
			setError('An error occurred while adding the airplane.');
		}
		return;
	}

	const formStyle: React.CSSProperties = {
		width: '50%',
		verticalAlign: 'center',
		border: '1px solid #ccc',
		padding: '20px',
		borderRadius: '20px',
		textAlign: 'center',
		margin: 0,
		position: 'absolute',
		top: '40%',
		left: '50%',
		msTransform: 'translate(-50%, -60%)',
		transform: 'translate(-50%, -60%)',
	};

	const labelStyle: React.CSSProperties = {
		display: 'block',
		marginBottom: '10px',
		fontSize: '18px',
	};

	const selectStyle: React.CSSProperties = {
		width: '55%',
		fontSize: '18px',
		padding: '10px',
		marginBottom: '20px',
		borderRadius: '10px',
		border: '1px solid #ccc',
	};

	const buttonStyle: React.CSSProperties = {
		width: '55%',
		padding: '10px',
		background: '#007BFF',
		color: 'white',
		borderRadius: '10px',
		border: 'none',
		fontSize: '18px',
		cursor: 'pointer',
	};

	return (
		<div style={formStyle}>
			<h1>{'Fazer técnico perito em um modelo'}</h1>
			{error && <div>Error: {error}</div>}
			<form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
				<div>
					{ apiData === null ? (
						<h2>Nenhum cadastrado. Por favor, adicione um</h2>
					) : (
						<div>
							<div style={{ width: '55%', margin: 'auto' }}>
								<label style={{ ...labelStyle, textAlign: 'left' }}>Técnico:</label>
							</div>
							<div>
								<select
									style={selectStyle}
									onChange={(e) => handleSelectTechnicianChange(e)}
									value={String(formData.employee_id)}
									name="employee_id"
									>
									<option key='new_technician' value='new_technician'>
										Novo técnico
									</option>
									{
										apiData.employees.map((employee) => (
											<option
												key={String(employee.id)}
												value={String(employee.id)}
											>
												ID: {String(employee.id)}, Nome: {employee.name}
											</option>
										))
									}
								</select>
							</div>
							<div style={{ width: '55%', margin: 'auto' }}>
								<label style={{ ...labelStyle, textAlign: 'left' }}>Modelo:</label>
							</div>
							<div>
								<select
									style = { selectStyle }
									onChange = { (e) => handleSelectModelChange(e) }
									value = { String(formData.model_id) }
									name = "model_id"
								>
									<option key='new_airplane_model' value='new_airplane_model'>
										Novo modelo
									</option>
									{apiData.models.map((airplaneModel) => (
										<option
										key={String(airplaneModel.id)}
										value={String(airplaneModel.id)}
										>
										{airplaneModel.code}
										</option>
									))}
								</select>
							</div>
						</div>
					)}
					</div>
				<div>
					<button type="submit" style={ buttonStyle }>Enviar</button>
				</div>
			</form>
		</div>
	);
}
