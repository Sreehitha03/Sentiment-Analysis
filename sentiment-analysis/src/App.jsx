import React, { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const [inputText, setInputText] = useState("");
  const [sentimentResult, setSentimentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      setIsLoggedIn(true);
      navigate("/");
    }
  }, [navigate]);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      const response = await fetch("http://localhost:5000/api/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch sentiment analysis.");
      }

      const data = await response.json();
      setSentimentResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SENTIMENT ANALYSIS</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <div className="content">
          <h2>Analyze Your Text</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Enter your text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-bar"
              required
            />
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
          {error && <p className="error">Error: {error}</p>}
          {sentimentResult && (
            <div className="result">
              <p>
                <strong>Sentiment:</strong> {sentimentResult.sentiment}
              </p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
