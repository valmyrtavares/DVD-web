import React from 'react';
import styles from './styles/Chapters.module.scss';
import eventConfig from '../config/eventConfig';

export default function Chapters() {
    return (
        <div
            className={styles.chaptersPage}
            style={{ backgroundImage: `url(${eventConfig.backgrounds.capitulos})` }}
        >
            <div className={styles.overlay}>
                <h1>Capítulos</h1>
                <div className={styles.grid}>
                    {eventConfig.capitulos.map((cap, index) => (
                        <button key={index} className={styles.chapterBtn}>
                            <span className={styles.number}>{index + 1}</span>
                            <span className={styles.label}>{cap.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
