import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Modular Stylesheets
import './styles/global.css';
import './styles/navbar.css';
import './styles/home.css';
import './styles/blogs.css';
import './styles/forms.css';
import './styles/details.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

