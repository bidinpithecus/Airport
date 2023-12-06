import React from 'react';
import Card from './card';
import { useNavigate } from 'react-router-dom';

const BlankCard = () => {
	const navigate = useNavigate();

	const handleCardClick = async () => {
		try {
			navigate(`/airplaneModel`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Card
			key="blank"
			title="Novo modelo"
			imageUrl={'/plus-sign.png'}
			onClick={ handleCardClick }
		/>
	);
};

export default BlankCard;
