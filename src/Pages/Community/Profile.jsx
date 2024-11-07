import React, { useState, useEffect } from "react";
import "./profile.css";
import { db } from "../../firebase";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import Post from "./Post";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [formData, setFormData] = useState("");
  const [sem, setSem] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fullName = localStorage.getItem('systemname');
  const regno = fullName.substring(fullName.length - 9);
  

  const check = localStorage.getItem('userName');
  if (check === null) {
    navigate('/login');
  }

  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", searchTerm.toUpperCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && searchTerm.toUpperCase() !== "count") {
      if (searchTerm.toUpperCase() === regno) {
        alert('You are already viewing your profile!');
        return;
      }
      navigate('/profileview', { state: { regno: searchTerm.toUpperCase() } });
    }
    else {
      alert('User does not exist!');
    }
  };




  useEffect(() => {
    const nav = document.getElementById("respNav");
    if (nav.classList.contains("responsive")) {
      nav.classList.remove("responsive");
    }

    const fetchPosts = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, "posts"));
        const postsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter posts by name
        const filteredPosts = postsData.filter(
          (post) => post.name === fullName
        );
        // Sort filteredPosts based on time in descending order
        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching and filtering posts:", error);
      }
    };

    fetchPosts();
  }, [fullName]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const ProfileDocRef = doc(db, "users", regno);
        const ProfileDocSnap = await getDoc(ProfileDocRef);
        const profileData = ProfileDocSnap.data();
        setFormData({ ...profileData, docID: ProfileDocSnap.id });
        setSem(profileData.sem); // Set the initial value for 'sem'
      } catch (err) {
        console.error(err);
      }
    };
    fetchFormData();
  }, [regno]);

  const handlesem = async (event) => {
    event.preventDefault();
    const newSem = event.target.value;
    setSem(newSem);
    try {
      const userDocRef = doc(collection(db, "users"), regno);
      await setDoc(userDocRef, {
        name: formData.name,
        batch: formData.batch,
        campus: formData.campus,
        school: formData.school,
        branch: formData.branch,
        logins: formData.logins,
        logintime: formData.logintime,
        sem: newSem,
      });
      alert("Semester updated successfully");
    } catch (e) {
      console.error("Error updating semester: ", e);
    }
  };

  return (
    <div className="profile">
      <div className="searchprof">
        <h2>Search User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Reg no.."
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="profdetails">
        <div className="leftprof">
          <h1>{formData.name}</h1>
          <h2>{formData.docID}</h2>
        </div>
        <div className="rightprof">
          <form id="editForm">
            <label htmlFor="school">School:</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              readOnly
            />

            <label htmlFor="branch">Branch:</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              readOnly
            />

            <label htmlFor="campus">Campus:</label>
            <input
              type="text"
              id="campus"
              name="campus"
              value={formData.campus}
              readOnly
            />

            <label htmlFor="batch">Batch:</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={formData.batch}
              readOnly
            />

            <label htmlFor="batch">Contribution Score:</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={formData.points}
              readOnly
            />

            <label htmlFor="sem">Semester:</label>
            <select name="sem" id="sem" value={sem} onChange={handlesem}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </form>
        </div>
      </div>
      <div className="respostuser">
        <h2>Your Posts</h2>
        <div className="myvoices">
          {posts.length === 0 ? (
            <h3>You haven't posed yet😔</h3>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                content={post.content}
                student={post.name}
                time={post.time}
                likes={post.likes}
                postId={post.id}
                dislikes={post.dislikes}
                fires={post.fires}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
