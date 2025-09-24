import React from 'react';
import ReactDOM from 'react-dom/client'; // Or 'react-dom' for older React versions
import './index.css'; // Make sure you have this file or remove this line
import App from './App'; // Make sure you have an App.js file or adjust the import
import reportWebVitals from './reportWebVitals'; // Optional: for performance measuring

// For React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If using React 17 or older, it would look like this:
/*
import ReactDOM from 'react-dom';
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();