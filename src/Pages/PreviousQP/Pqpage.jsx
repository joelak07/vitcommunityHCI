import React, { useState, useEffect } from 'react';
import './pqpage.css';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Paper from './Paper';
import { useNavigate } from 'react-router-dom';

const Pqpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subjectCode, setSubjectCode] = useState('');
  const [papers, setPapers] = useState([]);
  const [subjectName, setSubjectName] = useState('');

  const name = localStorage.getItem('userName');
  useEffect(() => {
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      nav.classList.remove('responsive');
    }
    if (name === null) {
      navigate('/');
    }
  }, [name, navigate]);

  useEffect(() => {
    if (location.state && location.state.subjectCode && location.state.subjectName) {
      setSubjectCode(location.state.subjectCode);
      setSubjectName(location.state.subjectName);
    } else {
      navigate('/');
      console.error('User information not found in location state');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const papersSnapshot = await getDocs(collection(db, subjectCode));
        const papersData = papersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(paper => paper.ispq === true); // Filter papers where ispq is true
        setPapers(papersData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchPapers();
  }, [subjectCode]);

  return (
    <div className='pqpage'>
      <div className='pageres'>
        <h2>Previous Question Papers for {subjectCode} {subjectName}</h2>
        {papers.length > 0 ? (
          <div className='pagelist'>
            {papers.map(paper => (
              <Paper key={paper.id} examtype={paper.ExamType} examcat={paper.ExamCategory} date={paper.ExamDate} faculty={paper.Faculty} slot={paper.Slot} download={paper.fileURL} time={paper.timestamp} student={paper.student} />
            ))}
          </div>
        ) : (
          <b>No papers uploaded for {subjectCode} {subjectName}.</b>
        )}
      </div>
    </div>
  );
};

export default Pqpage;
