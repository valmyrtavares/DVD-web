import React from 'react';
import styles from './styles/Extras.module.scss';
import eventConfig from '../config/eventConfig';

export default function Extras({ onPlayExtra }) {
    return (
        <div
            className={styles.extrasPage}
            style={{ backgroundImage: `url(${eventConfig.backgrounds.extras})` }}
        >
            <div className={styles.overlay}>
                <h1>Extras</h1>

                <div className={styles.extrasList}>
                    {eventConfig.extras.map((extra, index) => (
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
