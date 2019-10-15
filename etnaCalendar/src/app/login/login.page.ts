import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  username = '';
  password = '';

  constructor(public afAuth: AngularFireAuth, public user: UserService, 
              public router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }

async login() {
  const { username, password } = this;
  try {
    const res = await this.afAuth.auth.signInWithEmailAndPassword(username + '@gmail.com', password);

    if (res.user) {
      this.user.setUser({
        username,
        uid: res.user.uid,
        profilePic: res.user.photoURL
      });
      this.router.navigate(['/tabs']);
    const toast = await this.toastController.create({
      message: 'Login Successful',
      duration: 2000
    });
    toast.present();
    }
  } catch (err) { 
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') { 
      const toast = await this.toastController.create({
        message: 'Your email and password combination is not correct',
        duration: 2000
      });
      toast.present();
    }
  }
}
}
