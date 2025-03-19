import React, { useState, useEffect } from 'react';
import LoginPrompt from './LoginPrompt';

function Reservation({ reservations, deleteReservation, modifyReservation, user }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        date: '',
        timeSlot: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [deletionMessage, setDeletionMessage] = useState('');
    const [savedReservations, setSavedReservations] = useState(() => {
        const saved = localStorage.getItem('reservations');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('reservations', JSON.stringify(savedReservations));
    }, [savedReservations]);

    if (!user) {
        return <LoginPrompt />;
    }

    const handleModifyClick = (reservation) => {
        setFormData(reservation);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (reservationId) => {
        setReservationToDelete(reservationId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteReservation(reservationToDelete);
        
        // Mettre à jour localStorage
        const updatedReservations = savedReservations.filter(
            reservation => reservation.id !== reservationToDelete
        );
        setSavedReservations(updatedReservations);
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        
        setDeletionMessage('Réservation supprimée avec succès.');
        setTimeout(() => {
            setDeletionMessage('');
        }, 5000);
        setIsDeleteModalOpen(false);
        setReservationToDelete(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setFormData({
            id: null,
            name: '',
            date: '',
            timeSlot: ''
        });
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
        modifyReservation(formData);
        
        // Mettre à jour localStorage
        const updatedReservations = savedReservations.map(reservation =>
            reservation.id === formData.id ? formData : reservation
        );
        setSavedReservations(updatedReservations);
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        
        setConfirmationMessage('Réservation modifiée avec succès.');
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
        handleCloseEditModal();
    };

    const today = new Date().toISOString().split('T')[0];
    const timeSlots = [
        "09:00-10:00", "10:00-11:00", "11:00-12:00",
        "15:00-16:00", "16:00-17:00", "17:00-18:00",
        "18:00-19:00", "19:00-20:00", "20:00-21:00",
        "21:00-22:00"
    ];

    return (
        <div>
            <h1>Historique des Réservations</h1>
            {confirmationMessage && (
                <div className="confirmation-message">
                    {confirmationMessage}
                </div>
            )}
            {deletionMessage && (
                <div className="deletion-message">
                    {deletionMessage}
                </div>
            )}
            <table border="1">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Date</th>
                        <th>Plage Horaire</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.name}</td>
                            <td>{reservation.date}</td>
                            <td>{reservation.timeSlot}</td>
                            <td>{reservation.accepted ? 'Acceptée' : 'En attente'}</td>
                            <td>
                                <button onClick={() => handleModifyClick(reservation)} className='btn-modify'>Modifier</button>
                                <button onClick={() => handleDeleteClick(reservation.id)} className='btn'>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Modifier Réservation</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Nom:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
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
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-ajt">Enregistrer</button>
                                <button type="button" className="btn-annuler" onClick={handleCloseEditModal}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Êtes-vous sûr de vouloir supprimer cette réservation ?</h2>
                        <div className="modal-actions">
                            <button className="btn-ajt" onClick={confirmDelete}>Confirmer</button>
                            <button className="btn-annuler" onClick={() => setIsDeleteModalOpen(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reservation;