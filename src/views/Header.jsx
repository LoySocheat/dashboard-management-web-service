// Header.js

import React from 'react';

const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className={`header ${isDarkMode ? 'dark' : 'light'}`}>
      <h1>Your App</h1>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
};

export default Header;
