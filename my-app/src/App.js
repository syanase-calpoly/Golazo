import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import TeamDetailsPage from "./TeamDetailsPage";

// Create a new component for the main page content
const MainPage = ({ season, league, handleSelect1, handleSelect2, handleContinue, leagueInfo }) => (
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
        <option value="2023-2024">2023-2024</option>
        <option value="2022-2023">2022-2023</option>
        <option value="2021-2022">2021-2022</option>
        <option value="2020-2021">2020-2021</option>
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

  const handleSelect1 = (item) => {
    setSelectedItem1(item);
  };

  const handleSelect2 = (item) => {
    setSelectedItem2(item);
  };

  const handleContinue = async () => {
    // Make a request to the backend to get information about the selected league
    if (!season || !league) {
      console.error("Please select both season and league.");
      // You can also show a user-friendly error message
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8800/league/${league}/${season}`
      );
      const data = await response.json();

      if (data === null || data.length === 0) {
        console.error("No data found for the selected league and season.");
        // You can also show a user-friendly error message
        return;
      }

      console.log("League information:", data);

      // Update the state with the fetched data
      setLeagueInfo(data);
    } catch (error) {
      console.error("Error fetching league information:", error);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Route for the main page */}
        <Route
          path="/"
          element={<MainPage season={season} league={league} handleSelect1={handleSelect1} handleSelect2={handleSelect2} handleContinue={handleContinue} leagueInfo={leagueInfo} />}
        />

        {/* Route for the team details page */}
        <Route
          path="/team/:teamName"
          element={<TeamDetailsPage season={season} />}
        />      
      </Routes>
    </Router>
  );
}

export default App;
