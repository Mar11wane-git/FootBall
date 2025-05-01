import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoginPrompt from './LoginPrompt';

function TerrainDetail({ addReservation, reservations, user, terrains }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [terrain, setTerrain] = useState(null);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        timeSlot: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [savedReservations, setSavedReservations] = useState(() => {
        const saved = localStorage.getItem('terrainDetailReservations');
        return saved ? JSON.parse(saved) : [];
    });

    // Chargement du terrain depuis les props
    useEffect(() => {
        const foundTerrain = terrains.find(t => t.id === parseInt(id));
        if (foundTerrain) {
            setTerrain(foundTerrain);
        }
    }, [id, terrains]);

    useEffect(() => {
        localStorage.setItem('terrainDetailReservations', JSON.stringify(savedReservations));
    }, [savedReservations]);

    if (!terrain) {
        return (
            <div className="terrain-not-found">
                <h2>Terrain non trouvé</h2>
                <p>Le terrain que vous recherchez n'existe pas ou a été supprimé.</p>
                <button className="btn-back" onClick={() => navigate('/terrain')}>
                    <i className="fas fa-arrow-left"></i> Retour à la liste des terrains
                </button>
            </div>
        );
    }

    const handleReserveClick = () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
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

        const conflict = reservations.some(reservation =>
            reservation.terrainId === terrain.id &&
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
            terrainId: terrain.id,
            terrainTitle: terrain.Title,
            terrainPrice: terrain.price,
            ...formData
        };
        addReservation(newReservation);

        // Mettre à jour localStorage
        const updatedReservations = [...savedReservations, newReservation];
        setSavedReservations(updatedReservations);
        localStorage.setItem('terrainDetailReservations', JSON.stringify(updatedReservations));

        setIsReservationModalOpen(false);
        setFormData({ name: '', email: '', date: '', timeSlot: '' });
        setConfirmationMessage('Votre réservation a été enregistrée avec succès.');

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

    const reservedSlots = reservations
        .filter(reservation => reservation.terrainId === terrain.id && reservation.date === formData.date)
        .map(reservation => reservation.timeSlot);

    return (
        <div className="terrain-detail">
            {showLoginPrompt && <LoginPrompt />}

            <div className="terrain-content">
                <div className="terrain-image-container">
                    <img
                        src={terrain.photo.startsWith('data:image') ? terrain.photo : 
                            terrain.photo.startsWith('http') ? terrain.photo : 
                            `/${terrain.photo}`}
                        alt={terrain.Title}
                        className="terrain-image"
                    />
                </div>

                <div className="terrain-info">
                    <div className="terrain-description">
                        <h2>Description</h2>
                        <p>{terrain.description}</p>
                        <p>Ce terrain est équipé de vestiaires modernes, d'un éclairage LED pour les matchs nocturnes, et d'un système de drainage avancé pour garantir des conditions de jeu optimales même après la pluie.</p>
                    </div>

                    <div className="terrain-specs">
                        <h2>Spécifications</h2>
                        <ul>
                            <li><strong>Type de surface:</strong> {terrain.Title.includes('Synthétique') ? 'Gazon synthétique' :
                                terrain.Title.includes('Naturel') ? 'Gazon naturel' :
                                    terrain.Title.includes('Hybride') ? 'Gazon hybride' : 'Gazon standard'}</li>
                            <li><strong>Dimensions:</strong> 40m x 20m</li>
                            <li><strong>Éclairage:</strong> Système LED</li>
                            <li><strong>Disponibilité:</strong> 9h00 - 22h00</li>
                            <li><strong>Prix:</strong> <span className="price">{terrain.price} DH/heure</span></li>
                        </ul>
                    </div>

                    <div className="terrain-amenities">
                        <h2>Équipements</h2>
                        <ul>
                            <li><i className="fas fa-tshirt"></i> Vestiaires</li>
                            <li><i className="fas fa-shower"></i> Douches</li>
                            <li><i className="fas fa-parking"></i> Parking</li>
                            <li><i className="fas fa-wifi"></i> Wi-Fi gratuit</li>
                            <li><i className="fas fa-utensils"></i> Cafétéria</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="terrain-header">
                <h1>{terrain.Title}</h1>
                <div className="terrain-actions">
                    {!user?.role === 'admin' && (
                        <button className="btn-reserve" onClick={handleReserveClick}>
                            <i className="fas fa-calendar-plus"></i> Réserver ce terrain
                        </button>
                    )}
                    <button className="btn-back" onClick={() => navigate('/terrain')}>
                        <i className="fas fa-arrow-left"></i> Retour
                    </button>
                </div>
            </div>
            {isReservationModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Réserver {terrain.Title}</h2>
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

            {confirmationMessage && (
                <div className="confirmation-message">
                    {confirmationMessage}
                </div>
            )}
        </div>
    );
}

export default TerrainDetail;