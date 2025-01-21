import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/modal.module.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  status: 'success' | 'error' | 'warning'; // Status için seçenekler
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, status, onClose }) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root'); // Modal hedef konteyner

  // Eğer modal-root yoksa hata atmadan çalışmayı engelle
  if (!modalRoot) {
    console.error('Modal root element not found!');
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles[status]}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Kapat
        </button>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
