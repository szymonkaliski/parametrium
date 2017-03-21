import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { connect, Provider } from 'react-redux';

import Intro from './components/intro';
import Population from './components/population';

import appStore from './reducers';

import './index.css';

const store = createStore(appStore, applyMiddleware(thunk));

const App = ({ isInited }) => !isInited ? <Intro /> : <Population />;

const mapStateToProps = state => ({
  isInited: state.get('inputCode') !== undefined
});

const AppConnected = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <AppConnected />
  </Provider>,
  document.getElementById('root')
);
