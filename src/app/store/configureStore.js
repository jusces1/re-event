import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import {reduxFirestore, getFirestore} from 'redux-firestore'
import thunk from 'redux-thunk'
import  rootReducer  from "../reducers/rootReducer";
import { truncateSync } from "fs";
import firebase from "../config/firebase";

const rrfConfig = {
    userProfile: 'users',
    attachAuthIsReady: true,
    useFirestoreForProfile: truncateSync
}

export const configureStore = (preloadeState) => {
    const middlewares = [thunk.withExtraArgument({getFirebase, getFirestore})];
    const middlewareEnchancer = applyMiddleware(...middlewares);

    const storeEnchancers = [middlewareEnchancer];

    const composedEnchacers = composeWithDevTools(
        ...storeEnchancers, 
        reactReduxFirebase(firebase, rrfConfig),
        reduxFirestore(firebase));

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