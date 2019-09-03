import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import { BodyWidget } from './components/BodyWidget';
import { analogModules } from './zrna/AnalogModule';

document.addEventListener('DOMContentLoaded', () => {
	var app = new App();
	ReactDOM.render(<BodyWidget app={app} modules={analogModules()}/>, document.querySelector('#root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



