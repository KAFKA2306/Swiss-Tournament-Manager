// client/src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
 const [matches, setMatches] = useState([]);
 const [results, setResults] = useState([]);
 const [config, setConfig] = useState(null);

 useEffect(() => {
   const fetchData = async () => {
     const [{ data: configData }, { data: matchData }] = await Promise.all([
       axios.get('/api/tournament/config'),
       axios.post('/api/tournament/preliminary'),
     ]);
     setConfig(configData);
     setMatches(matchData);
   };
   fetchData();
 }, []);

 const handleReport = async (matchId, scores) => {
   await axios.post(`/api/tournament/preliminary/${matchId}/report`, { scores });
   const { data } = await axios.get('/api/tournament/preliminary/results');
   setResults(data);
 };

 return (
   <div>
     {config && (
       <header>
         <h1>{config.tournamentName}</h1>
         <p>
           {config.tableSize}人卓 / 予選{config.preliminaryRounds}ラウンド / 上位
           {config.finalistCut}名が決勝進出
         </p>
       </header>
     )}
     <h2>Matches</h2>
     {matches.map((match) => (
       <div key={match._id}>
         <p>
           {match.players.map((player) => player.name).join(' vs ')}
         </p>
         <input
           type="text"
           placeholder="Scores"
           onBlur={(e) => handleReport(match._id, e.target.value.split(','))}
         />
       </div>
     ))}
     <h2>Results</h2>
     {results.map((result, index) => (
       <p key={result.name}>
         {index + 1}. {result.name} - {result.totalScore}
       </p>
     ))}
   </div>
 );
}

export default Dashboard;
