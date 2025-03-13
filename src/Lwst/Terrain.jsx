import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Terrain({ addReservation }) {
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        timeSlot: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');

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

    const handleReserveClick = () => {
        setIsReservationModalOpen(true);
    };

    const handleCloseReservationModal = () => {
        setIsReservationModalOpen(false);
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
        const newReservation = {
            id: Date.now(), // Simple unique ID
            ...formData,
            accepted: false
        };
        addReservation(newReservation);
        setIsReservationModalOpen(false);
        setFormData({ name: '', email: '', date: '', timeSlot: '' });
        setConfirmationMessage('Votre réservation a été enregistrée. Veuillez attendre la réponse de l\'administrateur.');
        
        setTimeout(() => {
            document.querySelector('.confirmation-message').classList.add('fade-out');
            setTimeout(() => setConfirmationMessage(''), 500); // Efface le message après 0.5 secondes supplémentaires
        }, 4500); // Commence à disparaître après 4.5 secondes
    };

    const today = new Date().toISOString().split('T')[0];

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
                        <button className='btnn' onClick={handleReserveClick}>Reserver Maintenant</button>
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
                                    <option value="09:00-10:00">09:00 - 10:00</option>
                                    <option value="10:00-11:00">10:00 - 11:00</option>
                                    <option value="11:00-12:00">11:00 - 12:00</option>                                 
                                    <option value="15:00-16:00">15:00 - 16:00</option>
                                    <option value="16:00-17:00">16:00 - 17:00</option>
                                    <option value="17:00-18:00">17:00 - 18:00</option>
                                    <option value="18:00-19:00">18:00 - 19:00</option>
                                    <option value="19:00-20:00">19:00 - 20:00</option>
                                    <option value="20:00-21:00">20:00 - 21:00</option>
                                    <option value="21:00-22:00">21:00 - 22:00</option>
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