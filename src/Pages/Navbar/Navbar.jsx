import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMinus, faUser, faSignOut, faEarthAmericas, faNoteSticky, faPen, faHourglass2, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isRootPath = location.pathname === '/home' || location.pathname === '/previousqp' || location.pathname === '/pqpage' || location.pathname === '/notes' || location.pathname === '/notespage' || location.pathname === '/community' || location.pathname === '/feedback' || location.pathname === '/profile' || location.pathname === '/profileview' || location.pathname === '/leaderboard';
  const name = localStorage.getItem('userName') || '';
  const isRestrictedPath = ['/previousqp', '/pqpage', '/notes', '/notespage', '/community', '/feedback', '/profile', '/profileview', '/leaderboard'].includes(location.pathname);
  const shouldDisplayButtons = isRestrictedPath;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      nav.classList.remove('responsive');
    }
    setIsMenuOpen(false);
    localStorage.removeItem('userName');
    localStorage.removeItem('systemname');
    localStorage.removeItem('regno');
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleNavigate = (path, state) => {
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      nav.classList.remove('responsive');
    }
    setIsMenuOpen(false);
    navigate(path, { state: { ...state, name } });
  };

  const closeNav = () => {
    const html = document.documentElement;
    const nav = document.getElementById('respNav');
    setIsMenuOpen(false);
    nav.classList.remove('responsive');
    html.removeEventListener('click', closeNavOnClick);
  }

  const closeNavOnClick = (event) => {
    const path = event.composedPath();
    if (path.some(elem => elem.id === 'respNav')) {
      return;
    }
    closeNav();
  }

  const handleResp = () => {
    const html = document.documentElement;
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      closeNav();
    }
    else {
      setIsMenuOpen(true);
      nav.classList.add('responsive');
      html.addEventListener('click', closeNavOnClick);
    }
  };

  return (
    <div className='Navbar' id="respNav">
      {!isHomePage && (
        <Link to="/home" className='momi'>
          <div className="leftnav">
            <h2>VIT</h2><span>Community</span>
          </div>
        </Link>
      )}
      {isHomePage && (
          <div className="leftnav">
            <h2>VIT</h2><span>Community</span>
          </div>
      )}
      <div className="rightnav">
        {shouldDisplayButtons && (
          <>
            {/* <button className='backbut' onClick={() => handleNavigate('/home')}><FontAwesomeIcon icon={faHome} className='navIcon' />Home</button> */}
            <button className='notesbut' onClick={() => handleNavigate('/home')}><FontAwesomeIcon icon={faTrophy} className='navIcon' />Home</button>
            <button className='paperbut' onClick={() => handleNavigate('/community')}><FontAwesomeIcon icon={faEarthAmericas} className='navIcon' />Community</button>
            <button className='paperbut' onClick={() => handleNavigate('/previousqp')}><FontAwesomeIcon icon={faHourglass2} className='navIcon' />Previous Papers</button>
            <button className='notesbut' onClick={() => handleNavigate('/notes')}><FontAwesomeIcon icon={faNoteSticky} className='navIcon' />Notes</button>
            <button className='paperbut' onClick={() => handleNavigate('/feedback')}><FontAwesomeIcon icon={faPen} className='navIcon' />Feedback</button>
            
          </>
        )}
        {isRootPath && (
          <>
            {/* <button className='notesbut' onClick={() => handleNavigate('/home')}><FontAwesomeIcon icon={faTrophy} className='navIcon' />Home</button> */}
            <button className='notesbut' onClick={() => handleNavigate('/leaderboard')}><FontAwesomeIcon icon={faTrophy} className='navIcon' />Leaderboard</button>
            <button className='paperbut' onClick={() => handleNavigate('/profile')}><FontAwesomeIcon icon={faUser} className='navIcon' />Profile</button>
            <button className='logoutbut' onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOut} className='navIcon' />Logout
            </button>

          </>
        )}
        {shouldDisplayButtons &&
          <button className='iconbut' id='iconbutcontent' onClick={handleResp}>
            <FontAwesomeIcon icon={isMenuOpen ? faMinus : faBars} className='navobut' />
          </button>
        }
      </div>
      {location.pathname === '/home' && (
        <div className='homeNav'>
          <button className='paperbut' onClick={() => handleNavigate('/profile', { name: 'YourStateValue' })}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className='logoutbut' onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} />
          </button>
        </div>
      )
      }
    </div>
  );
}

export default Navbar;
