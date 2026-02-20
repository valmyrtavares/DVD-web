import React from 'react';
import styles from './styles/Footer.module.scss';

export default function Footer({ config }) {
    if (!config) return null;

    const companyName = config.companyName || 'Sua Empresa';
    const companyUrl = config.companyUrl || '#';
    const instagramUrl = config.instagramUrl;
    const formatPhone = (num) => {
        if (!num) return '';
        const clean = num.replace(/\D/g, '');
        if (clean.length === 11) {
            return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
        }
        return num; // Se for diferente de 11 dígitos, retorna como está
    };

    const phone = formatPhone(config.phone || '11933333333');

    return (
        <footer className={styles.footer}>
            <div className={styles.left}>
                <a href={companyUrl} target="_blank" rel="noopener noreferrer" className={styles.companyLink}>
                    <span className={styles.companyName}>{companyName}</span>
                </a>

                {instagramUrl && (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                            <path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M18,5.75A1.25,1.25 0 1,0 19.25,7A1.25,1.25 0 0,0 18,5.75Z" />
                        </svg>
                    </a>
                )}
            </div>
            <div className={styles.right}>
                <span className={styles.contactText}>
                    <span className={styles.contactLabel}>Contato:</span>
                    <span className={styles.contactNumber}>{phone}</span>
                </span>
            </div>
        </footer>
    );
}
