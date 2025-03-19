import React, { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici vous pouvez ajouter la logique d'envoi du message
        setConfirmationMessage('Votre message a été envoyé avec succès !');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        setTimeout(() => {
            setConfirmationMessage('');
        }, 5000);
    };

    return (
        <div className="contact-container">
            <div className="contact-info">
                <h1>Contactez-nous</h1>
                <div className="info-section">
                    <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <h3>Notre Adresse</h3>
                        <p>Bab Tizimi</p>
                        <p>Meknes, Maroc</p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <h3>Téléphone</h3>
                        <p>+212 6 12 34 56 78</p>
                        <p>+212 5 22 33 44 55</p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <h3>Email</h3>
                        <p>contact@terrainsport.com</p>
                        <p>info@terrainsport.com</p>
                    </div>
                </div>
            </div>

            <div className="contact-form">
                <h2>Envoyez-nous un message</h2>
                {confirmationMessage && (
                    <div className="confirmation-message">
                        {confirmationMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom complet</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Votre nom"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Votre email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Sujet</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Sujet de votre message"
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Votre message"
                            rows="5"
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-btn">
                        <i className="fas fa-paper-plane"></i> Envoyer le message
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Contact;