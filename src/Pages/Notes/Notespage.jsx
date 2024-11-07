import React, { useState, useEffect } from "react";
import "./notespage.css";
import { db } from '../../firebase';
import { collection, doc, setDoc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLocation } from "react-router-dom";
import Note from "./Note";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";

const Notespage = () => {
  const location = useLocation();
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [faculty, setFaculty] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem('userName');
  const auth=getAuth();

  
  useEffect(()=>{
    const nav = document.getElementById('respNav');
    if (nav.classList.contains('responsive')) {
      nav.classList.remove('responsive');
    }
    if(name===null){
      navigate('/');
      return;
    }
  },[name, navigate]);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesSnapshot = await getDocs(collection(db, subjectCode));
        const notesData = notesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(note => note.ispq === false); // Filter notes where ispq is false
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
  
    fetchNotes();
  }, [subjectCode]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("File not selected");
      return;
    }

    try {
      setLoading(true);
      const storage = getStorage();
      const uniqueKey = new Date().toISOString();
      const storageRef = ref(storage, `files/${uniqueKey}${file.name.endsWith('.zip') ? '.zip' : ''}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const NotesCollection = collection(db, subjectCode); // Assuming 'notes' is the collection name
      const docRef = doc(NotesCollection);

      await setDoc(docRef, {
        Module: module,
        CourseCode: subjectCode,
        Faculty: faculty,
        Description: description,
        fileURL: downloadURL,
        student: auth.currentUser.displayName,
        timestamp: new Date().toLocaleString(),
        ispq: false,
      });

      const userRef = doc(collection(db, 'users'), auth.currentUser.displayName.slice(-9));
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentPoints = userDoc.data().points || 0;
        const updatedPoints = currentPoints + 100;
        await updateDoc(userRef, { points: updatedPoints });
      }

      alert("Notes Added!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading notes:", error);
    }finally {
      setLoading(false); // Set loading back to false after the upload is complete or on error
    }
  };



  useEffect(() => {
    if (location.state && location.state.subjectCode && location.state.subjectName) {
      setSubjectCode(location.state.subjectCode);
      setSubjectName(location.state.subjectName);
    } else {
      console.error("User information not found in location state");
    }
  }, [location.state]);
  

  return (
    <div className="notespage">
      <div className="uploadnotescont">
        <h2>Upload Notes for {subjectName} {subjectCode}</h2>
        <div className="notesform">
          <form onSubmit={handleSubmit}>

          <div className="form-group">
              <label htmlFor="module">Module:</label>
              <input
                id="module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
                placeholder="eg. 1"
                type="number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="faculty">Faculty Name:</label>
              <input
                type="text"
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                required
                placeholder="Enter Faculty Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter Description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">Upload File(PDF,ZIP):</label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <div className="form-group">
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden waitstyle" style={{}}>Uploading...</span>
                </div>
              ) : (
                <button type="submit">Upload</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="noteslist">
      {notes.length > 0 ? (
        // Render notes if there are any
        notes.map((note) => (
          <Note
            key={note.id}
            faculty={note.Faculty}
            description={note.Description}
            download={note.fileURL}
            module={note.Module}
            student={note.student}
            time={note.timestamp}
          />
        ))
      ) : (
        // Display a message when no notes are available
        <b>No notes are uploaded for this Subject</b>
      )}
    </div>
    </div>
  );
};

export default Notespage;
