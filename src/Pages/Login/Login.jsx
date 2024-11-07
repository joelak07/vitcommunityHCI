import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import GoogleButton from 'react-google-button';
import { auth, provider, db } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, updateDoc, increment, arrayUnion, collection } from "firebase/firestore";
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const nav = document.getElementById('respNav');
        if (nav.classList.contains('responsive')) {
            nav.classList.remove('responsive');
        }
    }, []);

    const loggingin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);

            if (result.user.email.split('@')[1] !== 'vitstudent.ac.in') {
                alert('Login with your VIT email ID!');
            } else {
                const regno = result.user.displayName.substring(result.user.displayName.length - 9);

                const docRef = doc(db, "users", regno);
                const docSnap = await getDoc(docRef);
                const newLoginTime = new Date().toLocaleDateString('en-GB') + " " + new Date().toLocaleTimeString();

                if (docSnap.exists()) {
                    toast.success('Login successful!');
                    localStorage.setItem('userName', result.user.displayName.substring(0, result.user.displayName.length - 10));
                    localStorage.setItem('systemname', result.user.displayName);
                    localStorage.setItem('regno',result.user.displayName.slice(-9));

                    updateDoc(docRef, {
                        logins: increment(1),
                        logintime: arrayUnion(newLoginTime),
                    });

                    const userRef = doc(collection(db, 'users'), auth.currentUser.displayName.slice(-9));
                    const userDoc = await getDoc(userRef);

                    const userDaily = userDoc.data().daily;
                    const currentDate = new Date();
                    const yesterday = new Date(currentDate);
                    yesterday.setDate(currentDate.getDate() - 1);

                    const yesterdayFormatted = yesterday.toLocaleDateString('en-GB');

                    
                    const currentPoints = userDoc.data().points || 0;

                    if (userDaily === yesterdayFormatted) { 
                        const currentStreak = userDoc.data().streak || 0;
                        const updatedStreak = currentStreak + 1;
                        const test=updatedStreak%5;
                        if(test===0){
                            const updPoints = currentPoints + 20;
                            await updateDoc(userRef, { streak:updatedStreak, points: updPoints, daily: new Date().toLocaleDateString('en-GB') });
                        }
                        else{
                            await updateDoc(userRef, { streak: updatedStreak});
                            if (userDoc.exists() && userDoc.data().daily !== new Date().toLocaleDateString('en-GB')) {
                                const currentPoints = userDoc.data().points || 0;
                                const updatedPoints = currentPoints + 3;
                                await updateDoc(userRef, { points: updatedPoints, daily: new Date().toLocaleDateString('en-GB') });
                            }
                        }

                    }
                    else{
                        if(userDaily!==new Date().toLocaleDateString('en-GB')){
                            await updateDoc(userRef, { streak: 1});
                        }
    
                        if (userDoc.exists() && userDoc.data().daily !== new Date().toLocaleDateString('en-GB')) {
                            const currentPoints = userDoc.data().points || 0;
                            const updatedPoints = currentPoints + 3;
                            await updateDoc(userRef, { points: updatedPoints, daily: new Date().toLocaleDateString('en-GB') });
                        }
                    }

                    
                    navigate('/home', {
                        state: {
                            userToken: result.user.accessToken,
                            nametoken: result.user.displayName,
                        },
                    });
                } else {
                    localStorage.setItem('userName', result.user.displayName.substring(0, result.user.displayName.length - 10));
                    localStorage.setItem('systemname', result.user.displayName);
                    localStorage.setItem('regno',result.user.displayName.slice(-9));
                    toast.success('Login successful!');
                    navigate('/signup', {
                        state: {
                            userToken: result.user.accessToken,
                            regno: regno,
                            userName: result.user.displayName,
                        },
                    });
                }
            }


        } catch (error) {
            toast.error('Error logging in. Please try again.');
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login">
            <div className="leftlog">
                <h1>Where Knowledge Meets Fun <br /> Share, Learn, Thrive!</h1>
            </div>
            <div className="rightlog">
                <div className="logincontainer">
                    <GoogleButton onClick={loggingin} style={{ fontSize: '16px', padding: '10px', height: '1' }} />
                </div>
            </div>
        </div>
    );
};

export default Login;
