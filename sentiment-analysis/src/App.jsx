import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mockResult = {
      sentiment: 'Positive',
      score: 0.8,
    };
    setSentimentResult(mockResult);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SENTIMENT ANALYSIS</h1>
        <div className="content">
          <h2>Sentimental Analysis</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Enter your text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-bar"
            />
            <button type="submit" className="button">
              Analyse
            </button>
          </form>
          {sentimentResult && (
            <div className="result">
              <p><strong>Sentiment:</strong> {sentimentResult.sentiment}</p>
              <p><strong>Score:</strong> {sentimentResult.score}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
