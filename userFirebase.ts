import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { userFirebaseConfig } from './userFirebaseConfig';

let userApp;
if (!getApps().some(app => app.name === 'userApp')) {
    userApp = initializeApp(userFirebaseConfig, 'userApp');
} else {
    userApp = getApp('userApp');
}

const userAuth = getAuth(userApp);
const userDb = getFirestore(userApp);

// 永続性の設定
setPersistence(userAuth, browserLocalPersistence);

export { userAuth, userDb };
