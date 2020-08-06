import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers/rootReducer';
import { taskMiddleware } from 'react-palm/tasks';
import thunk from 'redux-thunk';

const initialState = {};
const middlewares = [ taskMiddleware, thunk ];
const enhancers = [ applyMiddleware(...middlewares) ];

const store = createStore(
    rootReducer,
    initialState,
    compose(...enhancers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;