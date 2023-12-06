import React, { useEffect, useState } from 'react';
import { api } from '../App';
import { AirplaneModel } from '../api/schemas';
import Card from '../components/card';
import BlankCard from '../components/blank-card';
import CardPopup from '../components/card-popup';
import { ObjectId } from 'mongodb';

export function Home() {
    const [apiData, setApiData] = useState<Array<AirplaneModel> | null>(null);
    const [error, setError] = useState(null);
    const [selectedCard, setSelectedCard] = useState<ObjectId | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/');
                setApiData(response.data || []);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const openPopup = (modelId: ObjectId) => {
        setSelectedCard(modelId);
    };

    const closePopup = () => {
        setSelectedCard(null);
    };

    return (
        <div style={{ width: '77%', margin: 'auto' }}>
            <h1 style={{ margin: '10px' }}>Modelos de Aviões</h1>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                <div>
                    {apiData === null ? (
                        <h2>Nenhum cadastrado. Por favor, adicione um</h2>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', filter: selectedCard ? 'blur(4px)' : 'none', pointerEvents: selectedCard ? 'none' : 'all' }}>
                            {apiData.map((airplaneModel, index) => (
                                <Card
                                    key={index}
                                    title={airplaneModel.code}
                                    imageUrl={'/' + airplaneModel.image_path}
                                    onClick={() => openPopup(airplaneModel.id)}
                                />
                            ))}
                            <BlankCard />
                        </div>
                    )}
                </div>
            )}

            {selectedCard && (
                <CardPopup
                    modelId={selectedCard}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}
