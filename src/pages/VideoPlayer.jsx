import React, { useEffect, useRef } from 'react';
import styles from './styles/VideoPlayer.module.scss';
import eventConfig from '../config/eventConfig';

export default function VideoPlayer({ videoUrl, onClose }) {
    const videoRef = useRef(null);

    const isDirectVideo = (url) => {
        return url.includes('.mp4') ||
            url.includes('.webm') ||
            url.includes('.ogg') ||
            url.includes('drive.google.com/uc') ||
            url.includes('raw.githubusercontent.com') ||
            url.endsWith('.mov');
    };

    const getFinalUrl = (url) => {
        if (!url) return '';

        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        const isVimeo = url.includes('vimeo.com');
        const isGoogleDrive = url.includes('drive.google.com');

        let finalUrl = url;

        if (isYouTube) {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}autoplay=1&rel=0&playsinline=1&mute=0`;

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
        } else if (isGoogleDrive) {
            // Reverter para o preview estável do Google Drive
            if (url.includes('/view')) {
                finalUrl = url.replace('/view', '/preview');
            } else if (url.includes('/file/d/')) {
                const fileId = url.split('/file/d/')[1].split('/')[0];
                finalUrl = `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }

        return finalUrl;
    };

    const handleVideoPlay = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => {
                console.log("Autoplay block detected, trying muted...", e);
                if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.play();
                }
            });
        }
    };

    useEffect(() => {
        if (isDirectVideo(videoUrl) && videoRef.current) {
            // Configurar timestamp
            if (videoUrl.includes('#t=')) {
                const timeStr = videoUrl.split('#t=')[1].replace('s', '');
                const time = parseFloat(timeStr);
                if (!isNaN(time)) {
                    videoRef.current.currentTime = time;
                }
            }
            handleVideoPlay();
        }
    }, [videoUrl]);

    return (
        <div className={styles.videoOverlay}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar vídeo">
                ✕
            </button>

            <div className={styles.videoContainer}>
                {isDirectVideo(videoUrl) ? (
                    <video
                        ref={videoRef}
                        src={getFinalUrl(videoUrl)}
                        controls
                        autoPlay
                        playsInline
                        className={styles.directVideo}
                        onCanPlay={handleVideoPlay}
                        onLoadedData={handleVideoPlay}
                    />
                ) : (
                    <iframe
                        src={getFinalUrl(videoUrl)}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Vídeo"
                    ></iframe>
                )}
            </div>

            <div className={styles.rotateHint}>
                <div className={styles.phoneIcon}>📱</div>
                <p>Gire o celular para ver em tela cheia</p>
            </div>
        </div>
    );
}
