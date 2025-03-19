import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginPrompt from './LoginPrompt';

function Terrain({ addReservation, reservations, user }) {
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        timeSlot: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [selectedTerrain, setSelectedTerrain] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const navigate = useNavigate();
    const [registeredTerrains, setRegisteredTerrains] = useState(() => {
        const saved = localStorage.getItem('registeredTerrains');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('registeredTerrains', JSON.stringify(registeredTerrains));
    }, [registeredTerrains]);

    const terr = [
        {  
            id: 1,
            photo: 'tr1.jpg', // Assurez-vous que le chemin est correct
            Title: 'Terrain 1 - Gazon Synthétique',
            description: 'Terrain de dernière génération avec gazon synthétique haute qualité.',
        },
        {   
            id: 2,
            photo: 'tr1.jpg',
            Title: 'Terrain 2 - Gazon Naturel',
            description: 'Profitez de l\'authenticité du gazon naturel pour vos matchs et entraînements.',
        },
        {   
            id: 3,
            photo: 'tr1.jpg',
            Title: 'Terrain 3 - Gazon Hybride',
            description: 'Un mélange parfait de gazon naturel et synthétique pour une expérience optimale.',
        },
        {   
            id: 4,
            photo: 'tr1.jpg',
            Title: 'Terrain 4 - Gazon Hybride',
            description: 'Un mélange parfait de gazon naturel et synthétique pour une expérience optimale.',
        }
    ];

    const handleReserveClick = (terrainId) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setSelectedTerrain(terr.find(t => t.id === terrainId));
        setIsReservationModalOpen(true);
    };

    const handleCloseReservationModal = () => {
        setIsReservationModalOpen(false);
        setSelectedTerrain(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const conflict = reservations.some(reservation =>
            reservation.terrainId === selectedTerrain.id &&
            reservation.date === formData.date &&
            reservation.timeSlot === formData.timeSlot
        );

        if (conflict) {
            setConfirmationMessage('Une réservation existe déjà pour cette date et heure.');
            setTimeout(() => {
                setConfirmationMessage('');
            }, 5000);
            return;
        }

        const newReservation = {
            id: Date.now(),
            terrainId: selectedTerrain.id,
            ...formData
        };
        addReservation(newReservation);
        
        // Mettre à jour localStorage
        const updatedTerrains = { ...registeredTerrains, [selectedTerrain.id]: true };
        setRegisteredTerrains(updatedTerrains);
        localStorage.setItem('registeredTerrains', JSON.stringify(updatedTerrains));
        
        setIsReservationModalOpen(false);
        setFormData({ name: '', email: '', date: '', timeSlot: '' });
        setConfirmationMessage('Votre réservation a été enregistrée. Veuillez attendre la réponse de l\'administrateur.');
        
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    const today = new Date().toISOString().split('T')[0];

    const timeSlots = [
        "09:00-10:00", "10:00-11:00", "11:00-12:00",
        "15:00-16:00", "16:00-17:00", "17:00-18:00",
        "18:00-19:00", "19:00-20:00", "20:00-21:00",
        "21:00-22:00"
    ];

    const reservedSlots = selectedTerrain ? reservations
        .filter(reservation => reservation.terrainId === selectedTerrain.id && reservation.date === formData.date)
        .map(reservation => reservation.timeSlot) : [];

    return (
        <div>
            {showLoginPrompt && <LoginPrompt />}
            <h1>Terrains Disponibles</h1>
            <div className="container">
                {terr.map((e) => (
                    <div key={e.id} className="terrain">
                        <img src={e.photo} alt={e.Title} className='im1' />
                        <div className="terrain-content">
                            <h3>{e.Title}</h3>
                            <p>{e.description}</p>
                            <Link to={`/terrain/${e.id}`}>
                                <button className='btnn'>
                                    <i className="fas fa-eye"></i> Voir Détail
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}

                {confirmationMessage && (
                    <div className="confirmation-message">
                        {confirmationMessage}
                    </div>
                )}

                {isReservationModalOpen && selectedTerrain && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Réserver {selectedTerrain.Title}</h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Nom:</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Date de Réservation:</label>
                                    <input type="date" name="date" min={today} value={formData.date} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Plage Horaire:</label>
                                    <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
                                        <option value="" disabled>Choisir une heure</option>
                                        {timeSlots.map(slot => (
                                            <option key={slot} value={slot} disabled={reservedSlots.includes(slot)}>
                                                {reservedSlots.includes(slot) ? `${slot} (Réservé)` : slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="btn-ajt">
                                        <i className="fas fa-check"></i> Réserver
                                    </button>
                                    <button type="button" className="btn-annuler" onClick={handleCloseReservationModal}>
                                        <i className="fas fa-times"></i> Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Terrain;