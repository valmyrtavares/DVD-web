import React from 'react';
import styles from './styles/VideoPlayer.module.scss';
import eventConfig from '../config/eventConfig';

export default function VideoPlayer({ videoUrl, onClose }) {
    const getEmbedUrl = (url) => {
        if (!url) return '';

        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        const isVimeo = url.includes('vimeo.com');

        let finalUrl = url;

        if (isYouTube) {
            // Se já tiver parâmetros, usamos &, senão ?
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}autoplay=1&rel=0&playsinline=1`;

            // Converter #t= para start= (caso venha de capítulos configurados para Vimeo)
            if (finalUrl.includes('#t=')) {
                const seconds = finalUrl.split('#t=')[1].replace('s', '');
                finalUrl = finalUrl.split('#t=')[0].replace(/[?&]start=\d+/, '') + `${finalUrl.includes('?') ? '&' : '?'}start=${seconds}`;
            }
        } else if (isVimeo) {
            if (finalUrl.includes('#')) {
                finalUrl = finalUrl.replace('#', `?autoplay=1&playsinline=1#`);
            } else {
                const separator = finalUrl.includes('?') ? '&' : '?';
                finalUrl = `${finalUrl}${separator}autoplay=1&playsinline=1`;
            }
        }

        return finalUrl;
    };

    return (
        <div className={styles.videoOverlay}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar vídeo">
                ✕
            </button>

            <div className={styles.videoContainer}>
                <iframe
                    src={getEmbedUrl(videoUrl)}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Vídeo"
                ></iframe>
            </div>

            <div className={styles.rotateHint}>
                <div className={styles.phoneIcon}>📱</div>
                <p>Gire o celular para ver em tela cheia</p>
            </div>
        </div>
    );
}
