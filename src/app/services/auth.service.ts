import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private userDetails$: Subject<User> = new Subject<User>();

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    const savedUserString = localStorage.getItem('user');
    if (savedUserString != null) {
      this.isLoggedIn$.next(true);
    }

    afAuth.authState.subscribe((user) => {
      if (!!user) {
        this.userDetails$.next(user as User);
        const userString: string = JSON.stringify(user);
        localStorage.setItem('user', userString);
        this.isLoggedIn$.next(true);
      } else {
        localStorage.removeItem('user');
        this.isLoggedIn$.next(false);
      }
    });
  }

  public signInWithGoogle() {
    this.authLogin(new firebase.default.auth.GoogleAuthProvider());
  }

  private authLogin(provider: firebase.default.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider).then((res) => {
      this.isLoggedIn$.next(true)
      this.serUserData(<User>res.user);
      this.router.navigate(['chat'])
    });
  }

  private serUserData(user: User): Promise<void> | void {
    if (!user) return;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    // no override the existing data, update instead
    return userRef.set(userData, { merge: true });
  }

  public signOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
      // this.userDetails$.next(undefined);
    });
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  public getUserData(): Observable<User> {
    return this.userDetails$.asObservable()
  }
}
