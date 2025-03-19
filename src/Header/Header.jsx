import React from 'react';
import './Header.css'
import {Link, useNavigate} from 'react-router-dom'

function Header({ user, logout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
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
                    <button className="login-btn" onClick={handleLogout}>Se déconnecter</button>
                ) : (
                    <Link to="/login">
                        <button className="login-btn">Se connecter</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Header;