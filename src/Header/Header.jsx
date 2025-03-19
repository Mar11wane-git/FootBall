import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, logout }) {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        setIsLogoutModalOpen(false); // Ferme le modal avant de se déconnecter
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">LWST</Link>
            </div>

            <div className="nav-links">
                <Link to="/accueil">Accueil</Link>
                <Link to="/terrain">Terrain</Link>
                <Link to="/tournoi">Tournois</Link>
                <Link to="/reservation">Réservation</Link>
                <Link to="/contact">Contact</Link>
            </div>

            <div className="auth-button">
                {user ? (
                    <>
                        <button className="logout-button" onClick={() => setIsLogoutModalOpen(true)}>
                            <i className="fas fa-sign-out-alt"></i> Se déconnecter
                        </button>
                        {isLogoutModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h2>Confirmation de Déconnexion</h2>
                                    <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                                    <div className="modal-actions">
                                        <button className="btn-ajt" onClick={handleLogout}>
                                            Oui
                                        </button>
                                        <button className="btn-annuler" onClick={() => setIsLogoutModalOpen(false)}>
                                            Non
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/login">
                        <button className="login-button">
                            <i className="fas fa-sign-in-alt"></i> Se connecter
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Header;
