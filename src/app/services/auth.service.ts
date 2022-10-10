import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}


  public signInWithGoogle() {
    this.authLogin(new firebase.default.auth.GoogleAuthProvider())
  }

  private authLogin(provider: firebase.default.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider).then((res) => {
      this.serUserData(<User>res.user)
    });
  }

  private serUserData(user: User): Promise<void> | void {
    if(!user) return;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    )

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }

    // no override the existing data, update instead
    return userRef.set(userData, {merge: true})
  }

}
