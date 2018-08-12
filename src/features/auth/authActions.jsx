import {SubmissionError, reset} from 'redux-form'
import {closeModal} from '../modals/modalActions';
import { toastr } from "react-redux-toastr";

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
            await firestore.set(`users/${createdUser.uid}`, {...newUser});
            dispatch(closeModal())

        } catch (error) {
            console.log(error);
            throw new SubmissionError({ _error: error.message });
        }
    };
    
export const socialLogin = (selectedProvider) =>
    async (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        try {
            dispatch(closeModal());
            let user = await firebase.login({
                provider: selectedProvider,
                type: 'popup'
            })
            if(user.additionUserInfo.isNewUser) {
                await firestore.set(`users/${user.user.uid}` , {
                    displayName: user.profile.displayName,
                    photoURL: user.profile.avatarUrl,
                    createdAt: firestore.FieldValue.serverTimestamp()
                })
            }
        } catch (error) {
            console.log(error);             
        }
    }

export const updatePassword = (cred) => 
    async (dispatch, getState , {getFirebase}) => {
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        try {
            await user.updatePassword(cred.newPassword1);
            await dispatch(reset('accaunt'));
            toastr.success('Success', 'Your password has been updated');
        } catch (error) {
            throw new SubmissionError({
                _error: error.message
            })
        }
    }