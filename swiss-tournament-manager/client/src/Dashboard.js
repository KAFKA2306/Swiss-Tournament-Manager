
// client/src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
 const [matches, setMatches] = useState([]);
 const [results, setResults] = useState([]);

 useEffect(() => {
   const fetchData = async () => {
     const { data } = await axios.post('/api/tournament/preliminary');
     setMatches(data);
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
