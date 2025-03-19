import React, { useState, useEffect } from 'react';
import LoginPrompt from './LoginPrompt';

function Tournoi({ user }) {
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [selectedTournoi, setSelectedTournoi] = useState(null);
    const [formData, setFormData] = useState({
        teamName: '',
        captainName: '',
        phoneNumber: '',
        email: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [registeredTeams, setRegisteredTeams] = useState(() => {
        const saved = localStorage.getItem('registeredTeams');
        return saved ? JSON.parse(saved) : {};
    });
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        localStorage.setItem('registeredTeams', JSON.stringify(registeredTeams));
    }, [registeredTeams]);

    // Liste des tournois disponibles
    const tournois = [
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
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
            <h1>Tournois Disponibles</h1>
            <div className="tournois-grid">
                {tournois.map((tournoi) => (
                    <div key={tournoi.id} className="tournoi-card">
                        <h2>{tournoi.name}</h2>
                        <div className="tournoi-info">
                            <p><strong>Date:</strong> {tournoi.date}</p>
                            <p><strong>Équipes:</strong> {tournoi.registeredTeams}/{tournoi.maxTeams}</p>
                            <p><strong>Prix:</strong> {tournoi.prizePool}</p>
                            <p><strong>Format:</strong> {tournoi.format}</p>
                            <p><strong>Frais d'inscription:</strong> {tournoi.entryFee}</p>
                            <p className="description">{tournoi.description}</p>
                        </div>
                        {user ? (
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

            {confirmationMessage && (
                <div className="confirmation-message">
                    {confirmationMessage}
                </div>
            )}
        </div>
    );
}

export default Tournoi; 