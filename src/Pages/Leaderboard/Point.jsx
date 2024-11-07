import React from 'react';
import './leader.css';

const Point = ({ rank, regno, name, score, screen }) => {
  let backgroundColor;
  let fontSize;
  if(screen==='home'){
    fontSize = '0.6rem';
  }
  switch (rank) {
    case 1:
      backgroundColor = '#FFD700';
      break;
    case 2:
      backgroundColor = '#C0C0C0';
      break;
    case 3:
      backgroundColor = '#FF5733';
      break;
    default:
      backgroundColor = 'white'; 
      break;
  }

  return (
    <div className='point' style={{ backgroundColor}}>
      <div className="pbox" style={{fontSize}}>
        <h3>{rank}</h3>
      </div>
      <div className="pbox" style={{fontSize}}>
        <h3>{regno}</h3>
      </div>
      <div className="pbox" style={{fontSize}}>
        <h3>{name}</h3>
      </div>
      <div className="pbox" style={{fontSize}}>
        <h3>{score}</h3>
      </div>
    </div>
  );
};

export default Point;
