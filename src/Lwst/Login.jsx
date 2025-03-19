import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [
            { username: 'soufiane', password: 'soufiane' }
        ];
    });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            // Logique de connexion
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                setUser({ username });
                navigate('/accueil');
            } else {
                setError('Nom d\'utilisateur ou mot de passe incorrect.');
            }
        } else {
            // Logique d'inscription
            if (users.some(u => u.username === username)) {
                setError('Ce nom d\'utilisateur existe déjà.');
                return;
            }

            // Validation du mot de passe
            if (password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Veuillez entrer une adresse email valide.');
                return;
            }

            // Validation du numéro de téléphone
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                setError('Veuillez entrer un numéro de téléphone valide (10 chiffres).');
                return;
            }

            // Création du nouveau compte
            const newUser = {
                username,
                password,
                email,
                phone
            };

            setUsers([...users, newUser]);
            setError('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
            
            // Réinitialiser les champs
            setUsername('');
            setPassword('');
            setEmail('');
            setPhone('');
            
            // Retourner à la page de connexion
            setTimeout(() => {
                setIsLogin(true);
                setError('');
            }, 2000);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
                {error && <p className={error.includes('succès') ? 'success-message' : 'error'}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Entrez votre nom d'utilisateur"
                        />
                    </div>
                    
                    {!isLogin && (
                        <>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Entrez votre email"
                                />
                            </div>
                            <div>
                                <label>Numéro de téléphone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    placeholder="Entrez votre numéro de téléphone"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Entrez votre mot de passe"
                        />
                    </div>

                    <button type="submit">
                        {isLogin ? (
                            <><i className="fas fa-sign-in-alt"></i> Se connecter</>
                        ) : (
                            <><i className="fas fa-user-plus"></i> S'inscrire</>
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                        <span 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setUsername('');
                                setPassword('');
                                setEmail('');
                                setPhone('');
                            }}
                            className="auth-link"
                        >
                            {isLogin ? " Inscrivez-vous" : " Connectez-vous"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login; 