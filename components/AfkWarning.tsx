import React, { useEffect, useState } from 'react';
import styles from '../styles/afkWarning.module.css';

interface AfkWarningProps {
  isOpen: boolean;
  onContinue: () => void; // İşlemi devam ettirme
  onCancel: () => void; // İşlemi iptal etme
  timeout: number; // Süre (ms cinsinden)
}

const AfkWarning: React.FC<AfkWarningProps> = ({ isOpen, onContinue, onCancel, timeout }) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeout / 1000); // Kalan süre (saniye)

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCancel(); // Süre dolduğunda işlem iptal edilir
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>İşleme devam etmek istiyor musunuz?</h2>
        <p className={styles.message}>
          Kalan Süre: <strong>{timeLeft} saniye</strong>
        </p>
        <div className={styles.buttons}>
          <button onClick={onContinue} className={styles.continueButton}>
            Evet
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfkWarning;
