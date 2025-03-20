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
    
    // État pour le formulaire d'ajout de terrain
    const [newTerrain, setNewTerrain] = useState({
        title: '',
        description: '',
        price: '',
        photo: ''
    });
    
    // État pour stocker la liste des terrains
    const [terrains, setTerrains] = useState(() => {
        const savedTerrains = localStorage.getItem('terrains');
        if (savedTerrains) {
            return JSON.parse(savedTerrains);
        }
        return [
            {
                id: 1,
                photo: 'tr1.jpg',
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
    });
    
    // État pour ouvrir/fermer le formulaire d'ajout de terrain
    const [showAddTerrainForm, setShowAddTerrainForm] = useState(false);
    // État pour la confirmation de suppression
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [terrainToDelete, setTerrainToDelete] = useState(null);

    useEffect(() => {
        localStorage.setItem('registeredTerrains', JSON.stringify(registeredTerrains));
    }, [registeredTerrains]);
    
    useEffect(() => {
        localStorage.setItem('terrains', JSON.stringify(terrains));
    }, [terrains]);

    const handleReserveClick = (terrainId) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setSelectedTerrain(terrains.find(t => t.id === terrainId));
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
    
    const handleNewTerrainChange = (e) => {
        const { name, value } = e.target;
        setNewTerrain({
            ...newTerrain,
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

    const handleAddTerrain = (e) => {
        e.preventDefault();
        const newId = terrains.length > 0 ? Math.max(...terrains.map(t => t.id)) + 1 : 1;
        
        const newTerrainData = { 
            id: newId, 
            photo: newTerrain.photo || 'tr1.jpg',  // Photo par défaut si non spécifiée
            Title: newTerrain.title,
            description: newTerrain.description,
            price: newTerrain.price
        };

        const updatedTerrains = [...terrains, newTerrainData];
        setTerrains(updatedTerrains);
        
        // Réinitialiser le formulaire
        setNewTerrain({ title: '', description: '', price: '', photo: '' });
        setConfirmationMessage('Le nouveau terrain a été ajouté avec succès!');
        setShowAddTerrainForm(false);
        
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    // Nouvelle fonction pour confirmer la suppression
    const handleDeleteConfirmation = (terrainId) => {
        setTerrainToDelete(terrainId);
        setShowDeleteConfirmation(true);
    };

    // Nouvelle fonction pour annuler la suppression
    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setTerrainToDelete(null);
    };

    // Nouvelle fonction pour confirmer et effectuer la suppression
    const handleConfirmDelete = () => {
        // Vérifier s'il y a des réservations actives pour ce terrain
        const hasActiveReservations = reservations.some(reservation => 
            reservation.terrainId === terrainToDelete && 
            new Date(reservation.date) >= new Date()
        );

        if (hasActiveReservations) {
            setConfirmationMessage('Impossible de supprimer ce terrain car il possède des réservations actives.');
            setShowDeleteConfirmation(false);
            setTerrainToDelete(null);
            
            setTimeout(() => {
                setConfirmationMessage('');
            }, 5000);
            return;
        }

        // Supprimer le terrain
        const updatedTerrains = terrains.filter(terrain => terrain.id !== terrainToDelete);
        setTerrains(updatedTerrains);
        
        // Mettre à jour localStorage
        const updatedRegisteredTerrains = { ...registeredTerrains };
        delete updatedRegisteredTerrains[terrainToDelete];
        setRegisteredTerrains(updatedRegisteredTerrains);
        
        setShowDeleteConfirmation(false);
        setTerrainToDelete(null);
        setConfirmationMessage('Le terrain a été supprimé avec succès.');
        
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };
    
    // Vérifier si l'utilisateur est un admin
    const isAdmin = user && user.role === 'admin';

    return (
        <div>
            {showLoginPrompt && <LoginPrompt />}
            
            <h1>Terrains Disponibles</h1>
            
            {/* Section Admin pour ajouter des terrains */}
            {isAdmin && (
                <div className="admin-controls">
                    <button 
                        className="btn-ajt"
                        onClick={() => setShowAddTerrainForm(!showAddTerrainForm)}
                    >
                        {showAddTerrainForm ? 'Annuler' : 'Ajouter un nouveau terrain'}
                    </button>
                    
                    {showAddTerrainForm && (
                        <div className="add-terrain-form">
                            <h3>Ajouter un nouveau terrain</h3>
                            <form onSubmit={handleAddTerrain}>
                                <div>
                                    <label>Titre:</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={newTerrain.title}
                                        onChange={handleNewTerrainChange}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label>Description:</label>
                                    <textarea 
                                        name="description" 
                                        value={newTerrain.description}
                                        onChange={handleNewTerrainChange}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label>Prix (€/heure):</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        value={newTerrain.price}
                                        onChange={handleNewTerrainChange}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label>URL de la photo:</label>
                                    <input 
                                        type="text" 
                                        name="photo" 
                                        value={newTerrain.photo}
                                        onChange={handleNewTerrainChange}
                                        placeholder="tr1.jpg"
                                    />
                                </div>
                                <button type="submit" className="btn-ajt">
                                    <i className="fas fa-plus"></i> Ajouter le terrain
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
            
            {confirmationMessage && (
                <div className="confirmation-message">
                    {confirmationMessage}
                </div>
            )}
            
            <div className="container">
                {terrains.map((e) => (
                    <div key={e.id} className="terrain">
                        <img src={e.photo} alt={e.Title} className='im1' />
                        <div className="terrain-content">
                            <h3>{e.Title}</h3>
                            <p>{e.description}</p>
                            <div className="terrain-actions">
                                <Link to={`/terrain/${e.id}`}>
                                    <button className='btnn'>
                                        <i className="fas fa-eye"></i> Voir Détail
                                    </button>
                                </Link>
                                <button className='btnn' onClick={() => handleReserveClick(e.id)}>
                                    <i className="fas fa-calendar-check"></i> Réserver
                                </button>
                                {isAdmin && (
                                    <button className='btnn btnn-danger' onClick={() => handleDeleteConfirmation(e.id)}>
                                        <i className="fas fa-trash"></i> Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de réservation */}
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

            {/* Modal de confirmation de suppression */}
            {showDeleteConfirmation && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer ce terrain ?</p>
                        <p>Cette action ne peut pas être annulée.</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-annuler" onClick={handleCancelDelete}>
                                <i className="fas fa-times"></i> Annuler
                            </button>
                            <button type="button" className="btn-ajt btn-danger" onClick={handleConfirmDelete}>
                                <i className="fas fa-trash"></i> Confirmer la suppression
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Terrain;