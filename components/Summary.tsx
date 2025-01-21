import React, { useEffect, useState } from 'react';
import styles from '../styles/summary.module.css';

const Summary: React.FC<{ selectedSeats: number[]; pricePerSeat: number }> = ({
  selectedSeats,
  pricePerSeat,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    setTotalPrice(selectedSeats.length * pricePerSeat);
  }, [selectedSeats, pricePerSeat]);

  return (
    <div className={styles.summaryContainer}>
    <div className={styles.summaryBox}>
      <div className={styles.seatsContainer}>
        {selectedSeats.map((seat) => (
          <div key={seat} className={styles.seatBox}>
            {seat}
          </div>
        ))}
      </div>
      <div className={styles.priceContainer}>
        <div className={styles.priceUpperSide}><span>{selectedSeats.length}x</span>
        <div className={styles.seatBox}></div>
        </div>
        <h3 className={styles.totalPrice}>{totalPrice.toLocaleString()} ₺</h3>
      </div>
    </div>
    </div>
  );
};

export default Summary;
