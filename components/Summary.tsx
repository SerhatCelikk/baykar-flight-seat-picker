"Use client";
import React, { use, useEffect, useState } from 'react';

const Summary: React.FC<{ selectedSeats: number[]; pricePerSeat: number }> = ({
  selectedSeats,
  pricePerSeat,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    setTotalPrice(selectedSeats.length * pricePerSeat);
  }, [selectedSeats]);

  return (
    <div>
      <h3>Seçilen Koltuklar: {selectedSeats.join(', ')}</h3>
      <h3>Toplam Fiyat: {totalPrice} TL</h3>
    </div>
  );
};

export default Summary;
