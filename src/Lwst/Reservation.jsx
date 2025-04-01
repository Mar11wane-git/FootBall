import React, { useState, useEffect } from 'react';
import LoginPrompt from './LoginPrompt';

function Reservation({ reservations, deleteReservation, modifyReservation, acceptReservation, user }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        date: '',
        timeSlot: '',
        accepted: false,
        userId: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [deletionMessage, setDeletionMessage] = useState('');

    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!user) {
        return <LoginPrompt />;
    }

    // Filtrer les réservations en fonction du rôle de l'utilisateur
    const displayedReservations = user.role === 'admin' 
        ? reservations  // Afficher toutes les réservations pour l'admin
        : reservations.filter(res => res.userId === user.username);  // Filtrer pour l'utilisateur standard

    const handleModifyClick = (reservation) => {
        setFormData({...reservation});
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (reservationId) => {
        setReservationToDelete(reservationId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteReservation(reservationToDelete);
        
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
            timeSlot: '',
            accepted: false,
            userId: ''
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
        
        // Prepare the updated reservation data
        const updatedReservation = {
            ...formData,
            accepted: formData.accepted === 'true' || formData.accepted === true
        };
        
        modifyReservation(updatedReservation);
        
        setConfirmationMessage('Réservation modifiée avec succès.');
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
        handleCloseEditModal();
    };

    const handleAccept = (id) => {
        acceptReservation(id);
        setConfirmationMessage('Réservation acceptée avec succès.');
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

    return (
        <div className="reservation-container">
            <h1>
                {user.role === 'admin' 
                    ? 'Toutes les Réservations' 
                    : 'Historique des Réservations'}
            </h1>
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
            
            <table className="reservation-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Date</th>
                        <th>Plage Horaire</th>
                        <th>Statut</th>
                        {user.role === 'admin' && <th>Utilisateur</th>}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedReservations.length === 0 ? (
                        <tr>
                            <td colSpan={user.role === 'admin' ? 6 : 5} className="no-reservations">
                                Aucune réservation disponible.
                            </td>
                        </tr>
                    ) : (
                        displayedReservations.map(reservation => (
                            <tr key={reservation.id} className={reservation.accepted ? 'accepted' : 'pending'}>
                                <td>{reservation.name}</td>
                                <td>{reservation.date}</td>
                                <td>{reservation.timeSlot}</td>
                                <td>{reservation.accepted ? 'Acceptée' : 'En attente'}</td>
                                {user.role === 'admin' && <td>{reservation.userId || 'Non assigné'}</td>}
                                <td className="actions">
                                    <button onClick={() => handleModifyClick(reservation)} className="btn-modify">
                                        <i className="fas fa-edit"></i> Modifier
                                    </button>
                                    <button onClick={() => handleDeleteClick(reservation.id)} className="btn">
                                        <i className="fas fa-trash-alt"></i> Supprimer
                                    </button>
                                    {user.role === 'admin' && !reservation.accepted && (
                                        <button onClick={() => handleAccept(reservation.id)} className="btn-modify">
                                            <i className="fas fa-check"></i> Accepter
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Modifier Réservation</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nom:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>                
                            <div className="form-group">
                                <label>Date de Réservation:</label>
                                <input type="date" name="date" min={today} value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Plage Horaire:</label>
                                <select name="timeSlot" value={formData.timeSlot || ''} onChange={handleChange} required>
                                    <option value="" disabled>Choisir une heure</option>
                                    {timeSlots.map(slot => {
                                        const isReserved = reservations.some(
                                            reservation => 
                                                reservation.date === formData.date && 
                                                reservation.timeSlot === slot &&
                                                reservation.id !== formData.id
                                        );
                                        return (
                                            <option 
                                                key={slot} 
                                                value={slot}
                                                disabled={isReserved}
                                            >
                                                {isReserved ? `${slot} (Déjà réservé)` : slot}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            {user.role === 'admin' && (
                                <div className="form-group">
                                    <label>Utilisateur:</label>
                                    <input 
                                        type="text" 
                                        name="userId" 
                                        value={formData.userId || ''} 
                                        onChange={handleChange} 
                                        readOnly={formData.userId !== user.username} 
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Statut:</label>
                                <select 
                                    name="accepted" 
                                    value={formData.accepted === true || formData.accepted === 'true' ? 'true' : 'false'} 
                                    onChange={handleChange}
                                    disabled={user.role !== 'admin'}
                                >
                                    <option value="false">En attente</option>
                                    <option value="true">Acceptée</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-modify">
                                    <i className="fas fa-check"></i> Enregistrer
                                </button>
                                <button type="button" className="btn" onClick={handleCloseEditModal}>
                                    <i className="fas fa-times"></i> Annuler
                                </button>
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
                            <button className="btn-modify" onClick={confirmDelete}>
                                <i className="fas fa-check"></i> Confirmer
                            </button>
                            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>
                                <i className="fas fa-times"></i> Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reservation;