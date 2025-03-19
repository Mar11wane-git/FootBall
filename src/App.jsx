import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import Accueil from "./Lwst/Accueil";
import Terrain from "./Lwst/Terrain";
import TerrainDetail from "./Lwst/TerrainDetail";
import Reservation from "./Lwst/Reservation";
import Contact from "./Lwst/Contact";
import Tournoi from './Lwst/Tournoi';
import Login from './Lwst/Login';
import "./lwst/lwst.css"; // Assurez-vous d'avoir ce fichier CSS

function App() {
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('allReservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(null);

  const terrains = [
    {  
        id: 1,
        photo: 'tr1.jpg',
        Title: 'Terrain 1 - Gazon Synthétique',
        description: 'Terrain de dernière génération avec gazon synthétique haute qualité. Parfait pour les matchs compétitifs.',
        price: 200 // Prix en DH
    },
    {   
        id: 2,
        photo: 'tr1.jpg',
        Title: 'Terrain 2 - Gazon Naturel',
        description: 'Profitez de l\'authenticité du gazon naturel pour vos matchs et entraînements.',
        price: 250 // Prix en DH
    },
    {   
        id: 3,
        photo: 'tr1.jpg',
        Title: 'Terrain 3 - Gazon Hybride',
        description: 'Un mélange parfait de gazon naturel et synthétique pour une expérience optimale.',
        price: 300 // Prix en DH
    },
    {   
      id: 4,
      photo: 'tr1.jpg',
      Title: 'Terrain 4 - Gazon Hybride',
      description: 'Un mélange parfait de gazon naturel et synthétique pour une expérience optimale.',
      price: 350 // Prix en DH
  }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allReservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (newReservation) => {
    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem('allReservations', JSON.stringify(updatedReservations));
  };

  const modifyReservation = (updatedReservation) => {
    const updatedReservations = reservations.map(reservation =>
      reservation.id === updatedReservation.id ? updatedReservation : reservation
    );
    setReservations(updatedReservations);
    localStorage.setItem('allReservations', JSON.stringify(updatedReservations));
  };

  const deleteReservation = (id) => {
    const updatedReservations = reservations.filter(reservation => reservation.id !== id);
    setReservations(updatedReservations);
    localStorage.setItem('allReservations', JSON.stringify(updatedReservations));
  };

  const acceptReservation = (id) => {
    setReservations(reservations.map(reservation =>
      reservation.id === id ? { ...reservation, accepted: true } : reservation
    ));
  };

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', JSON.stringify(username));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="app-container">
      {/* Vidéo en arrière-plan */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/foot.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
      <div className="video-overlay"></div>

      {/* Contenu du site */}
      <Header user={user} logout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/accueil" />} />
        <Route path="accueil" element={<Accueil />} />
        <Route path="terrain" element={<Terrain user={user} addReservation={addReservation} reservations={reservations} />} />
        <Route path="terrain/:id" element={<TerrainDetail user={user} terrains={terrains} addReservation={addReservation} reservations={reservations} />} />
        <Route path="reservation" element={user ? <Reservation user={user} reservations={reservations} deleteReservation={deleteReservation} modifyReservation={modifyReservation} /> : <Navigate to="/login" />} />
        <Route path="contact" element={<Contact />} />
        <Route path="tournoi" element={<Tournoi user={user} />} />
        <Route path="login" element={<Login setUser={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;
