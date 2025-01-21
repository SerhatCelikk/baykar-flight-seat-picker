import React, { useState, useEffect } from 'react';
import Seat from './Seat';
import styles from '../styles/seat.module.css';
import axios from 'axios';
import Modal from './Modal';
import AfkWarning from './AfkWarning';

interface SeatsGridProps {
  selectedSeats: number[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<number[]>>;
}

type UserType = {
  id: number;
  name: string;
};

type SeatType = {
  number: number;
  status: string;
  userId?: number;
};

type ModalMessageType = {
  title: string;
  message: string;
  status: 'success' | 'error' | 'warning';
};

const SeatsGrid: React.FC<SeatsGridProps> = ({
  selectedSeats,
  setSelectedSeats,
}) => {
  const [seats, setSeats] = useState<SeatType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [lastInteraction, setLastInteraction] = useState<number | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<ModalMessageType>({ title: '', message: '', status: 'success' as 'success' | 'error' | 'warning' });
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);

  const handleContinue = () => {
    setIsWarningOpen(false);
    setLastInteraction(Date.now());
  };

  const handleCancel = () => {
    setIsWarningOpen(false);
    localStorage.removeItem('seats');
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('totalPrice');
    window.location.reload();
  };


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedSeats = localStorage.getItem('seats');
      setSeats(
        savedSeats
          ? JSON.parse(savedSeats)
          : Array.from({ length: 76 }, (_, i) => ({
            number: i + 1,
            status: i < 10 ? 'dolu' : 'bos',
            userId: i < 10 ? i + 1 : undefined,
          }))
      );
      const savedSelectedSeats = localStorage.getItem('selectedSeats');
      setSelectedSeats(savedSelectedSeats ? JSON.parse(savedSelectedSeats) : []);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
        setUsers(response.data.map((user: UserType) => ({
                  id: user.id,
                  name: user.name,
                })));
      });
    }
  }, [isClient]);

  const updateLocalStorage = () => {
    if (isClient) {
      localStorage.setItem('seats', JSON.stringify(seats));
      localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
      localStorage.setItem('totalPrice', JSON.stringify(selectedSeats.length * 1000));
    }
  };

  useEffect(() => {
    if (isClient) {
      updateLocalStorage();
    }
  }, [seats, selectedSeats, isClient]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (lastInteraction && Date.now() - lastInteraction > 30000) {
        setIsWarningOpen(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastInteraction]);

  const handleSelect = (seatNumber: number) => {
    setLastInteraction(Date.now());

    if (selectedSeats.length >= 3 && !selectedSeats.includes(seatNumber)) {
      setModalMessage({
        title: 'Hata',
        message: 'En fazla 3 koltuk seçebilirsiniz.',
        status: 'error',
      });
      setIsModalOpen(true);
      return;
    }

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.number === seatNumber
          ? { ...seat, status: seat.status === 'bos' ? 'secilen' : 'bos' }
          : seat
      )
    );

    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatNumber)
        ? prevSelectedSeats.filter((num) => num !== seatNumber)
        : [...prevSelectedSeats, seatNumber]
    );
  };

  return (
    <div className={styles.seatGridContainer}>
      <div className={styles.grid}>
        {seats.map((seat) => (
          <Seat
            key={seat.number}
            number={seat.number}
            status={seat.status as 'dolu' | 'bos' | 'secilen'}
            userName={seat.userId ? users[seat.userId - 1]?.name : undefined}
            onSelect={handleSelect}
          />
        ))}
      </div>
      {/* show which is full which selected and whic free color seat */}
      <div className={styles.seatInfo}>
        <div className={styles.seatInfoItem}>
          <div className={`${styles.seat} ${styles.occupied}`} />
          <span>Dolu</span>
        </div>
        <div className={styles.seatInfoItem}>
          <div className={`${styles.seat} ${styles.selected}`} />
          <span>Seçili</span>
        </div>
        <div className={styles.seatInfoItem}>
          <div className={styles.seat} />
          <span>Boş</span>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title={modalMessage.title}
        message={modalMessage.message}
        status={modalMessage.status}
        onClose={() => setIsModalOpen(false)}
      />
      <AfkWarning
        isOpen={isWarningOpen}
        timeout={30000}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SeatsGrid;