// Точка входу: збираємо DI-контейнер і передаємо його в дерево React.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { buildContainer } from './di/container.js';
import { ServicesProvider } from './di/ServicesContext.jsx';
import './styles/main.scss';

const container = buildContainer();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ServicesProvider container={container}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ServicesProvider>
  </React.StrictMode>,
);
