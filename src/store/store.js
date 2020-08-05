import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers/rootReducer';
import { taskMiddleware } from 'react-palm/tasks';

const middlewares = [ taskMiddleware ];
const enhancers = [ applyMiddleware(...middlewares) ];

const store = createStore(
    rootReducer,
    {},
    compose(...enhancers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;