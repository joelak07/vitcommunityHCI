import React from 'react'
import { doc, updateDoc, increment } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase";
import profile from '../../Assets/profile.jpeg';

import './post.css'
const Post = ({ student, content, likes, time, postId,dislikes,fires }) => {
    const [like, setLike] = useState(likes);
    const [dislike, setDislike] = useState(dislikes);   
    const [fire, setFire] = useState(fires);
    
    const handlelike = () => {
        const docRef = doc(db, "posts", postId);
        updateDoc(docRef, {
            likes: increment(1)
        });
        setLike(like + 1);
    }

    const handledislike = () => {
        const docRef = doc(db, "posts", postId);
        updateDoc(docRef, {
            dislikes: increment(1)
        });
        setDislike(dislike + 1);
    }

    const handleFire = () => {
        const docRef = doc(db, "posts", postId);
        updateDoc(docRef, {
            fires: increment(1)
        });
        setFire(fire + 1);
    }

    return (
        <div className='post'>
            <div className='imgClass'><img src={profile} alt="profile" class="profileImg" /></div>
            <div className='contClass'>
            <div className="namepost">
                <p className='studname'>{student}</p>
                <div className="datetime">
                    <p>{time}</p>
                </div>
            </div>
            <div className="postcont">
                <p>{content}</p>
            </div>
            <div className="likes">
                <button onClick={handlelike}>❤️</button><p>{like}</p>
                <button onClick={handledislike}>👎</button><p>{dislike}</p>
                <button onClick={handleFire}>🔥</button><p>{fire}</p>   
            </div>
            </div>
        </div>
    )
}

export default Post