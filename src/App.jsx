import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Header from "./Header/Header";
import Accueil from "./Lwst/Accueil";
import Terrain from "./Lwst/Terrain";
import TerrainDetail from "./Lwst/TerrainDetail";
import Reservation from "./Lwst/Reservation";
import Contact from "./Lwst/Contact";
import "./lwst/lwst.css"; // Assurez-vous d'avoir ce fichier CSS

function App() {
  const [reservations, setReservations] = useState([]);

  const terrains = [
    {  
        id: 1,
        photo: 'tr1.jpg',
        Title: 'Terrain 1 - Gazon Synthétique',
        description: 'Terrain de dernière génération avec gazon synthétique haute qualité. Parfait pour les matchs compétitifs.',
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
    }
  ];

  const addReservation = (newReservation) => {
    setReservations([...reservations, newReservation]);
  };

  const deleteReservation = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
  };

  const acceptReservation = (id) => {
    setReservations(reservations.map(reservation =>
      reservation.id === id ? { ...reservation, accepted: true } : reservation
    ));
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
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/accueil" />} />
        <Route path="accueil" element={<Accueil />} />
        <Route path="terrain" element={<Terrain addReservation={addReservation} reservations={reservations} />} />
        <Route path="terrain/:id" element={<TerrainDetail terrains={terrains} addReservation={addReservation} reservations={reservations} />} />
        <Route path="Reservation" element={<Reservation reservations={reservations} deleteReservation={deleteReservation} acceptReservation={acceptReservation} />} />
        <Route path="Contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
