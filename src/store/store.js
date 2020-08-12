import { createStore, applyMiddleware, compose } from 'redux';
import { taskMiddleware } from 'react-palm/tasks';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const initialState = {};
const middlewares = [ taskMiddleware, thunkMiddleware ];
const enhancers = [ applyMiddleware(...middlewares) ];

const store = createStore(
    rootReducer,
    initialState,
    compose(...enhancers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;