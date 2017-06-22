import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/main.css';
import './styles/header.css';
import './styles/search.css';
import './styles/dropdown.css';
import './styles/tags.css';
import './styles/results.css';
import './styles/player.css';
import './styles/controls.css';
import './styles/video.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
