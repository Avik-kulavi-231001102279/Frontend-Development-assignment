import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeContextProvider } from './context/ThemeContext';
import { FilterProvider } from './context/FilterContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);

