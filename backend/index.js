import express from "express";
import cors from "cors"; // Import the cors middleware
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mysql = require("mysql2");
const app = express();

app.use(cors());

const db = mysql.createConnection({
  host: "127.0.01",
  user: "root",
  password: "golazo.MESSI21",
  database: "soccer",
});

app.get("/", (req, res) => {
  res.json("hello this is backend");
});

// app.get("/league/:leagueName", (req, res) => {
//   const leagueName = req.params.leagueName;
//   const q = `SELECT * FROM LEAGUE WHERE league_name = ?`;
//   db.query(q, [leagueName], (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

app.get("/league/:leagueName", (req, res) => {
  const leagueName = req.params.leagueName;
  const q = `SELECT * FROM TEAM WHERE league_name = ?`;
  db.query(q, [leagueName], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/team/:teamName/:season", (req, res) => {
  const teamName = req.params.teamName;
  const season = req.params.season;
  const q = `SELECT
  tms.team_name,
  mt.match_id,
  mt.match_home_team_name,
  mt.match_away_team_name,
  lr.season_year,
  tms.match_result,
  tms.goals_scored,
  tms.goals_conceded
FROM
  TEAM_MATCH_STATS tms
JOIN
  MATCH_TABLE mt ON tms.match_id = mt.match_id
JOIN
  LEAGUE_SEASON lr ON mt.league_name = lr.league_name AND mt.season_year = lr.season_year
WHERE
  tms.team_name = ?
  AND lr.season_year = ?;

  `;
  db.query(q, [teamName, season], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/team/players/:teamName/:season", (req, res) => {
  const teamName = req.params.teamName;
  const season = req.params.season;
  const q = `SELECT 
  P.player_id AS "Player ID",
  P.player_fname AS "First Name", 
  P.player_lname AS "Last Name", 
  PH.player_number AS "Number",
  P.player_position AS "Position"
  FROM PLAYER P
  JOIN PLAYER_HISTORY PH ON P.player_id = PH.player_id
  JOIN TEAM T ON PH.team_name = T.team_name
  WHERE PH.team_name = ? AND PH.season_year = ?;
  

  `;
  db.query(q, [teamName, season], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/team/managers/:teamName/:season", (req, res) => {
  const teamName = req.params.teamName;
  const season = req.params.season;
  const q = `SELECT DISTINCT
  M.manager_id,
  M.manager_fname,
  M.manager_lname,
  M.manager_age,
  M.manager_nationality
FROM
  MANAGER M
JOIN
  MANAGER_HISTORY MH ON M.manager_id = MH.manager_id
JOIN
  TEAM T ON MH.team_name = T.team_name
JOIN
  LEAGUE_SEASON LS ON MH.season_year = LS.season_year
WHERE
  T.team_name = ?
  AND LS.season_year = ?; 
  

  `;
  db.query(q, [teamName, season], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/league/:leagueName/:season", (req, res) => {
  const leagueName = req.params.leagueName;
  const season = req.params.season;
  const q = `SELECT 
  T.team_name AS "Team Name", 
  COUNT(*) AS "Matches Played", 
  SUM(CASE WHEN TMS.match_result = 'Win' THEN 1 ELSE 0 END) AS "Total Wins",
  SUM(CASE WHEN TMS.match_result = "Draw" THEN 1 ELSE 0 END) AS "Total Draws",
  SUM(CASE WHEN TMS.match_result = "Loss" THEN 1 ELSE 0 END) AS "Total Losses",
  SUM(MR.points_earned) AS "Total Points"
FROM TEAM T
JOIN TEAM_MATCH_STATS TMS ON T.team_name = TMS.team_name
JOIN MATCH_RESULT MR ON TMS.match_result = MR.match_result
JOIN MATCH_TABLE M ON TMS.match_id = M.match_id
WHERE M.SEASON_YEAR = ? AND M.LEAGUE_NAME = ?
GROUP BY T.team_name
ORDER BY SUM(MR.points_earned) DESC, T.team_name;


  
`;
  db.query(q, [season, leagueName], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend");
});
