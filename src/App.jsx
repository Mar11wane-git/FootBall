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
import LoginPrompt from './Lwst/LoginPrompt';
import TournoiDetail from './Lwst/TournoiDetail';
import "./lwst/lwst.css";

function App() {
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('allReservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(null);

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
        description: 'Terrain de dernière génération avec gazon synthétique haute qualité. Parfait pour les matchs compétitifs.',
        price: '150'
      },
      {
        id: 2,
        photo: 'tr1.jpg',
        Title: 'Terrain 2 - Gazon Naturel',
        description: 'Profitez de l\'authenticité du gazon naturel pour vos matchs et entraînements.',
        price: '180'
      },
      {
        id: 3,
        photo: 'tr1.jpg',
        Title: 'Terrain 3 - Gazon Hybride',
        description: 'Un mélange parfait de gazon naturel et synthétique pour une expérience optimale.',
        price: '165'
      },
      {
        id: 4,
        photo: 'tr1.jpg',
        Title: 'Terrain 4 - Gazon Hybride',
        description: 'Un mélange parfait de gazon naturel et synthétique pour une expérience optimale.',
        price: '165'
      }
    ];
  });

  const [tournois, setTournois] = useState(() => {
    const saved = localStorage.getItem('tournois');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
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

  useEffect(() => {
    localStorage.setItem('terrains', JSON.stringify(terrains));
  }, [terrains]);

  useEffect(() => {
    localStorage.setItem('tournois', JSON.stringify(tournois));
  }, [tournois]);

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
    const reservationWithUser = {
      ...newReservation,
      userId: user ? user.username : 'guest',
      accepted: user?.role === 'admin' ? true : false,
      id: Date.now().toString()
    };

    const updatedReservations = [...reservations, reservationWithUser];
    setReservations(updatedReservations);
    localStorage.setItem('allReservations', JSON.stringify(updatedReservations));
    return reservationWithUser;
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
    const updatedReservations = reservations.map(reservation =>
      reservation.id === id ? { ...reservation, accepted: true } : reservation
    );
    setReservations(updatedReservations);
    localStorage.setItem('allReservations', JSON.stringify(updatedReservations));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addTerrain = (newTerrain) => {
    setTerrains(prevTerrains => [...prevTerrains, newTerrain]);
  };

  const deleteTerrain = (terrainId) => {
    setTerrains(prevTerrains => prevTerrains.filter(terrain => terrain.id !== terrainId));
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
        <Route path="accueil" element={<Accueil user={user} />} />
        <Route path="terrain" element={
          <Terrain 
            user={user} 
            addReservation={addReservation} 
            reservations={reservations} 
            terrains={terrains}
            addTerrain={addTerrain}
            deleteTerrain={deleteTerrain}
          />
        } />
        <Route path="terrain/:id" element={
          <TerrainDetail 
            user={user} 
            terrains={terrains} 
            addReservation={addReservation} 
            reservations={reservations} 
          />
        } />
        <Route path="reservation" element={user ? <Reservation user={user} reservations={reservations} deleteReservation={deleteReservation} modifyReservation={modifyReservation} acceptReservation={acceptReservation} /> : <Navigate to="/login" />} />
        <Route path="contact" element={<Contact user={user} />} />
        <Route path="tournoi" element={<Tournoi user={user} tournois={tournois} setTournois={setTournois} />} />
        <Route path="tournoi/:id" element={<TournoiDetail user={user} tournois={tournois} setTournois={setTournois} />} />
        <Route path="login" element={<Login setUser={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;