import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Manager';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const express = require('express');
// const { Pool } = require('pg');
// const dotenv = require('dotenv').config();

// // Create express app
// const app = express();
// const port = 3000;

// Create pool
// const pool = new Pool({
//     user: process.env.PSQL_USER,
//     host: process.env.PSQL_HOST,
//     database: process.env.PSQL_DATABASE,
//     password: process.env.PSQL_PASSWORD,
//     port: process.env.PSQL_PORT,
//     ssl: {rejectUnauthorized: false}
// });

	 	 	 	
// // Add process hook to shutdown pool
// process.on('SIGINT', function() {
//   pool.end();
//   console.log('Application successfully shutdown');
//   process.exit(0);
// });
         
// app.set("view engine", "ejs");

// app.get('/', (req, res) => {
//   const data = {name: 'Mario'};
//   res.render('index', data);
// });

// app.get('/user', (req, res) => {
//   teammembers = []
//   pool
//       .query('SELECT * FROM teammembers;')
//       .then(query_res => {
//           for (let i = 0; i < query_res.rowCount; i++){
//               teammembers.push(query_res.rows[i]);
//           }
//           const data = {teammembers: teammembers};
//           console.log(teammembers);
//           res.render('user', data);
//       });
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
