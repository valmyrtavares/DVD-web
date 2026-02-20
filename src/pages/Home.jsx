import styles from './styles/Home.module.scss';

export default function Home({ onPlayVideo, config }) {
  return (
    <div
      className={styles.home}
      style={{ backgroundImage: `url(${config.backgrounds.home})` }}
    >
      <div className={styles.overlay} onClick={onPlayVideo}>
        <div className={styles.content}>
          <h1 className={styles.clickableTitle}>{config.titulo}</h1>
          {config.subtitulo && <h2 className={styles.clickableTitle}>{config.subtitulo}</h2>}
          <div className={styles.playButton}>
            <svg viewBox="0 0 24 24" className={styles.playIcon}>
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <span className={styles.playText}>Assistir ao Filme</span>
          </div>
        </div>
      </div>
    </div>
  );
}
