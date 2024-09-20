// src/index.tsx or src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

// Get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  // Render your app using the new root
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
