import React, { useState, useEffect } from 'react';
import { api } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import * as schemas from '../api/schemas'

export function NewAirplane() {
	const location = useLocation();

	const [apiData, setApiData] = useState<schemas.AirplaneModel[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`/`);
				setApiData(response.data);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchData();
	}, []);


	const [formData, setFormData] = useState<{
		model_id: string | null;
	}>({
		model_id: location.state.id || '',
	});

	let buttonText: string = formData.model_id ? 'Adicionar avião ao modelo' : 'Adicionar novo modelo';

	const navigate = useNavigate();

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		if (value === 'new_airplane_model') {
			buttonText = 'Adicionar novo modelo';
			navigate('/airplaneModel');
		} else {
			buttonText = 'Adicionar avião ao modelo';
			setFormData((prevData) => ({
				...prevData,
				model_id: value ? value : null,
			}));
		}
	};

	const isFormValid = () => {
		return formData.model_id !== null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid()) {
			setError('Selecione o modelo corretamente.');
			return;
		}

		try {
			const formDataToSend = new FormData();
			formDataToSend.append('model_id', formData.model_id || '');

			const response = await api.post('/airplane', formDataToSend);
			if (response.status === 200) {
				navigate('/');
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
		width: '50%',
		fontSize: '18px',
		padding: '10px',
		marginBottom: '20px',
		borderRadius: '10px',
		border: '1px solid #ccc',
	};

	const buttonStyle: React.CSSProperties = {
		width: '50%',
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
			<h1>{'Adicionar avião'}</h1>
			{error && <div>Error: {error}</div>}
			<form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
				<div>
					<div style={{ width: '50%', margin: 'auto' }}>
						<label style={{ ...labelStyle, textAlign: 'left' }}>Modelo:</label>
					</div>
						{apiData === null ? (
							<h2>Nenhum cadastrado. Por favor, adicione um</h2>
						) : (
							<div>
								<select
									style={selectStyle}
									onChange={(e) => handleSelectChange(e)}
									value={String(formData.model_id)}
									name="model_id"
								>
									<option key='new_airplane_model' value='new_airplane_model'>
										Novo modelo
									</option>
									{apiData.map((airplaneModel) => (
										<option
											key={String(airplaneModel.id)}
											value={String(airplaneModel.id)}
										>
									{airplaneModel.code}
									</option>
								))}
								</select>
							</div>
						)}
					</div>
				<div>
					<button type="submit" style={buttonStyle}>{buttonText}</button>
				</div>
			</form>
		</div>
	);
}
