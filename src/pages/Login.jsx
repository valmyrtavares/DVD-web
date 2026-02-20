import React, { useState } from 'react';
import styles from './styles/Login.module.scss';

export default function Login({ onLogin, config }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === config.senha) {
            onLogin(password);
        } else {
            setError('Palavra de passe não é bem essa. Tente de novo.');
        }
    };

    return (
        <div
            className={styles.loginPage}
            style={{ backgroundImage: `url(${config.backgrounds?.login})` }}
        >
            <div className={styles.loginBox}>
                <div className={styles.logoContainer}>
                    <img
                        src={config.backgrounds?.login}
                        alt="Company Logo"
                        className={styles.logoImg}
                    />
                </div>
                <p>Por favor, digite a palavra de passe para acessar o conteúdo.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        autoFocus
                    />

                    {error && <span className={styles.error}>{error}</span>}

                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}
