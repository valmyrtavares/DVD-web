import React from 'react';
import styles from './styles/Chapters.module.scss';
import eventConfig from '../config/eventConfig';

export default function Chapters({ onPlayChapter }) {
    const handleChapterClick = (start) => {
        // Para o Vimeo, o timestamp é adicionado como #t=30s
        const chapterUrl = `${eventConfig.filmePrincipal.url}#t=${start}s`;
        onPlayChapter(chapterUrl);
    };

    return (
        <div
            className={styles.chaptersPage}
            style={{ backgroundImage: `url(${eventConfig.backgrounds.capitulos})` }}
        >
            <div className={styles.overlay}>
                <h1>Capítulos</h1>
                <div className={styles.grid}>
                    {eventConfig.capitulos.map((cap, index) => (
                        <button
                            key={index}
                            className={styles.chapterBtn}
                            onClick={() => handleChapterClick(cap.start)}
                        >
                            <span className={styles.number}>{index + 1}</span>
                            <span className={styles.label}>{cap.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
