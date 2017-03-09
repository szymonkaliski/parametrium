import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import Intro from './components/intro';

import appStore from './reducers';

const store = createStore(appStore);

// import Renderer from './components/renderer';
// import codeTransform from './code-transform';



// times(9).map(i => {
//   const code = codeTransform
//   return <Renderer key={i} code={code}/>

const App = ({ isInited }) => {
  return <div>
    {
      !isInited ? <Intro/> : <div>TODO: evolve...</div>
    }
  </div>;
};

const mapStateToProps = (state) => ({
  isInited: state.get('inputCode') !== undefined
});

const AppConnected = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={ store }>
    <AppConnected/>
  </Provider>,
  document.getElementById('root')
);
