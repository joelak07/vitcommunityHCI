import React from 'react';
import './subjectobj.css';
import { useNavigate } from 'react-router-dom';

const SubjectObj = ({ subjectCode, subjectName }) => {
  const navigate = useNavigate();
    const handleClick = () => {
      navigate('/notespage', { state: {subjectCode:subjectCode, subjectName:subjectName} });
    };
  return (
    <div className='subjectobj' onClick={handleClick}>
      <h2>{subjectName}</h2>
      <h3>{subjectCode}</h3>
    </div>
  );
};

export default SubjectObj;
