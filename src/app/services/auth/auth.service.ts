import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  localUser;
  usersBusiness = null;
  constructor(public afAuth: AngularFireAuth, public router: Router, public http: HttpClient) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.refreshUserBusiness();
        this.http.get(`/api/user/firebaseId/${this.user.uid}`).subscribe(localUser => this.localUser = localUser);
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  async signup(email: string, password: string, displayName: string) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      await this.user.updateProfile({ displayName });
      const userObj = {
        email: this.user.email,
        displayName: this.user.displayName,
        firebaseId: this.user.uid,
        accountType: 'User',
        urlImage: 'https://i.imgur.com/BNtJWJM.png'
      };
      this.http.post<any>('/api/user', userObj).subscribe();
      await this.http.get(`/api/user/firebaseId/${this.user.uid}`).subscribe(user => this.localUser = user);
      this.router.navigate(['']);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/weak-password') {
        alert('Error! The password is too weak.');
      } else {
        alert('Error! ' + errorMessage);
      }
    }
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      await this.http.get(`/api/user/firebaseId/${this.user.uid}`).subscribe(user => this.localUser = user);
      await this.refreshUserBusiness();
      this.router.navigate(['']);
    } catch (e) {
      alert('Error! ' + e.message);
    }
  }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.localUser = null;
    this.usersBusiness = null;
    this.router.navigate(['login']);
  }

  async fbLogin() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      await this.afAuth.auth.signInWithPopup(provider);
      const userObj = {
        email: this.user.email,
        displayName: this.user.displayName,
        firebaseId: this.user.uid,
        accountType: 'User',
        urlImage: this.user.photoURL
      };
      this.http.post<any>('/api/user', userObj).subscribe();
      await this.http.get(`/api/user/firebaseId/${this.user.uid}`).subscribe(user => this.localUser = user);
      await this.refreshUserBusiness();
      this.router.navigate(['']);
    } catch (error) {
      alert('Error! ' + error.message);
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  get currentUser() {
    return this.user;
  }

  get currentLocalUser() {
    return this.localUser;
  }

  get currentUsersBusiness() {
    return this.usersBusiness;
  }

  refreshUserBusiness() {
    return this.http.get(`/api/business/firebaseId/${this.user.uid}`).subscribe(business => {
      this.usersBusiness = business;
    });
  }

  hasBusiness() {
    return !!this.usersBusiness;
  }

  canClaimBusiness() {
    return !this.usersBusiness;
  }
}
