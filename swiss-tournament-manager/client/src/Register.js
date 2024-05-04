
// client/src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = async (e) => {
   e.preventDefault();
   await axios.post('/api/users/register', { name, email, password });
   window.location = '/';
 };

 return (
   <form onSubmit={handleSubmit}>
     <input
       type="text"
       placeholder="Name"
       value={name}
       onChange={(e) => setName(e.target.value)}
     />
     <input
       type="email"
       placeholder="Email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
     />
     <input
       type="password"
       placeholder="Password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
     />
     <button type="submit">Register</button>
   </form>
 );
}

export default Register;
