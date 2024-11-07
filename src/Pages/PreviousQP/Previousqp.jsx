import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, setDoc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./previousqp.css";
import Prevqpclosed from "./Prevqpclosed";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";

const Previousqp = () => {
  const [coursecode, setCoursecode] = useState("");
  const [coursetitle, setCoursetitle] = useState("");
  const [examdate, setExamdate] = useState("");
  const [slot, setSlot] = useState("");
  const [examtype, setExamtype] = useState("CAT");
  const [examcategory, setExamcategory] = useState("Theory");
  const [file, setFile] = useState(null);
  const [faculty, setFaculty] = useState("");
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading
  const [showUploadForm, setShowUploadForm] = useState(false);


  const handleUploadClick = () => {
    setShowUploadForm(!showUploadForm);
  };

  const initialization = async (e) => {
    try {
      await setDoc(doc(collection(db, "prevqp"), coursecode), {
        subjectCode: coursecode,
        subjectName: coursetitle,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const navigate = useNavigate();
  const name = localStorage.getItem('userName');

  const auth=getAuth();
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
    const fetchPapers = async () => {
      try {
        const papersSnapshot = await getDocs(collection(db, 'prevqp'));
        const papersData = papersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPapers(papersData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchPapers();
  }, []);

  const handleSearch = () => {
    if (searchQuery === '') {
      setFilteredPapers(papers);
      return;
    }

    const filteredPapers = papers.filter(paper =>
      paper.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPapers(filteredPapers);
  };

  const handleSubmit = async (e) => {
    setLoading(true); // Set loading to true when the button is clicked
    initialization();
    e.preventDefault();

    if (!file) {
      console.error("File not selected");
      setLoading(false); // Set loading to false when there is an error
      return;
    }

    try {
      const storage = getStorage();
      const uniqueKey = new Date().toISOString();
      const storageRef = ref(storage, `files/${uniqueKey}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const Prevqp = collection(db, coursecode);
      const docRef = doc(Prevqp);

      await setDoc(docRef, {
        CourseCode: coursecode,
        CourseTitle: coursetitle,
        Faculty: faculty,
        ExamDate: examdate,
        Slot: slot,
        ExamType: examtype,
        ExamCategory: examcategory,
        fileURL: downloadURL,
        timestamp: new Date().toLocaleString(),
        ispq: true,
        student: auth.currentUser.displayName,
      });

      const userRef = doc(collection(db, 'users'), auth.currentUser.displayName.slice(-9));
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentPoints = userDoc.data().points || 0;
        const updatedPoints = currentPoints + 200;
        await updateDoc(userRef, { points: updatedPoints });  
      }

      alert("File uploaded successfully!");
      window.location.reload();

    } catch (error) {
      console.error("Error uploading notes:", error);
    } finally {
      setLoading(false); // Set loading to false after the upload is complete
    }
  };

  return (
    <div className="prevqp">
      <div className="upload">
        <div className="topuploadbox">
          <h2>Upload Previous Question Paper</h2>
          <button className="meleupload" onClick={handleUploadClick}>
            {showUploadForm ? 'Close' : 'Upload'}
          </button>
        </div>
        {showUploadForm && (
          <div className="uploadformres">
            <form onSubmit={handleSubmit}>
              <div className="formgroupp1">
                <div className="part">
                  <label>
                    <b>Course Code:</b>
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    placeholder="eg. BCSE101P"
                    onChange={(e) => setCoursecode(e.target.value)}
                    required
                  />
                </div>
                <div className="part">
                  <label>
                    <b>Course Title:</b></label>
                  <input
                    type="text"
                    name="courseTitle"
                    placeholder="eg. Network Theory"
                    onChange={(e) => setCoursetitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="formgroupp1">
                <div className="part">
                  <label>
                    <b>Faculty:</b></label>
                  <input
                    type="text"
                    name="faculty"
                    placeholder="eg. Dr Joe Root"
                    onChange={(e) => setFaculty(e.target.value)}
                    required
                  />

                </div>
                <div className="part">
                  <label>
                    <b>Exam Date:</b></label>
                  <input
                    type="date"
                    name="examDate"
                    onChange={(e) => setExamdate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="formgroupp1">
                <div className="part">
                  <label>
                    <b>Slot:</b> </label>
                  <input
                    type="text"
                    name="slot"
                    placeholder="eg. A1/B2"
                    onChange={(e) => setSlot(e.target.value)}
                    required
                  />
                </div>
                <div className="part">
                  <label>
                    <b>Exam Type:</b></label>
                  <select
                    name="examType"
                    onChange={(e) => setExamtype(e.target.value)}
                  >
                    <option disabled>Select Exam Type</option>
                    <option value="CAT">CAT</option>
                    <option value="FAT">FAT</option>
                    <option value="MAT">MAT</option>
                    <option value="PAT">PAT</option>
                  </select>
                </div>
              </div>
              <div className="formgroupp1">
                <div className="part">
                  <label>
                    <b>Exam Category:</b></label>
                  <select
                    name="examCategory"
                    onChange={(e) => setExamcategory(e.target.value)}
                  >
                    <option disabled>Select Exam Category</option>
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
                <div className="part">
                  <label htmlFor="file"><b>Upload File (PDF,ZIP):</b></label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="formgroup3">
                <button type="submit" disabled={loading} className="pqupload">
                  {loading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        )}
        
      </div>
      <div className="prevqpcont">
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
        <div className="respepe">
          {(filteredPapers.length > 0 ? filteredPapers : papers).map(paper => (
            <Prevqpclosed key={paper.id} coursecode={paper.subjectCode} papername={paper.subjectName} userName={name} />
          ))}
          {/* {papers.map(paper => (
            <Prevqpclosed key={paper.id} coursecode={paper.subjectCode} papername={paper.subjectName} userName={name} />
          ))} */}
        </div>

      </div>
    </div>
  );
};

export default Previousqp;
