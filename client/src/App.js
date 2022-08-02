import React from 'react';
import './App.css';

// render data to the screen
// const testUrl = 'http://localhost:8080/testdata';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="http://localhost:8080/testdata"
          target="_blank"
          rel="noopener noreferrer"
        >
          Server Ready Test
        </a>
      </header>
    </div>
  );
}

export default App;
