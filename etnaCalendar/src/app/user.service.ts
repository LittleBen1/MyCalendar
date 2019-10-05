import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

interface User {
    username: string;
    uid: string;
    profilePic: string;
}

@Injectable()
export class UserService {

    private user: User;
    constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {
    }

    setUser(user: User) {
        this.user = user;
    }

    async isAuthenticated() {
        if (this.user) { return true; }

        const user = await this.afAuth.authState.pipe(first()).toPromise();

        if (user) {
            this.setUser({
                username: user.email.split('@')[0],
                uid: user.uid,
                profilePic: user.uid
            });
            return true;
        }
        return false;
    }

    getUsers() {
        return this.afStore.collection(`users/${this.getUID()}/event`).snapshotChanges();
    }

    getProfilePic() {
        return this.user.profilePic;
    }

    getUsername() {
        return this.user.username;
    }

    getUID() {
        return this.user.uid;
    }
}
