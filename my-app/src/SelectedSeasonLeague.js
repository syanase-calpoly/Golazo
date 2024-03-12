import React from "react";

const SelectedSeasonLeague = ({ season, league }) => (
  <div>
    <h2>Selected Season and League</h2>
    <p>Season: {season}</p>
    <p>League: {league}</p>
  </div>
);

export default SelectedSeasonLeague;
// import React, { useEffect, useState } from "react";

// const LeagueInfo = ({ league }) => {
//   const [leagueInfo, setLeagueInfo] = useState(null);

//   useEffect(() => {
//     const fetchLeagueInfo = async () => {
//       try {
//         const response = await fetch(`http://localhost:8800/league/${league}`);
//         const data = await response.json();
//         setLeagueInfo(data);
//       } catch (error) {
//         console.error("Error fetching league information:", error);
//       }
//     };

//     fetchLeagueInfo();
//   }, [league]);

//   return (
//     <div>
//       <h2>League Information</h2>
//       {leagueInfo ? (
//         <div>
//           <p>League Name: {leagueInfo[0].league_name}</p>
//           {/* Add more information as needed */}
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default LeagueInfo;
