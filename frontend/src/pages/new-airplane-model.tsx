import React, { useState } from 'react';
import { api } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';

export function NewModel() {
	const location = useLocation();
	const selectedModelData = location.state?.selectedModelData || null;

	const [formData, setFormData] = useState<{
		capacity: number;
		weight: number;
		code: string;
		image_path: File | null;
	}>({
		capacity: selectedModelData?.capacity || 0,
		weight: selectedModelData?.weight || 0,
		code: selectedModelData?.code || '',
		image_path: selectedModelData?.image_path || null,
	});

	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const [duplicateFields, setDuplicateFields] = useState({ code: false, image_path: false });

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: type === 'number' ? parseFloat(value) : value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		setFormData((prevData) => ({
			...prevData,
			image_path: file,
		}));
	};

	const isFormValid = () => {
		return formData.capacity > 0 && formData.weight > 0 && formData.code.trim() !== '' && formData.image_path !== null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid()) {
			setError('Preencha os campos corretamente.');
			return;
		}

		try {
			const formDataToSend = new FormData();
			formDataToSend.append('capacity', formData.capacity.toString());
			formDataToSend.append('weight', formData.weight.toString());
			formDataToSend.append('code', formData.code);
			if (formData.image_path) {
				formDataToSend.append('image_path', formData.image_path);
			}
			if (selectedModelData) {
				formDataToSend.append('id', selectedModelData.modelId);
			}

			const response = selectedModelData ? (await api.put('/airplaneModel', formDataToSend)) : (await api.post('/airplaneModel', formDataToSend));

			if (response.status === 200) {
				navigate('/');
			} else if (response.status === 400) {
				const data = response.data;

				setDuplicateFields({
					code: data.code,
					image_path: data.image_path,
				});
			}
		} catch (err) {
			setError('An error occurred while adding the model.');
		}
		return;
	}

	const duplicateFieldStyle: React.CSSProperties = {
		borderColor: 'red',
	};

	const formStyle: React.CSSProperties = {
		width: '50%',
		verticalAlign: 'center',
		border: '1px solid #ccc',
		padding: '20px',
		borderRadius: '20px',
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
		width: '50%',
		fontSize: '16px',
		padding: '10px',
		marginBottom: '20px',
		borderRadius: '10px',
		border: '1px solid #ccc',
	};

	const buttonStyle: React.CSSProperties = {
		width: '53%',
		padding: '10px',
		background: '#007BFF',
		color: 'white',
		borderRadius: '10px',
		border: 'none',
		fontSize: '16px',
		cursor: 'pointer',
	};

  return (
	<div style={formStyle}>
	  <h1>{selectedModelData ? 'Editar modelo' : 'Adicionar novo modelo'}</h1>
	  {error && <div>Error: {error}</div>}
	  <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
		<div>
      <div style={{ width: '50%', margin: 'auto' }}>
  		  <label style={{ ...labelStyle, textAlign: 'left' }}>Capacidade:</label>
      </div>
		  <input
			style={duplicateFields.code ? duplicateFieldStyle : inputStyle}
			type="number"
			name="capacity"
			value={formData.capacity}
			onChange={handleInputChange}
			min={1}
		  />
		</div>
		<div>
      <div style={{ width: '50%', margin: 'auto' }}>
		    <label style={{ ...labelStyle, textAlign: 'left' }}>Peso:</label>
      </div>
		  <input
        style={duplicateFields.image_path ? duplicateFieldStyle : inputStyle}
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleInputChange}
        min={1}
		  />
		</div>
		<div>
	  <div style={{ width: '50%', margin: 'auto' }}>
  		  <label style={{ ...labelStyle, textAlign: 'left' }}>Código:</label>
      </div>
		  <input
        style={duplicateFields.code ? duplicateFieldStyle : inputStyle}
        type="text"
        name="code"
        value={formData.code}
        onChange={handleInputChange}
        required
      />
		</div>
		<div>
		<div style={{ width: '50%', margin: 'auto' }}>
  		  <label style={{ ...labelStyle, textAlign: 'left' }}>Foto:</label>
      </div>
		  <input
        style={duplicateFields.image_path ? duplicateFieldStyle : inputStyle}
        type="file"
        name="image_path"
        onChange={handleFileChange}
        required
		  />
		</div>
		<div>
		  <button type="submit" style={buttonStyle}>{ selectedModelData ? 'Editar' : 'Criar' }</button>
		</div>
	  </form>
	</div>
  );
}
