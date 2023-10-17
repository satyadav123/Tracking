import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './usertracking.css'; 

const UserTrackingComponent = () => {
  const [userIp, setUserIp] = useState(null);

  useEffect(() => {
    // Fetch the user's IP address using api
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        const { ip } = data;
        setUserIp(ip);

        // Create the initial user cookie with the IP address
        if (!Cookies.get('userCookiee')) {
          const userId = generateUserId();
          const initialUserCookiee = {
            userId,
            userIp: ip,
            interactions: [],
            email: '', 
            password: '',
          };
          Cookies.set('userCookiee', JSON.stringify(initialUserCookiee), { expires: 365 });// storing the cookies here
        }
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error);
      });
  }, []);

  const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  };

  // State to track user interactions
  const [interactions, setInteractions] = useState([]);

  // Step 2: Track user interactions and update the user's cookie
  const trackUserInteraction = (eventType) => {
    const newInteraction = { eventType, timestamp: new Date() };
    setInteractions([...interactions, newInteraction]);
  };

  useEffect(() => {
    // Update the user's cookie with the latest interactions
    const userCookiee = JSON.parse(Cookies.get('userCookiee'));

    if (userCookiee) {
      userCookiee.interactions = interactions;
      Cookies.set('userCookiee', JSON.stringify(userCookiee), { expires: 365 });
    }
  }, [interactions]);

  // Function to handle form submission and store email and password in cookies
  const handleLoginFormSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    // Update the user's cookie with email and password data
    const userCookiee = JSON.parse(Cookies.get('userCookiee'));
    userCookiee.email = email;
    userCookiee.password = password;
    Cookies.set('userCookiee', JSON.stringify(userCookiee), { expires: 365 });
  };

  // Retrieve email and password from cookies (if available in the cookies then it auto fill the form)
  const userCookiee = JSON.parse(Cookies.get('userCookiee'));
  const initialEmail = userCookiee.email || '';
  const initialPassword = userCookiee.password || '';

  // Function to send user data to a dummy API (JSONPlaceholder)
  const sendCookieToServer = () => {
    const userCookiee = Cookies.get('userCookiee');

    if (userCookiee) {
      
      const apiUrl = 'https:dummy/post'; 

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userCookiee }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('User data sent to the server successfully:', data);
        })
        .catch((error) => {
          console.error('Error sending user data to the server:', error);
        });
    } else {
      // Handle the case when the cookie doesn't exist
      console.warn('User cookie does not exist');
    }
  };

  return (
    <div className="user-tracking-component"> {/* Apply the component class */}
      <h1>User Tracking and Login Example</h1>
      <p>User's IP address: {userIp}</p>
      <form onSubmit={handleLoginFormSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" defaultValue={initialEmail} />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" defaultValue={initialPassword} />
        <br />
        <button type="submit" className="submit-button">Login</button> 
      </form>
      <div className='button-container'>
      <button onClick={() => trackUserInteraction('button_click')}>Click Me for Cookies</button>
      <button className='Right-button' onClick={sendCookieToServer}>Send Data to Server</button>
      </div>
    </div>
  );
};

export default UserTrackingComponent;
