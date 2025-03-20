import React, { useState, useEffect } from 'react';
import LoginPrompt from './LoginPrompt';

function Tournoi({ user }) {
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isAddTournoiModalOpen, setIsAddTournoiModalOpen] = useState(false);
    const [selectedTournoi, setSelectedTournoi] = useState(null);
    const [formData, setFormData] = useState({
        teamName: '',
        captainName: '',
        phoneNumber: '',
        email: ''
    });
    const [tournoiFormData, setTournoiFormData] = useState({
        name: '',
        date: '',
        maxTeams: '',
        registeredTeams: 0,
        prizePool: '',
        description: '',
        format: '',
        entryFee: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [registeredTeams, setRegisteredTeams] = useState(() => {
        const saved = localStorage.getItem('registeredTeams');
        return saved ? JSON.parse(saved) : {};
    });
    const [tournois, setTournois] = useState(() => {
        const saved = localStorage.getItem('tournois');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                name: "Coupe de la Ville",
                date: "2024-04-15",
                maxTeams: 16,
                registeredTeams: 8,
                prizePool: "10000 DH",
                description: "Tournoi annuel opposant les meilleures équipes",
                format: "Élimination directe",
                entryFee: "500 DH"
            },
            {
                id: 2,
                name: "Championnat Amateur",
                date: "2024-05-01",
                maxTeams: 12,
                registeredTeams: 6,
                prizePool: "5000 DH",
                description: "Tournoi réservé aux équipes amateurs",
                format: "Phase de groupes + Élimination directe",
                entryFee: "300 DH"
            },
            {
                id: 3,
                name: "Tournoi Ramadan",
                date: "2024-03-20",
                maxTeams: 20,
                registeredTeams: 12,
                prizePool: "15000 DH",
                description: "Grand tournoi nocturne pendant le mois de Ramadan",
                format: "Phase de groupes + Élimination directe",
                entryFee: "600 DH"
            }
        ];
    });
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

    useEffect(() => {
        localStorage.setItem('registeredTeams', JSON.stringify(registeredTeams));
        localStorage.setItem('tournois', JSON.stringify(tournois));
    }, [registeredTeams, tournois]);

    const handleRegisterClick = (tournoi) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setSelectedTournoi(tournoi);
        setIsRegistrationModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsRegistrationModalOpen(false);
        setSelectedTournoi(null);
        setFormData({
            teamName: '',
            captainName: '',
            phoneNumber: '',
            email: ''
        });
    };

    const handleCloseTournoiModal = () => {
        setIsAddTournoiModalOpen(false);
        setTournoiFormData({
            name: '',
            date: '',
            maxTeams: '',
            registeredTeams: 0,
            prizePool: '',
            description: '',
            format: '',
            entryFee: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTournoiChange = (e) => {
        const { name, value } = e.target;
        setTournoiFormData({
            ...tournoiFormData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedTeams = {
            ...registeredTeams,
            [selectedTournoi.id]: true
        };
        setRegisteredTeams(updatedTeams);

        setConfirmationMessage('Votre équipe a été inscrite avec succès au tournoi !');
        handleCloseModal();
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    const handleAddTournoi = (e) => {
        e.preventDefault();

        const newTournoi = {
            ...tournoiFormData,
            id: Date.now(),
            registeredTeams: parseInt(tournoiFormData.registeredTeams) || 0,
            maxTeams: parseInt(tournoiFormData.maxTeams) || 0
        };

        setTournois([...tournois, newTournoi]);
        setConfirmationMessage('Nouveau tournoi ajouté avec succès !');
        handleCloseTournoiModal();
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    const handleDeleteTournoi = (id) => {
        const updatedTournois = tournois.filter(tournoi => tournoi.id !== id);
        setTournois(updatedTournois);

        // Supprimer également les inscriptions associées
        const updatedTeams = { ...registeredTeams };
        delete updatedTeams[id];
        setRegisteredTeams(updatedTeams);

        setConfirmationMessage('Tournoi supprimé avec succès.');
        setDeleteConfirmationId(null);
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    const handleUnregister = (tournoiId) => {
        const updatedTeams = { ...registeredTeams };
        delete updatedTeams[tournoiId];
        setRegisteredTeams(updatedTeams);

        setConfirmationMessage('Votre inscription a été annulée.');
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    return (
        <div className="tournoi-container">
            {showLoginPrompt && <LoginPrompt />}
            <div className="tournoi-header">
                <h1>Tournois Disponibles</h1>
                {user && user.role === 'admin' && (
                    <button
                        className="btn-add-tournoi"
                        onClick={() => setIsAddTournoiModalOpen(true)}
                    >
                        <i className="fas fa-plus"></i> Ajouter un tournoi
                    </button>
                )}
            </div>

            <div className="tournois-grid">
                {tournois.map((tournoi) => (
                    <div key={tournoi.id} className="tournoi-card">
                        <h2 className="tournoi-title">{tournoi.name}</h2>
                        <div className="tournoi-info">
                            <p><strong>Date:</strong> {tournoi.date}</p>
                            <p><strong>Équipes:</strong> {tournoi.registeredTeams}/{tournoi.maxTeams}</p>
                            <p><strong>Prix:</strong> {tournoi.prizePool}</p>
                            <p><strong>Format:</strong> {tournoi.format}</p>
                            <p><strong>Frais d'inscription:</strong> {tournoi.entryFee}</p>
                            <p className="description">{tournoi.description}</p>
                        </div>

                        {user && user.role === 'admin' ? (
                            deleteConfirmationId === tournoi.id ? (
                                <div className="delete-confirmation">
                                    <p>Êtes-vous sûr de vouloir supprimer ce tournoi ?</p>
                                    <div className="confirmation-buttons">
                                        <button
                                            className="btn-confirm"
                                            onClick={() => handleDeleteTournoi(tournoi.id)}
                                        >
                                            Confirmer
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={() => setDeleteConfirmationId(null)}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="btn-delete"
                                    onClick={() => setDeleteConfirmationId(tournoi.id)}
                                >
                                    <i className="fas fa-trash"></i> Supprimer
                                </button>
                            )
                        ) : user ? (
                            registeredTeams[tournoi.id] ? (
                                <button
                                    className="btn-unregister"
                                    onClick={() => handleUnregister(tournoi.id)}
                                >
                                    Annuler l'inscription
                                </button>
                            ) : (
                                <button
                                    className="btn-register"
                                    onClick={() => handleRegisterClick(tournoi)}
                                    disabled={tournoi.registeredTeams >= tournoi.maxTeams}
                                >
                                    {tournoi.registeredTeams >= tournoi.maxTeams ? 'Complet' : "S'inscrire"}
                                </button>
                            )
                        ) : (
                            <p className="login-required">Connectez-vous pour vous inscrire au tournoi</p>
                        )}
                    </div>
                ))}
            </div>

            {isRegistrationModalOpen && selectedTournoi && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Inscription au {selectedTournoi.name}</h2>
                        <form onSubmit={handleSubmit} className="registration-form">
                            <div className="form-group">
                                <label>Nom de l'équipe:</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    value={formData.teamName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Entrez le nom de votre équipe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom du capitaine:</label>
                                <input
                                    type="text"
                                    name="captainName"
                                    value={formData.captainName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nom du capitaine"
                                />
                            </div>
                            <div className="form-group">
                                <label>Numéro de téléphone:</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="0600000000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="exemple@email.com"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-ajt">S'inscrire</button>
                                <button type="button" className="btn-annuler" onClick={handleCloseModal}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAddTournoiModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Ajouter un nouveau tournoi</h2>
                        <form onSubmit={handleAddTournoi} className="tournoi-form">
                            <div className="form-group">
                                <label>Nom du tournoi:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={tournoiFormData.name}
                                    onChange={handleTournoiChange}
                                    required
                                    placeholder="Nom du tournoi"
                                />
                            </div>
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={tournoiFormData.date}
                                    onChange={handleTournoiChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre maximum d'équipes:</label>
                                <input
                                    type="number"
                                    name="maxTeams"
                                    value={tournoiFormData.maxTeams}
                                    onChange={handleTournoiChange}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Équipes inscrites:</label>
                                <input
                                    type="number"
                                    name="registeredTeams"
                                    value={tournoiFormData.registeredTeams}
                                    onChange={handleTournoiChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Prix (Prize Pool):</label>
                                <input
                                    type="text"
                                    name="prizePool"
                                    value={tournoiFormData.prizePool}
                                    onChange={handleTournoiChange}
                                    required
                                    placeholder="Ex: 10000 DH"
                                />
                            </div>
                            <div className="form-group">
                                <label>Format:</label>
                                <input
                                    type="text"
                                    name="format"
                                    value={tournoiFormData.format}
                                    onChange={handleTournoiChange}
                                    required
                                    placeholder="Ex: Élimination directe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Frais d'inscription:</label>
                                <input
                                    type="text"
                                    name="entryFee"
                                    value={tournoiFormData.entryFee}
                                    onChange={handleTournoiChange}
                                    required
                                    placeholder="Ex: 500 DH"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={tournoiFormData.description}
                                    onChange={handleTournoiChange}
                                    required
                                    placeholder="Description du tournoi"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-modify">Ajouter</button>
                                <button type="button" className="btn" onClick={handleCloseTournoiModal}>Annuler</button>
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

export default Tournoi;