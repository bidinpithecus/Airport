import React, { useEffect, useState } from 'react';
import { api } from '../App';
import { AirplaneModelWithTechsAndAirplanes } from '../api/schemas';
import { useNavigate, Link } from 'react-router-dom';
import { ObjectId } from 'mongodb';

interface CardPopupProps {
	modelId: ObjectId;
	onClose: () => void;
}

const CardPopup: React.FC<CardPopupProps> = ({ modelId, onClose }) => {
	const [model, setModel] = useState<AirplaneModelWithTechsAndAirplanes>();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showAirplaneIdsList, setShowAirplaneIdsList] = useState(false);
	const [showTechnicianProIdsList, setShowTechnicianProIdsList] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`/completeAirplaneModel/${modelId}`);
				setModel(response.data);
			} catch (error) {
				console.error('Error fetching model data:', error);
			}
		};

		fetchData();
	}, [modelId]);

	const handleDeleteClick = () => {
		setShowConfirmation(true);
	};

	const handleEditClick = async () => {
		try {
			navigate(`/airplaneModel`, { state: { selectedModelData: {...model, modelId}} });
		} catch (error) {
			console.error(error);
		}
	};

	const handleConfirmDelete = () => {
		api
		  .delete(`/airplaneModel/${modelId}`)
		  .then(() => {
			onClose();
			window.location.reload();
		})
		  .catch(error => {
			console.error('Error deleting model:', error);
		  });
	};

	const handleCancelDelete = () => {
		setShowConfirmation(false);
	};

	const handleShowAirplaneIdsList = () => {
		setShowTechnicianProIdsList(false);
		setShowAirplaneIdsList(!showAirplaneIdsList);
	};

	const handleShowTechnicianProIdsList = () => {
		setShowAirplaneIdsList(false);
		setShowTechnicianProIdsList(!showTechnicianProIdsList);
	};

	const popupStyle: React.CSSProperties = {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		background: 'rgb(250, 250, 250)',
		padding: '20px',
		boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
		borderRadius: '5px',
		color: 'rgb(32, 35, 41)',
		width: '400px',
		minHeight: '300px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
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

	const buttonStyle: React.CSSProperties = {
		background: 'rgb(250, 250, 250)',
		color: 'rgb(32, 35, 41)',
		border: '1px solid rgb(32, 35, 41)',
		padding: '10px 20px',
		cursor: 'pointer',
		borderRadius: '10px',
	};

	const verticalCenterStyle: React.CSSProperties = {
		margin: 0,
		position: 'absolute',
		top: '50%',
		msTransform: 'translateY(-50%)',
		transform: 'translateY(-50%)'
	};

	const closeButtonStyle: React.CSSProperties = {
		position: 'absolute',
		top: '10px',
		right: '10px',
		background: 'none',
		border: 'none',
		width: '32px',
		height: '32px',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
	};

	const highlightedButtonStyle: React.CSSProperties = {
		background: 'rgb(32, 35, 41)',
		color: 'rgb(250, 250, 250)',
		border: 'none',
		padding: '10px 20px',
		cursor: 'pointer',
		borderRadius: '10px',
	  };

	const confirmationPopupStyle: React.CSSProperties = {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		background: 'white',
		padding: '20px',
		boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
		borderRadius: '5px',
		width: '300px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	};

	  return (
		<div className="popup" style={popupStyle}>
		  <div className="popup-content">
			{model ? (
			  <>
				<button style={closeButtonStyle} onClick={onClose}>
				  <img
					src={'/close.png'}
					alt="Fechar"
				  />
				</button>
				<div style={{ position: 'relative' }}>
				  <h2 style={{ fontSize: '32px' }}>{model.code}</h2>
				  <div style={{ ...verticalCenterStyle, display: 'flex', right: 0 }}>
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
				</div>
				<br />
				<div style={{ display: 'flex' }}>
				  <div style={{ display: 'flex', alignItems: 'center', left: 0, marginRight: '15px' }}>
					<div>
					  <img src={'/weight.png'} alt="Peso" />
					</div>
					<div>
					  <span style={{ fontSize: '24px' }}>{model.weight} Kg</span>
					</div>
				  </div>
				  <div style={{ display: 'flex', alignItems: 'center', right: 0, marginLeft: '15px' }}>
					<div>
					  <img src={'/seat.png'} alt="Assentos" />
					</div>
					<div>
					  <span style={{ fontSize: '24px' }}>{model.capacity.toString()} Assentos</span>
					</div>
				  </div>
				</div>
				<br />
				<div>
			  <button
				style={{
				  ...buttonStyle,
				  ...(showAirplaneIdsList ? highlightedButtonStyle : {}),
				  marginRight: '10px',
				}}
				onClick={handleShowAirplaneIdsList}
			  >
				{model.airplane_ids.length + ' ' + (model.airplane_ids.length > 1 || model.airplane_ids.length === 0 ? 'Aviões' : 'Avião')}
			  </button>
			  <button
				style={{
					...buttonStyle,
					...(showTechnicianProIdsList ? highlightedButtonStyle : {}),
					marginRight: '10px',
				}}
				onClick={handleShowTechnicianProIdsList}
				>
				{model.technician_pro_ids.length + ' ' + (model.technician_pro_ids.length > 1 || model.technician_pro_ids.length === 0 ? 'Peritos' : 'Perito')}
			  </button>
			</div>
			{showAirplaneIdsList && (
				<div>
					<ul>
						<Link to={`/airplane`} state={{ id: modelId }} key={'new_airplane'}>
							<li>Adicionar novo avião</li>
						</Link>
						{ model.airplane_ids.map((id) => (
							<Link to={`/airplane/${id}`} key={String(id)}>
								<li>{String(id)}</li>
							</Link>
						))}
					</ul>
				</div>
			)}
			{showTechnicianProIdsList && (
			  <div>
				<ul>
					<Link to={`/technician_pro`} state={{ model_id: modelId }} key={'new_technician_pro'}>
						<li>Adicionar novo perito</li>
					</Link>
					{model.technician_pro_ids.map((id) => (
						<Link to={`/technician/${id}`} key={String(id)}>
							<li>{String(id)}</li>
						</Link>
				))}
				</ul>
			  </div>
			)}
			  </>
			) : (
			  <p>Carregando dados...</p>
			)}
		  </div>
		  {showConfirmation && (
			<div className="confirmation-popup" style={confirmationPopupStyle}>
			  <p>Deseja mesmo deletar este registro?</p>
			  <div style={{ display: 'flex' }}>
				<button style={{ ...buttonStyle, marginRight: '5px' }} onClick={handleConfirmDelete}>Sim</button>
				<button style={{ ...buttonStyle, marginLeft: '5px' }} onClick={handleCancelDelete}>Não</button>
			  </div>
			</div>
		  )}
		</div>
	  );
};

export default CardPopup;
