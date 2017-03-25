import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { connect, Provider } from 'react-redux';

import CodePreview from './components/code-preview';
import Header from './components/header';
import Info from './components/info';
import Intro from './components/intro';
import Modal from './components/modal';
import Population from './components/population';

import appStore from './reducers';

import './index.css';

const store = createStore(appStore, applyMiddleware(thunk));

const EvolvingModal = () => (
  <div className="modal-evolving">
    <div className="modal-evolving__content">
      ... evolving ...
    </div>
  </div>
);

const App = ({ isInited, isEvolving, showCode, showInfo }) => {
  const modalOpened = isEvolving || !!showCode || showInfo;

  return (
    <div className={modalOpened && 'content-no-scroll'}>
      {!isInited ? <Intro /> : <div><Header /><Population /></div>}

      <Modal open={modalOpened}>
        {isEvolving && <EvolvingModal />}
        {showInfo && <Info />}
        {!!showCode && <CodePreview code={showCode} />}
      </Modal>
    </div>
  );
};

const mapStateToProps = state => ({
  isInited: !!state.get('inputCode'),
  isEvolving: state.get('isEvolving'),
  showCode: state.get('showCode'),
  showInfo: state.get('showInfo')
});

const AppConnected = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <AppConnected />
  </Provider>,
  document.getElementById('root')
);
