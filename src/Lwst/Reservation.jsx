import React, { useState, useEffect } from 'react';
import LoginPrompt from './LoginPrompt';

function Reservation({ reservations, deleteReservation, modifyReservation, acceptReservation, user }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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
    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        amount: '',
        reservationId: ''
    });
    const [paymentStatus, setPaymentStatus] = useState({});

    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!user) {
        return <LoginPrompt />;
    }

    // Filtrer les réservations en fonction du rôle de l'utilisateur
    const displayedReservations = user.role === 'admin'
        ? reservations  // Afficher toutes les réservations pour l'admin
        : reservations.filter(res => res.userId === user.username);  // Filtrer pour l'utilisateur standard

    const handleModifyClick = (reservation) => {
        setFormData({ ...reservation });
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

    const handlePaymentClick = (reservation) => {
        setPaymentForm({
            ...paymentForm,
            reservationId: reservation.id,
            amount: reservation.terrainPrice // Utilisation du prix du terrain
        });
        setIsPaymentModalOpen(true);
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm({
            ...paymentForm,
            [name]: value
        });
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        const reservationId = paymentForm.reservationId;
        setPaymentStatus(prev => ({
            ...prev,
            [reservationId]: 'success'
        }));
        setTimeout(() => {
            setIsPaymentModalOpen(false);
            setPaymentForm({
                cardNumber: '',
                cardName: '',
                expiryDate: '',
                cvv: '',
                amount: '',
                reservationId: ''
            });
        }, 2000);
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
                        {user.role === 'admin' && <th>Utilisateur</th>}
                        <th>Actions</th>
                        <th>Paiement</th>
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
                                <td className="payment-cell">
                                    {!paymentStatus[reservation.id] && (
                                        <button
                                            onClick={() => handlePaymentClick(reservation)}
                                            className="btn-payment"
                                        >
                                            <i className="fas fa-credit-card"></i> Payer
                                        </button>
                                    )}
                                    {paymentStatus[reservation.id] === 'success' && (
                                        <span className="payment-success">
                                            <i className="fas fa-check-circle"></i> Paiement Réussi
                                        </span>
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
                                <label><i className="fas fa-user"></i> Nom:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label><i className="fas fa-calendar-alt"></i> Date de Réservation:</label>
                                <input type="date" name="date" min={today} value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label><i className="fas fa-clock"></i> Plage Horaire:</label>
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

            {isPaymentModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Paiement</h2>
                        <form onSubmit={handlePaymentSubmit} className="tournoi-form">
                            <div className="form-group">
                                <label>Numéro de carte:</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={paymentForm.cardNumber}
                                    onChange={handlePaymentChange}
                                    required
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom sur la carte:</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={paymentForm.cardName}
                                    onChange={handlePaymentChange}
                                    required
                                    placeholder="JEAN DUPONT"
                                />
                            </div>
                            <div className="form-group">
                                <label>Date d'expiration:</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={paymentForm.expiryDate}
                                    onChange={handlePaymentChange}
                                    required
                                    placeholder="MM/AA"
                                    maxLength="5"
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV:</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={paymentForm.cvv}
                                    onChange={handlePaymentChange}
                                    required
                                    placeholder="123"
                                    maxLength="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Montant à payer:</label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={`${paymentForm.amount} DT`}
                                    readOnly
                                    className="readonly-input"
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    className={`btn-modify ${paymentStatus[paymentForm.reservationId] === 'success' ? 'success' : ''}`}
                                    disabled={paymentStatus[paymentForm.reservationId] === 'success'}
                                >
                                    <i className="fas fa-credit-card"></i> Payer
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setIsPaymentModalOpen(false);
                                        setPaymentForm({
                                            cardNumber: '',
                                            cardName: '',
                                            expiryDate: '',
                                            cvv: '',
                                            amount: '',
                                            reservationId: ''
                                        });
                                    }}
                                >
                                    <i className="fas fa-times"></i> Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reservation;