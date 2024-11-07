import React from "react";
import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Post from "./Post";
const Profileview = () => {
  const [formData, setFormData] = useState("");
  const [posts, setPosts] = useState([]);
  const [regno, setRegno] = useState("");
  const location = useLocation();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const check = localStorage.getItem('userName');
  if (check === null) {
    navigate('/login');
  }

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
        const filteredPosts = postsData.filter((post) => post.name === name);
        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching and filtering posts:", error);
      }
    };

    fetchPosts();
  }, [name]);

  useEffect(() => {
    if (location.state && location.state.regno) {
      setRegno(location.state.regno);
    } else {
      console.error("User information not found in location state");
    }
  }, [location.state]);

  // ...

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const ProfileDocRef = doc(db, "users", regno);
        const ProfileDocSnap = await getDoc(ProfileDocRef);
        const profileData = ProfileDocSnap.data();
        setFormData({ ...profileData, docID: ProfileDocSnap.id });
        setName((prevName) => profileData.name + " " + regno); // Use functional update to avoid the dependency warning
      } catch (err) {
        console.error(err);
      }
    };

    fetchFormData();
  }, [regno, formData.name]);

  const checkregno = localStorage.getItem('regno');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", searchTerm.toUpperCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (searchTerm.toUpperCase() === checkregno) {
        navigate('/profile');
      }
      else {
        navigate('/profileview', { state: { regno: searchTerm.toUpperCase() } });
      }

    }
    else {
      alert('User does not exist!');
    }
  };

  return (
    <div className="profile">
      <div className="searchprof">
        <h2>Search User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter regno.."
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
            <input name="sem" id="sem" value={formData.sem} readOnly />
          </form>
        </div>
      </div>
      <div className="respostuser">
        <h2>Posts</h2>
        <div className="myvoices">
          {posts.length === 0 ? (
            <h3>User hasn't posted yet</h3>
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

export default Profileview;
