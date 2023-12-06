import React from 'react';

interface CardProps {
	title: string;
	imageUrl: string;
	onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, imageUrl, onClick }) => {
	const cardStyle: React.CSSProperties = {
		borderRadius: '10px',
		cursor: 'pointer',
		background: 'rgb(39, 43, 51)',
		width: '400px',
		height: '400px',
		overflow: 'hidden',
		position: 'relative',
		margin: '10px',
	};

	const imageStyle: React.CSSProperties = {
		width: '100%',
		height: '75%',
		position: 'absolute',
		bottom: 0,
		left: 0,
		borderBottomLeftRadius: '10px',
		borderBottomRightRadius: '10px',
	};

	const titleStyle: React.CSSProperties = {
		textAlign: 'center',
	};

	return (
		<div className="Card" style={cardStyle} onClick={onClick}>
			<h2 style={titleStyle}>{title}</h2>
			<img src={imageUrl} alt={title} style={imageStyle} />
		</div>
	);
};

export default Card;
