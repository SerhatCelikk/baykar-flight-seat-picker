import React, { useState, useEffect } from 'react';
import Seat from './Seat';
import styles from '../styles/seat.module.css';
import axios from 'axios';

interface SeatsGridProps {
  selectedSeats: number[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<number[]>>;
}

const SeatsGrid: React.FC<SeatsGridProps> = ({
  selectedSeats,
  setSelectedSeats,
}) => {
  const [seats, setSeats] = useState<{ number: number; status: string; userId?: number }[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [lastInteraction, setLastInteraction] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

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
        setUsers(response.data);
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
        if (window.confirm('İşleme devam etmek istiyor musunuz?')) {
          setLastInteraction(Date.now());
        } else {
          localStorage.removeItem('seats');
          localStorage.removeItem('selectedSeats');
          localStorage.removeItem('totalPrice');
          window.location.reload();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastInteraction]);

  const handleSelect = (seatNumber: number) => {
    setLastInteraction(Date.now());

    if (selectedSeats.length >= 3 && !selectedSeats.includes(seatNumber)) {
      alert('En fazla 3 koltuk seçebilirsiniz.');
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

  const totalPrice = selectedSeats.length * 1000;

  return (
    <div className='w-full flex flex-col gap-4 relative'>
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
            <div className='flex justify-center mt-12 gap-4'>
        <div className='flex flex-col items-center gap-2'>
          <div className={`${styles.seat} ${styles.occupied}`} />
          <span>Dolu</span>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className={`${styles.seat} ${styles.selected}`} />
          <span>Seçili</span>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className={styles.seat} />
          <span>Boş</span>
        </div>
        </div>
      {/* <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>Toplam Fiyat: {totalPrice} TL</h3>
        <button
          onClick={() => {
            alert('İşlem başarıyla tamamlandı!');
            localStorage.removeItem('seats');
            localStorage.removeItem('selectedSeats');
            localStorage.removeItem('totalPrice');
            window.location.reload();
          }}
        >
          Onayla
        </button>
      </div> */}
    </div>
  );
};

export default SeatsGrid;