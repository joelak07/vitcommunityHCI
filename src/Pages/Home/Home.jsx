import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import './home.css';
import { getDoc, doc } from 'firebase/firestore';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import Point from '../Leaderboard/Point';
import Admin from './Admin';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [streak, SetStreak] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [users, setUsers] = useState(0);

  const name = localStorage.getItem('userName');
  const regno = localStorage.getItem('regno');

  const [quote, setQuote] = useState('');


  useEffect(() => {
    const fetchRandomQuote = async () => {
      try {
        const response = await axios.get('https://programming-quotes-api.herokuapp.com/quotes/random');

        const { content } = response.data;
        setQuote(`${content}`);
      } catch (error) {
        console.error('Error fetching random quote:', error);
      }
    };

    fetchRandomQuote();
  }, []);

  useEffect(() => {
    const fetchAdminMessages = async () => {
      try {
        const q = query(collection(db, 'admin'), orderBy('time', 'desc'));
        const querySnapshot = await getDocs(q);
        const adminMessages = [];
        querySnapshot.forEach((doc) => {
          adminMessages.push({ id: doc.id, ...doc.data() });
        });

        setAdmin(adminMessages);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };

    fetchAdminMessages();
  }, []);



  useEffect(() => {
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      nav.classList.remove('responsive');
    }
    if (name === null) {
      navigate('/');
    }

  }, [name, navigate]);


  const goToPreviousQP = () => {
    navigate('/previousqp', { state: { name } });
  };

  const goToCommunity = () => {
    navigate('/community', { state: { name } });
  };

  const navlead = () => {
    navigate('/leaderboard');
  }

  const goToNotes = () => {
    navigate('/notes', { state: { name } });
  };

  const goToFeedback = () => {
    navigate('/feedback');
  };

  useEffect(() => {
    const fetchUserStreak = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', regno));
        if (userDoc.exists()) {
          SetStreak(userDoc.data().streak);
          setUsers(userDoc.data().points);
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user streak:', error);
      }
    };

    fetchUserStreak();
  });

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(3));
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



  return (
    <div className="home-container">
      <div className="homecontent">
        <div className="tophead">
          <h2 className="user-greeting">Hello {name} 😊</h2>
          <div className='stuff'>
          <div className="streakbox">
                <h3>{streak}🔥</h3>
          </div>
          <div className="usersbox">
                <h3>{users}🪙</h3>
          </div>
          </div>
        </div>
        <div className="mainhome">
          <div className="leftmainhome">
            <div className="leftmaintop">
              <div className="quotebox">
                <h4>Quote of the day</h4>
                <p>"At the heart of every winter lies a spring waiting to bloom, and within every night, a dawn eager to rise. Life's most beautiful moments often wait just beyond the darkest hours."</p>
              </div>
            </div>
            <div className="albox">


              <div className="mainhomebot">
                <div className="comhome">
                  <span>Have a look at what your friends have to say and feel free to voice out your opinions</span>
                  <button className="button" onClick={goToCommunity}>Go to Community</button>
                </div>
                <div className="comhome">
                  <span>View and upload previous CAT, FAT Theory and lab papers here</span>
                  <button className="button" onClick={goToPreviousQP}>Go to Previous QP</button>
                </div>
                <div className="comhome">
                  <span>View and Upload study material and grow together</span>
                  <button className="button" onClick={goToNotes}>Resources</button>
                </div>
                <div className="comhome">
                  <span>Share your valuable Feedback here</span>
                  <button className="button" onClick={goToFeedback}>Feedback</button>
                </div>
                <div className="comhome" id='lead'>
                  <button className="button" onClick={navlead}>Leaderboard</button>
                </div>
              </div>
            </div>
          </div>

          <div className="home2">
            <div className="leadhome" onClick={navlead}>
              <h3>Leaderboard🏆</h3>
              <div className="leadhomelist">
                {topUsers.map((user, index) => (
                  <Point key={user.id} rank={index + 1} regno={user.id} name={user.name} score={user.points} screen="home" />
                ))}
              </div>
            </div>
            <div className="admin">
              <h3 className='admes'>Messages from Admin</h3>
              <div className="messlistad">
                {admin.map((messageData) => (
                  <Admin key={messageData.id} message={messageData.message} time={messageData.time} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
