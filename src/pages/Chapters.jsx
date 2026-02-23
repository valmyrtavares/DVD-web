import React from 'react';
import styles from './styles/Chapters.module.scss';

export default function Chapters({ onPlayChapter, config }) {
    const handleChapterClick = (start) => {
        // Para Vimeo usamos #t=Xs, para YouTube o VideoPlayer já converte para start=X
        // Para o player nativo (MP4), usaremos #t=X
        let chapterUrl = config.filmePrincipal.url;

        if (chapterUrl.includes('vimeo.com')) {
            chapterUrl = `${chapterUrl}#t=${start}s`;
        } else {
            chapterUrl = `${chapterUrl}#t=${start}`;
        }

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
