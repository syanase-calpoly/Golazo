import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import TeamDetailsPage from "./TeamDetailsPage";

const MainPage = ({ season, league, handleSelect1, handleSelect2, handleContinue, leagueInfo, error }) => (
  <div className="App" style={{ textAlign: "center", margin: "20px" }}>
    <div style={{ marginBottom: "20px" }}>
      <h1>Soccer Database</h1>
      <label style={{ marginRight: "10px" }}>Select season: </label>
      <select
        value={season}
        onChange={(e) => handleSelect1(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="">Select</option>
        <option value="2022-2023">2022-2023</option>
        <option value="2021-2022">2021-2022</option>
        <option value="2020-2021">2020-2021</option>
        <option value="2019-2020">2019-2020</option>

      </select>
    </div>

    <div style={{ marginBottom: "20px" }}>
      <label style={{ marginRight: "10px" }}>Select league: </label>
      <select
        value={league}
        onChange={(e) => handleSelect2(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="">Select</option>
        <option value="Ligue 1">Ligue 1</option>
        <option value="Bundesliga">Bundesliga</option>
        <option value="La Liga">La Liga</option>
        <option value="Premier League">Premier League</option>
        <option value="Serie A">Serie A</option>
      </select>
    </div>

    <button
      onClick={handleContinue}
      style={{
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Continue
    </button>

    {error && (
      <div style={{ marginTop: "20px", color: "red" }}>
        {error}
      </div>
    )}

    {leagueInfo && !leagueInfo.teamDetails && (
      <div style={{ marginTop: "20px" }}>
        <h2>League Information</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(leagueInfo[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leagueInfo.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                  {/* Use Link to navigate to TeamDetails with the teamName parameter */}
                  <td>
                    <Link to={`/team/${encodeURIComponent(Object.values(data)[0])}`}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

function App() {
  const [season, setSelectedItem1] = useState(null);
  const [league, setSelectedItem2] = useState(null);
  const [leagueInfo, setLeagueInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleSelect1 = (item) => {
    setSelectedItem1(item);
  };

  const handleSelect2 = (item) => {
    setSelectedItem2(item);
  };

  const handleContinue = async () => {
    if (!season || !league) {
      setError("Please select both season and league.");
      setLeagueInfo(null); 
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8800/league/${league}/${season}`
      );
      const data = await response.json();
  
      if (data === null || data.length === 0) {
        setError("No data found for the selected league and season.");
        setLeagueInfo(null); // Clear league information
        return;
      }
  
      console.log("League information:", data);
      setLeagueInfo(data);
      setError(null);
    } catch (error) {
      setError("Error fetching league information: " + error.message);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage season={season} league={league} handleSelect1={handleSelect1} handleSelect2={handleSelect2} handleContinue={handleContinue} leagueInfo={leagueInfo} error={error} />}
        />

        <Route
          path="/team/:teamName"
          element={<TeamDetailsPage season={season} />}
        />      
      </Routes>
    </Router>
  );
}

export default App;
