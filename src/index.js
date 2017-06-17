import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/main.css';
import './styles/header.css';
import './styles/results.css';
import './styles/player.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
