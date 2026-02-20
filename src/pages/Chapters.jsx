import React from 'react';
import styles from './styles/Chapters.module.scss';

export default function Chapters({ onPlayChapter, config }) {
    const handleChapterClick = (start) => {
        // Para o Vimeo, o timestamp é adicionado como #t=30s
        const chapterUrl = `${config.filmePrincipal.url}#t=${start}s`;
        onPlayChapter(chapterUrl);
    };

    return (
        <div
            className={styles.chaptersPage}
            style={{ backgroundImage: `url(${config.backgrounds.capitulos})` }}
        >
            <div className={styles.overlay}>
                <h1>Capítulos</h1>
                <div className={styles.grid}>
                    {config.capitulos.map((cap, index) => (
                        <button
                            key={index}
                            className={styles.chapterBtn}
                            onClick={() => handleChapterClick(cap.start)}
                        >
                            <div className={styles.btnContent}>
                                <span className={styles.number}>{index + 1}</span>
                                <span className={styles.label}>{cap.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
