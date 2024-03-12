// TeamDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TeamDetailsPage({ season }) {
  const { teamName } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [managerDetails, setManagerDetails] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(season);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const teamResponse = await fetch(
          `http://localhost:8800/team/${teamName}/${selectedSeason}`
        );
        const teamDetails = await teamResponse.json();
        if (teamDetails === null || teamDetails.length === 0) {
          console.error("No match stats found for the selected team and season.");
          // You can also show a user-friendly error message
          return;
        }
        setTeamDetails(teamDetails);

        const playerResponse = await fetch(
          `http://localhost:8800/team/players/${teamName}/${selectedSeason}`
        );
        const playerDetails = await playerResponse.json();
        if (playerDetails === null || playerDetails.length === 0) {
          console.error("No players found for the selected team and season.");
          // You can also show a user-friendly error message
          return;
        }

        setPlayerDetails(playerDetails);

        const managerResponse = await fetch(
          `http://localhost:8800/team/managers/${teamName}/${selectedSeason}`
        );
        const managerDetails = await managerResponse.json();
        if (managerDetails === null || managerDetails.length === 0) {
          console.error("No managers found for the selected team and season.");
          // You can also show a user-friendly error message
          return;
        }
        setManagerDetails(managerDetails);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchTeamDetails();
  }, [teamName, selectedSeason]);

  const handleSelectSeason = (selectedSeason) => {
    setSelectedSeason(selectedSeason);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{`${teamName} Details`}</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Select season: </label>
        <select
          value={selectedSeason}
          onChange={(e) => handleSelectSeason(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="">Select</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2021-2022">2021-2022</option>
          <option value="2020-2021">2020-2021</option>
        </select>
      </div>
      <h3>Match Details</h3>
      
      {teamDetails && (
        <div className="table-container">
          
          <table>
            <thead>
              <tr>
                {Object.keys(teamDetails[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamDetails.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h3 >Players Details</h3>

      {playerDetails && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(playerDetails[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playerDetails.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 >Manager Details</h3>

      {managerDetails && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(managerDetails[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managerDetails.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeamDetailsPage;
