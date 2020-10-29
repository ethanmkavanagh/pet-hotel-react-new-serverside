import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { put, takeLatest } from 'redux-saga/effects';
import logger from 'redux-logger';
import App from './components/App/App';
import reportWebVitals from './tests/reportWebVitals';
import axios from 'axios';

// rootSaga
function* rootSaga() {
  yield takeLatest('FETCH_OWNERS', fetchOwners);
  yield takeLatest('ADD_PET', addPet);
  yield takeLatest('ADD_OWNER', addOwner);
  yield takeLatest('DELETE_OWNER', deleteOwner);
}

// saga calls
function* fetchOwners(action){
  let response = yield axios({
    method: 'GET',
    url: '/owners'
  })
  yield put({
    type: 'SET_OWNERS',
    payload: response.data
  })
  console.log(response.data)
}

function* addPet(action){
  console.log('addPet saga hit with:', action.payload);
  yield axios({
    method: 'POST',
    url: '/pets',
    data: action.payload
  })
}

function* addOwner(action){
  console.log('New Owner ACTION PAYLOAD', action.payload);
  let response = yield axios ({
    method: 'POST',
    url: '/owners',
    data: action.payload
  })
  yield put({
    type: 'FETCH_OWNERS',
    payload: response.data
  })
  console.log(response.data)
}

function* deleteOwner(action){
  console.log('delete Owner ACTION PAYLOAD', action.payload);
  let response = yield axios ({
    method: 'DELETE',
    url: `/owners/${action.payload}`,
    data: action.payload
  })
  yield put({
    type: 'FETCH_OWNERS',
    payload: response.data
  })
  console.log(response.data)
}

// reducer calls
const ownersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_OWNERS':
      return action.payload;
    default:
      return state;
  }
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    ownersReducer
  }),
  applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
