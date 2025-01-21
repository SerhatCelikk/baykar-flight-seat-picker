import React from 'react';
import styles from '../styles/seat.module.css';

interface SeatProps {
  number: number;
  status: 'dolu' | 'bos' | 'secilen';
  userName?: string;
  onSelect: (seatNumber: number) => void;
}

const Seat: React.FC<SeatProps> = ({ number, status, userName, onSelect }) => {
  const handleClick = () => {
    if (status !== 'dolu') {
      onSelect(number);
    }
  };

  return (
    <div className={styles.tooltipContainer}>
      <div
        className={`${styles.seat} ${status === 'dolu'
            ? styles.occupied
            : status === 'secilen'
              ? styles.selected
              : ''
          }`}
        onClick={handleClick}
      >
        {/* {number} */}
      </div>
      {status === 'dolu' && userName && (
        <div className={styles.tooltip}>
          <p>{userName}</p>
        </div>
      )}
    </div>
  );
};

export default Seat;