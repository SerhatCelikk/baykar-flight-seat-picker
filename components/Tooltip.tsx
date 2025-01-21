
import React from 'react';

interface TooltipProps {
  user: { name: string; email: string };
}

const Tooltip: React.FC<TooltipProps> = ({ user }) => {
  return (
    <div 
    className='absolute bg-white border p-2 z-10'
    style={{
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid black',
      padding: '5px',
      zIndex: 10,
    }}>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Tooltip;