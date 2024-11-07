import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import './signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [campus, setCampus] = useState('');
  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState('');
  const [branch, setBranch] = useState([]);
  const [brach, setBrach] = useState('');
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [batch, setBatch] = useState('');
  const [regno, setRegno] = useState('');
  let [rec, setRec] = useState('');
  let recc=false;


  const navigate = useNavigate();
  const name = localStorage.getItem('userName');
  useEffect(() => {
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      nav.classList.remove('responsive');
    }
    if (name === null) {
      navigate('/');
      return;
    }
  }, [name, navigate]);

  useEffect(() => {
    if (location.state && location.state.regno) {
      setRegno(location.state.regno);
    } else {
      console.error('User information not found in location state');
      navigate('/error');

    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (location.state && location.state.userName) {
      setUserName(location.state.userName);
    } else {
      console.error('User information not found in location state');
      navigate('/error');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (location.state && location.state.regno) {
      setBatch("20" + location.state.regno.substring(0, 2));
    } else {
      console.error('User information not found in location state');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      if (campus) {
        try {
          const querySnapshot = await getDocs(collection(db, campus.toLowerCase()));
          const schoolsData = querySnapshot.docs.map(doc => doc.id);
          setSchools(schoolsData);
        } catch (error) {
          console.error('Error fetching schools:', error);
        }
      }
    };

    fetchData();
  }, [campus]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (school) {
        try {
          const schoolDocRef = doc(db, campus.toLowerCase(), school);
          const schoolDocSnapshot = await getDoc(schoolDocRef);

          if (schoolDocSnapshot.exists()) {
            const branchesData = schoolDocSnapshot.data().branch || [];
            setBranch(branchesData);
          }
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      }
    };

    fetchBranches();
  }, [campus, school]);

  const handleSchoolChange = (event) => {
    const selectedSchool = event.target.value;
    setSchool(selectedSchool);
  };

  const handleBranchChange = (event) => {
    const selectedBranch = event.target.value;
    setBrach(selectedBranch);
  };

  const handleCampusChange = (event) => {
    const selectedCampus = event.target.value;
    setCampus(selectedCampus);
  };

  const handleSignup = async (event) => {
    event.preventDefault(); // Prevent form submission and page reload
    if (campus === '' || school === '' || brach === '') {
      alert('Please fill all the fields');
      return;
    }

    rec=rec.toUpperCase();

    if (rec !== '') {
      if(rec===regno){
        alert('You cannot refer yourself');
        return;
      }
      try {
        const recDocRef = doc(db, 'users', rec);
        const recDocSnap = await getDoc(recDocRef);
    
        if (!recDocSnap.exists()) {
          console.error('Invalid Referral');
          alert('Invalid Referral');
          return;
        }
        const currentPoints = recDocSnap.data().points;
        const updpoints = currentPoints + 50;
    
        await updateDoc(recDocRef, { points: updpoints });
        recc=true;
      } catch (error) {
        console.error('Error incrementing count:', error);
        console.error('Error adding referral:', error.message);
      }
    } 

    try {
      const countDocRef = doc(db, 'users', 'count');
      const countDocSnap = await getDoc(countDocRef);
      const currentCount = countDocSnap.data().users;
      await updateDoc(countDocRef, { users: currentCount + 1 });

    } catch (error) {
      console.error('Error incrementing count:', error);
    }

    try {
      const firstLoginTime = new Date().toLocaleDateString('en-GB') + " " + new Date().toLocaleTimeString();
      const currentDate = new Date().toLocaleDateString('en-GB');
      if(recc){
        await setDoc(doc(collection(db, "users"), regno), {
          name: userName.substring(0, userName.length - 10),
          batch: batch,
          campus: campus,
          school: school,
          branch: brach,
          sem: document.getElementById('sem').value,
          logins: 1,
          logintime: [firstLoginTime],
          points: 20,
          daily: currentDate,
          streak: 1,
          referral: rec,
        });
      }
      else{
        await setDoc(doc(collection(db, "users"), regno), {
          name: userName.substring(0, userName.length - 10),
          batch: batch,
          campus: campus,
          school: school,
          branch: brach,
          sem: document.getElementById('sem').value,
          logins: 1,
          logintime: [firstLoginTime],
          points: 0,
          daily: currentDate,
          streak: 1,
        });
      }
      
      navigate('/home', { state: { userName: userName.substring(0, userName.length - 10) } });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    
  };

  return (
    <div className='signup'>
      <div className="signupcont">
        <h2 className="signup-heading">Sign up</h2>
        <form action="" className="signup-form">
          <label htmlFor="name" className="form-label">Name:</label>
          <input id="name" type="text" value={userName.substring(0, userName.length - 10)} readOnly className="form-input" />

          <label htmlFor="batch" className="form-label">Batch:</label>
          <input id="batch" type="text" value={batch} readOnly className="form-input" />

          <label htmlFor="campus" className="form-label">Select Campus:</label>
          <select id="campus" name="campus" value={campus} onChange={handleCampusChange} required className="form-select">
            <option value="">Select your campus</option>
            <option value="Chennai">Chennai</option>
            <option value="Vellore">Vellore</option>
          </select>

          <label htmlFor="schools" className="form-label">Select School:</label>
          <select id="schools" required name="schools" onChange={handleSchoolChange} className="form-select">
            <option value="">Select your school</option>
            {schools.map((schoolId) => (
              <option key={schoolId} value={schoolId}>
                {schoolId}
              </option>
            ))}
          </select>

          <label htmlFor="branch" className="form-label">Select Branch:</label>
          <select id="branch" name="branch" className="form-select" required onChange={handleBranchChange}>
            <option value="">Select your branch</option>
            {branch.map((branchId) => (
              <option key={branchId} value={branchId}>
                {branchId}
              </option>
            ))}
          </select>

          <label htmlFor="sem" className="form-label">Semester:</label>
          <select name="sem" id="sem" className="form-select">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>

          <label htmlFor="rec" className="form-label">Refered by: <span className='bobs'>(Leave Empty if None)</span></label>
          <input id="rec" type="text" placeholder='Enter Regno' value={rec} onChange={(event) => setRec(event.target.value)} className="form-input" />

          <br />
          <button className="signup-button" onClick={handleSignup}>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
