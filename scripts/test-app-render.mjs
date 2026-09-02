import { JSDOM } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Mock DOM
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.location = dom.window.location;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

import App from '../src/App.jsx';

try {
  console.log('Testing React DOM Client Root Mount with App...');
  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
  console.log('✅ App successfully mounted into React Root without crashing!');
  console.log('Root HTML after initial render call:', rootElement.innerHTML);
} catch (err) {
  console.error('❌ FATAL RUNTIME ERROR rendering App:', err);
  process.exit(1);
}
