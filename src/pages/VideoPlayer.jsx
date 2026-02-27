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

        let finalUrl = url;
        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        const isVimeo = url.includes('vimeo.com');
        const isGoogleDrive = url.includes('drive.google.com');

        if (isYouTube) {
            let videoId = '';
            if (url.includes('v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
            } else if (url.includes('/embed/')) {
                videoId = url.split('/embed/')[1].split(/[?#]/)[0];
            }

            if (videoId) {
                finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1`;
                if (url.includes('#t=') || url.includes('&t=')) {
                    const timeMatch = url.match(/[#&]t=(\d+)/);
                    if (timeMatch) finalUrl += `&start=${timeMatch[1]}`;
                }
            }
        } else if (isVimeo) {
            let videoId = '';
            const vimeoRegex = /(?:vimeo\.com\/)(?:channels\/[^\/]+\/|groups\/[^\/]+\/album\/[^\/]+\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
            const match = url.match(vimeoRegex);
            if (match) {
                videoId = match[1];
            } else if (url.includes('/video/')) {
                videoId = url.split('/video/')[1].split(/[?#]/)[0];
            }

            if (videoId) {
                finalUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=0&autopause=0&playsinline=1`;
                if (url.includes('#t=')) {
                    const time = url.split('#t=')[1];
                    finalUrl += `#t=${time}`;
                }
            }
        } else if (isGoogleDrive) {
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
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Autoplay block detected, trying muted...", e);
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.play();
                    }
                });
            }
        }
    };

    useEffect(() => {
        if (isDirectVideo(videoUrl) && videoRef.current) {
            const videoElement = videoRef.current;

            // Forçar reload do vídeo para trocar de fonte corretamente sem remount
            videoElement.load();

            // Configurar timestamp
            if (videoUrl.includes('#t=')) {
                const timeStr = videoUrl.split('#t=')[1].replace('s', '');
                const time = parseFloat(timeStr);

                const onMetadataLoaded = () => {
                    if (!isNaN(time)) {
                        videoElement.currentTime = time;
                    }
                    handleVideoPlay();
                    videoElement.removeEventListener('loadedmetadata', onMetadataLoaded);
                };

                if (videoElement.readyState >= 1) { // HAVE_METADATA
                    onMetadataLoaded();
                } else {
                    videoElement.addEventListener('loadedmetadata', onMetadataLoaded);
                }
            } else {
                handleVideoPlay();
            }
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
                        src={videoUrl.split('#t=')[0]} // Usar a URL pura para o src
                        controls
                        autoPlay
                        playsInline
                        className={styles.directVideo}
                    />
                ) : (
                    <iframe
                        src={getFinalUrl(videoUrl)}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope;"
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
