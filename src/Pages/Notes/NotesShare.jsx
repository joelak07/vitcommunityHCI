import React, { useState, useEffect } from "react";
import "./notesshare.css";
import { db } from "../../firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import SubjectObj from "./SubjectObj";

import { useNavigate } from 'react-router-dom';


const NotesShare = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const name = localStorage.getItem('userName');
  useEffect(()=>{
    if(name===null){
      const nav = document.getElementById('respNav');
      if (nav.classList.contains('responsive')) {
        nav.classList.remove('responsive');
      }
      navigate('/');
      return;
    }
  },[name, navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
        const subjectsData = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleSearch = () => {
    if (searchQuery === '') {
      setFilteredSubjects(subjects);
      return;
    }
    const filteredSubjects = subjects.filter(subject =>
      subject.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubjects(filteredSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(collection(db, "subjects"), subjectCode), {
        subjectCode: subjectCode,
        subjectName: subjectName,
      });
      setSubjectCode('');
      setSubjectName('');
      alert("Subject Added")
      window.location.reload()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="notes">
      <div className="uploadnotes">
      <h2>Add Subject</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subjectCode">Subject Code:</label>
            <input
              type="text"
              id="subjectCode"
              placeholder="eg. BCSE101P"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subjectName">Subject Name:</label>
            <input
              type="text"
              id="subjectName"
              placeholder="eg. Network Theory"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>
          <button type="submit">Add Subject</button>
        </form>
      </div>
      <div className="notesrescont">
        <div className="searchcont">
          <div className="notessearchbar">
            <input
              type="text"
              placeholder="Search Subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <br />

        <div className="notesres">
          {(filteredSubjects.length > 0 ? filteredSubjects : subjects).map(subject => (
            <SubjectObj
              key={subject.id}
              subjectCode={subject.subjectCode}
              subjectName={subject.subjectName}
              // userName={name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesShare;
