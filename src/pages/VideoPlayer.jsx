import React from 'react';
import styles from './styles/VideoPlayer.module.scss';
import eventConfig from '../config/eventConfig';

export default function VideoPlayer({ videoUrl, onClose }) {
    return (
        <div className={styles.videoOverlay}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar vídeo">
                ✕
            </button>

            <div className={styles.videoContainer}>
                <iframe
                    src={videoUrl.includes('#')
                        ? videoUrl.replace('#', `&autoplay=1&playsinline=1#`)
                        : `${videoUrl}&autoplay=1&playsinline=1`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Vídeo Principal"
                ></iframe>
            </div>

            <div className={styles.rotateHint}>
                <div className={styles.phoneIcon}>📱</div>
                <p>Gire o celular para ver em tela cheia</p>
            </div>
        </div>
    );
}
