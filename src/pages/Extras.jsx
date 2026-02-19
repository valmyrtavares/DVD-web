import React from 'react';
import styles from './styles/Extras.module.scss';

export default function Extras({ onPlayExtra, config }) {
    return (
        <div
            className={styles.extrasPage}
            style={{ backgroundImage: `url(${config.backgrounds.extras})` }}
        >
            <div className={styles.overlay}>
                <h1>Extras</h1>

                <div className={styles.extrasList}>
                    {config.extras.map((extra, index) => (
                        <button
                            key={index}
                            className={styles.extraLink}
                            onClick={() => onPlayExtra(extra.url)}
                        >
                            {extra.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
