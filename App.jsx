import React, { useState, useEffect } from 'react';

const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('allReservations');
    return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
    localStorage.setItem('allReservations', JSON.stringify(reservations));
}, [reservations]);

useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
}, []);

const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', JSON.stringify(username));
};

const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
}; 