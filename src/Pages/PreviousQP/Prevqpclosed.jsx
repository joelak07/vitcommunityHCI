import React from 'react';
import '../Notes/subjectobj.css';
import { useNavigate } from 'react-router-dom';

const Prevqpclosed = ({ coursecode, papername}) => {
  const navigate = useNavigate();
  const handleClick = () => {
     navigate('/pqpage', { state: { subjectCode: coursecode, subjectName:papername } });
  };
  return (
    <div className='subjectobj' onClick={handleClick}>
      <h2>{papername}</h2>
      <h3>{coursecode}</h3>
    </div>
  );

}

export default Prevqpclosed