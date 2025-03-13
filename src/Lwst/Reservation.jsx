import React from 'react';

function Reservation({ reservations, deleteReservation }) {
    return (
        <div>
            <h1>Historique des Réservations</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
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
                            <td>{reservation.email}</td>
                            <td>{reservation.date}</td>
                            <td>{reservation.timeSlot}</td>
                            <td>{reservation.accepted ? 'Acceptée' : 'En attente'}</td>
                            <td>
                                <button onClick={() => deleteReservation(reservation.id)} className={'btn'}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reservation;