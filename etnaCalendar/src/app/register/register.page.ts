import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

username = '';
password = '';
cpassword = '';

  constructor(public afAuth: AngularFireAuth, public alert: AlertController, public router: Router) { }

  ngOnInit() {
  }

  async register() {
    const { username, password, cpassword} = this;
    if (password !== cpassword) {
      this.showAlert('Error!', 'Passwords don\'t match');
      return console.log('Passwords don\'t match');
    }
    try {
    const res = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@pomail.com', password);
    console.log(res);
    this.showAlert('Success!', 'Welcome aboard');
    this.router.navigate(['/tabs']);
    } catch (error) {
      console.dir(error);
      this.showAlert('Error', error.message);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
