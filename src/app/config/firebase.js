import firebase from 'firebase';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyC0JBE1x5OSJ4vd5n2wj3oMsFPsSwHMMJU",
  authDomain: "revent-211717.firebaseapp.com",
  databaseURL: "https://revent-211717.firebaseio.com",
  projectId: "revent-211717",
  storageBucket: "revent-211717.appspot.com",
  messagingSenderId: "383716794638"
};
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)
export default firebase;