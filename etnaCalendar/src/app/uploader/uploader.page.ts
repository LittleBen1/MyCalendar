import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
@Injectable()
export class UploaderPage implements OnInit {

  imageURL: string;

  constructor(public httpClient: HttpClient) { }

  ngOnInit() {
  }

  fileChanged(event) {
    const file = event.target.files;

    const data = new FormData();
    console.log(file);
    data.append('file', file[0]);
    data.append('UPLOADCARE_STORE', '1');
    data.append('UPLOADCARE_PUB_KEY', 'aa5269afd5e8d07e0b9c');
    this.httpClient.post('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
      console.log(event['file']);
      this.imageURL = event['file'];
    });
  }

}
