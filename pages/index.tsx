import React, { useState } from 'react';
import SeatsGrid from '../components/SeatsGrid';
import Form from '../components/Form';
import Summary from '../components/Summary';


const IndexPage: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  return (
    <div className='w-full flex mx-auto max-md:flex-wrap justify-center'>
      <SeatsGrid selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats}/>
      <div className='w-full flex flex-col gap-4'>
        <Form 
          selectedSeats={selectedSeats} 
          pricePerSeat={1000} 
        />
        <Summary selectedSeats={selectedSeats} pricePerSeat={1000} />
      </div>
    </div>
  );
};

export default IndexPage;