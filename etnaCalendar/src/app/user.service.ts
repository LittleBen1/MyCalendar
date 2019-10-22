import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { AngularFirestore, fromDocRef, DocumentReference } from '@angular/fire/firestore';
import { User } from './user.model';

@Injectable()
export class UserService {

    private user: User;
    constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {
    }

    setUser(user: User) {
        this.user = user;
    }

    getFriends() {
        return this.afStore.collection(`users/${this.user.id}/friends`).snapshotChanges();
    }

    getCalendars() {
        return this.afStore.collection(`users/${this.user.id}/calendars`).snapshotChanges();
    }

    async isAuthenticated() {
        if (this.user) { return true; }

        const user = await this.afAuth.authState.pipe(first()).toPromise();

        if (user) {
            this.setUser({
                username: user.email.split('@')[0],
                id: user.uid,
                calendars: [],
                friends: []
            });
            return true;
        }
        return false;
    }

    getUsers() {
        return this.afStore.collection(`users`).snapshotChanges();
    }

    getUserById(id: string) {
        return this.afStore.collection(`users/${id}/`).snapshotChanges();
    }

    addFriend(ref: DocumentReference) {
        return new Promise<any>((resolve, reject) => {
            this.afStore
                .collection(`users/${this.getUID()}/friends`)
                .add(ref)
                .then(res => {}, err => reject(err));
        });
    } 

    addCalendarToFirestore(ref: DocumentReference) {
        return new Promise<any>((resolve, reject) => {
            this.afStore
                .collection(`users/${this.getUID()}/calendars/`)
                .add({ref: ref})
                .then(res => {}, err => reject(err));
        });
    } 

    getUsername() {
        return this.user.username;
    }

    getUID() {
        return this.user.id;
    }

    addCalendarToUser(ref: DocumentReference) {
        this.user.calendars.push(ref.id);
        this.addCalendarToFirestore(ref);
        console.log(ref);
        
    }
}
