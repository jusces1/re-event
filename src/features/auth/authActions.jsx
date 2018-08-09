import {SubmissionError} from 'redux-form'
import {closeModal} from '../modals/modalActions';

export const login = (creds) => {
    return async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        try {
            await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password );
        } catch (error) {
            console.log(error);
            throw new SubmissionError({
                _error: error.message
            })
        }
        dispatch(closeModal())
    }
}

export const registerUser = (user) => 
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        try {
            //Create the user in auth
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            //update the auth profile
            await createdUser.updateProfile({
                displayName: user.displayName
            })
            //create a new profile in firestore 
            let newUser = {
                displayName: user.displayName,
                createdAt: firestore.FieldValue.serverTimestamp()
            }
            await firestore.set(`user/${createdUser.uid}`, {...newUser});
            dispatch(closeModal())

        } catch (error) {
            console.log(error);
            throw new SubmissionError({ _error: error.message });
        }
    }