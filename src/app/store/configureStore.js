import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk'
import  rootReducer  from "../reducers/rootReducer";

export const configureStore = (preloadeState) => {
    const middlewares = [thunk];
    const middlewareEnchancer = applyMiddleware(...middlewares);

    const storeEnchancers = [middlewareEnchancer];

    const composedEnchacers = composeWithDevTools(...storeEnchancers);

    const store = createStore(
        rootReducer,
        preloadeState,
        composedEnchacers
    );

    if(process.env.NODE_ENV !== "production") {
        if(module.hot) {
            module.hot.accept('../reducers/rootReducer', () => {
                const newRootReducer = require('../reducers/rootReducer').default;
                store.replaceReducer(newRootReducer);
            })
        }
    }
    return store;
}