import React, { useState, useEffect } from 'react';
import './leader.css';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import Point from './Point';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Leader = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const name = localStorage.getItem('userName');
  const navigate = useNavigate();
  if(name===null){
    navigate('/');
  }

  

    

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);

        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });

        setTopUsers(users);
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchTopUsers();
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='leaderboard'>
      <div className="ledtop">
        <h1>Leaderboard🏆</h1>
        <button onClick={openModal}><FontAwesomeIcon icon={faInfo} /></button>
      </div>

      <div className="leaders">
        <div className="headerlead">
          <div className="pbox">
            <h3>Rank</h3>
          </div>
          <div className="pbox">
            <h3>Reg No</h3>
          </div>
          <div className="pbox">
            <h3>Name</h3>
          </div>
          <div className="pbox">
            <h3>Score</h3>
          </div>
        </div>
        <div className="leaderslist">
          {topUsers.map((user, index) => (
            <Point key={user.id} rank={index + 1} regno={user.id} name={user.name} score={user.points} />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="overlay">
          <div className="modal">
            <span className="close" onClick={closeModal} style={{fontSize:"4rem"}}>&times;</span>
            <h3>Previous QP Upload: 200 Points</h3>
            <h3>Notes Upload: 100 Points</h3>
            <h3>Community Post: 25 Points</h3>
            <h3>Daily Log in: 3 Points</h3>
            <h3>5 Day Streak: 20 Points</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leader;
