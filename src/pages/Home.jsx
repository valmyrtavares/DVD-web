import styles from './styles/Home.module.scss';

export default function Home({ onPlayVideo, config }) {
  return (
    <div
      className={styles.home}
      style={{ backgroundImage: `url(${config.backgrounds.home})` }}
    >
      <div className={styles.overlay} onClick={onPlayVideo}>
        <h1 className={styles.clickableTitle}>{config.titulo}</h1>
        {config.subtitulo && <h2 className={styles.clickableTitle}>{config.subtitulo}</h2>}
      </div>
    </div>
  );
}
