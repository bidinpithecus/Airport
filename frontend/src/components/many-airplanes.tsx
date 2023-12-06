import React from 'react';

interface ManyAirplanesProps {
	data: Record<string, any>;
}

const ManyAirplanes: React.FC<ManyAirplanesProps> = ({ data }) => {
	if (!Array.isArray(data)) {
	  return <div>Data is not in the expected format.</div>;
	}

	return (
	  <div>
		{data.length > 0 ? (
		  data.map((airplane: any) => (
			<div key={airplane.id}>
			  <p>Airplane ID: {airplane.airplane_id}</p>
			  <p>Model ID: {airplane.model_id}</p>
			  <p>Flights: {airplane.flight_ids.join(', ')}</p>
			  <p>Tests: {airplane.test_ids.join(', ')}</p>
			  <hr></hr>
			</div>
		  ))
		) : (
		  <div>No airplanes available.</div>
		)}
	  </div>
	);
  };

export default ManyAirplanes;
