import * as firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAmgItH1UttGw2CuLxPgCDsB-q9gExU68w",
    authDomain: "nokular-8c8fd.firebaseapp.com",
    databaseURL: "https://nokular-8c8fd.firebaseio.com",
    projectId: "nokular-8c8fd",
    storageBucket: "nokular-8c8fd.appspot.com",
    messagingSenderId: "970458222266",
    appId: "1:970458222266:web:6a82a676a20d4f9169fc83"
};

firebase.initializeApp(config);

export async function loginUser(email: string, password: string): Promise<string> {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        return 'accepted';
    } catch (error) {
        return error.message as string;
    }
}

export async function resetPassword(email: string): Promise<string> {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        return 'accepted';
    } catch (error) {
        return error.message as string;
    }
}

export async function registerUser(email: string, password: string): Promise<string | firebase.auth.UserCredential> {
    try {
        const ret = await firebase.auth().createUserWithEmailAndPassword(email, password);
        return ret;
    } catch (error) {
        return error.message as string;
    }
}

export async function getUid(): Promise<string | undefined> {
    try {
        const rest = await firebase.auth().currentUser?.uid
        return rest;
    } catch (error) {
        return error.message as string;
    }
}

export async function getCollection(collection: string, uid: string): Promise<any> {
    try {
        let data = await firebase.firestore().collection(collection).doc(uid).get().then((document) => {
            if (document.exists) {
                return document.data()
            } else {
                return 'Does not exist';
            }
        });
        return data;
    } catch (error) {
        return error.message as string;
    }
}

export async function writeToCollection(collection: string, uid: string, dataToSet: any): Promise<any> {
    try {
        await firebase.firestore().collection(collection).doc(uid).set(dataToSet, { merge: true }).then(() => {
            return true;
        });
    } catch (error) {
        return error.message as string;
    }
}

export async function deleteFieldFromCollection(collection: string, uid: string, documentToDelete: any): Promise<any> {
    try {
        await firebase.firestore().collection(collection).doc(uid).update({
            [documentToDelete]: firebase.firestore.FieldValue.delete()
        }).then(() => {
            return true;
        });
    } catch (error) {
        return error.message as string;
    }
}

export async function isUserLoggedIn(): Promise<boolean> {
    try {
        let isLoggedIn = false
        await firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                isLoggedIn = true
            } else {
                isLoggedIn = false;
            }
        });
        return isLoggedIn;
    } catch {
        return false
    }
}

export async function logout(): Promise<boolean> {
    try {
        return await firebase.auth().signOut().then(() => {
            return true;
        });
    } catch {
        return false;
    }
}
