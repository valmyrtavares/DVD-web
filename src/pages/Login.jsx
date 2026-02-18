import React, { useState } from 'react';
import styles from './styles/Login.module.scss';
import eventConfig from '../config/eventConfig';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === eventConfig.senha) {
            onLogin(password);
        } else {
            setError('Palavra de passe não é bem essa. Tente de novo.');
        }
    };

    return (
        <div
            className={styles.loginPage}
            style={{ backgroundImage: `url(${eventConfig.backgrounds.login})` }}
        >
            <div className={styles.loginBox}>
                <h1>{eventConfig.titulo}</h1>
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
