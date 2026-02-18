import React from 'react';
import styles from './styles/Extras.module.scss';
import eventConfig from '../config/eventConfig';

export default function Extras() {
    return (
        <div
            className={styles.extrasPage}
            style={{ backgroundImage: `url(${eventConfig.backgrounds.extras})` }}
        >
            <div className={styles.overlay}>
                <h1>Extras</h1>

                <div className={styles.content}>
                    <div className={styles.playerPlaceholder}>
                        <div className={styles.aspectRatio}>
                            {/* Simulação de Player */}
                            <div className={styles.videoMock}>
                                <span>Video Player Mock</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.extrasList}>
                        {eventConfig.extras.map((extra, index) => (
                            <button key={index} className={styles.extraLink}>
                                {extra.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
