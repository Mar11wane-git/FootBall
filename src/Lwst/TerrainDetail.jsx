import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TerrainDetail({ terrains }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const terrain = terrains.find(t => t.id === parseInt(id));

    if (!terrain) {
        return <div>Terrain non trouvé</div>;
    }

    const handleBackClick = () => {
        navigate('/terrain'); // Assurez-vous que le chemin correspond à votre liste de terrains
    };

    return (
        <div className="terrain-detail">
            <h1>{terrain.Title}</h1>
            <img src={`/${terrain.photo}`} alt={terrain.Title} className="terrain-image" />
            <p>{terrain.description}</p>
            <button className="btn-reserve" onClick={() => navigate('/reservation')}>Réserver ce terrain</button>
            <button className="btn-back" onClick={handleBackClick}>Retour</button>
        </div>
    );
}

export default TerrainDetail;
