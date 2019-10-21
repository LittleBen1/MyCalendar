import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userPosts;
  user;

  constructor(private afs: AngularFirestore, private userService: UserService) {
    const posts = afs.doc(`users/${userService.getUID()}`);
    this.userPosts = posts.valueChanges();
    this.user = userService;
    console.log(this.user.getUsername());
  }

  ngOnInit() {
  }

}
