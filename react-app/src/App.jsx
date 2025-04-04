import React, { useState } from 'react';
import NavBar from './components/NavBar';
import ProfileModal from './components/ProfileModal';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [username, setUsername] = useState('testUser'); // Replace with null for no user
  const [showProfile, setShowProfile] = useState(false); // State to control profile popup visibility

  const handleDeleteProfile = () => {
    alert('Profile deleted!');
    setUsername(null); // Clear the username state
    setShowProfile(false); // Close the profile popup
  };

  return (
    <>
      <NavBar username={username} setUser={setUsername} setShowProfile={setShowProfile} />
      <ProfileModal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        username={username}
        onDeleteProfile={handleDeleteProfile}
      />
    </>
  );
}

export default App;
