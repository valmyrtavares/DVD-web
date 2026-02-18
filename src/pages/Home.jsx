import styles from './styles/Home.module.scss';
import eventConfig from '../config/eventConfig';

export default function Home() {
  return (
    <div
      className={styles.home}
      style={{ backgroundImage: `url(${eventConfig.backgrounds.home})` }}
    >
      <div className={styles.overlay}>
        <h1>{eventConfig.titulo}</h1>
        {eventConfig.subtitulo && <h2>{eventConfig.subtitulo}</h2>}
      </div>
    </div>
  );
}
