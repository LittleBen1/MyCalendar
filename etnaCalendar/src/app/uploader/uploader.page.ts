import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
@Injectable()
export class UploaderPage implements OnInit {

  imageURL: string;
  busy: boolean = false;

  @ViewChild('fileButton', {static: true}) fileButton;

  constructor(public httpClient: HttpClient,
              public afstore: AngularFirestore,
              public user: UserService,
              private afAuth: AngularFireAuth,
              private alert: AlertController,
              private router: Router) { }

  ngOnInit() {
  }

 

  async fileChanged(event) {
    this.busy = true;
    const file = event.target.files;

    const data = new FormData();
    console.log(file);
    data.append('file', file[0]);
    data.append('UPLOADCARE_STORE', '1');
    data.append('UPLOADCARE_PUB_KEY', 'aa5269afd5e8d07e0b9c');
    this.httpClient.post('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
      /* tslint:disable:no-string-literal */
      console.log(event['file']);
      this.imageURL = event['file'];
    });


    this.changeProfilePic();
    this.busy = false;
    this.imageURL = '';

    const alert = await this.alert.create({
      header: 'Done',
      message: 'Your photo was sent to our servers',
      buttons: ['Ok']

    });
    await alert.present();
    this.router.navigate(['tabs/profile']);
  }

  changeProfilePic() {
    const image = this.imageURL;
    // debugger;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      profilePic: firestore.FieldValue.arrayUnion({
        image
      })
    });
  }

}
