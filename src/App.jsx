import React, { useState } from 'react';
import Header from './views/Header';

const App = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <h1>Main Content</h1>
      <p>This is your app content.</p>
    </div>
  );
};

export default App;
