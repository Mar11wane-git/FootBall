import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Terrain({ addReservation, reservations }) {
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        timeSlot: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [selectedTerrain, setSelectedTerrain] = useState(null);

    const terr = [
        {  
            id: 1,
            photo: 'tr1.jpg', // Assurez-vous que le chemin est correct
            Title: 'Terrain 1 - Gazon Synthétique',
            description: 'Terrain de dernière génération avec gazon synthétique haute qualité. Parfait pour les matchs compétitifs.',
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
        }
    ];

    const handleReserveClick = (terrainId) => {
        setSelectedTerrain(terrainId);
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
            reservation.terrainId === selectedTerrain &&
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
            terrainId: selectedTerrain,
            ...formData
        };
        addReservation(newReservation);
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
        .filter(reservation => reservation.terrainId === selectedTerrain && reservation.date === formData.date)
        .map(reservation => reservation.timeSlot) : [];

    return (
        <div>
            <h1>Terrain Disponible</h1>
            <div className='com1'>
                {terr.map((e) => (
                    <div key={e.id}>
                        <Link to={`/terrain/${e.id}`}>
                            <img src={e.photo} alt={e.Title} className='im1' />
                        </Link>
                        <h1>{e.Title}</h1>
                        <p className='p1'>{e.description}</p>
                        <button className='btnn' onClick={() => handleReserveClick(e.id)}>Reserver Maintenant</button>
                    </div>
                ))}
            </div>

            {confirmationMessage && (
                <div className="confirmation-message">
                    {confirmationMessage}
                </div>
            )}

            {isReservationModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Réserver un Terrain</h2>
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
                                <button type="submit" className="btn-ajt">Réserver</button>
                                <button type="button" className="btn-annuler" onClick={handleCloseReservationModal}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Terrain;