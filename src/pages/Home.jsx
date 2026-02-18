import styles from './styles/Home.module.scss';
import eventConfig from '../config/eventConfig';

export default function Home({ onPlayVideo }) {
  return (
    <div
      className={styles.home}
      style={{ backgroundImage: `url(${eventConfig.backgrounds.home})` }}
    >
      <div className={styles.overlay} onClick={onPlayVideo}>
        <h1 className={styles.clickableTitle}>{eventConfig.titulo}</h1>
        {eventConfig.subtitulo && <h2 className={styles.clickableTitle}>{eventConfig.subtitulo}</h2>}
      </div>
    </div>
  );
}
