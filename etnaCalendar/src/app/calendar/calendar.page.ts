import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
    publicEvent: false
  };

  minDate = new Date().toISOString();

  eventList = [];
  eventSource = [];

  calendar = {
    mode: 'week',
    currentDate: new Date()
  };

  viewTitle = '';

  @ViewChild(CalendarComponent, {static: true}) myCal: CalendarComponent;


  ngOnInit() {

    this.loadEvents();
  }


  // getEventList(): firebase.firestore.CollectionReference {
  //   return this.eventListRef;
  // }

  async loadEvents() {
    (await this.eventService.getEvents()).subscribe(res => (this.eventList = res));
    console.log(this.eventList);
    for (const event of this.eventList) {
      console.log(event.payload.doc.data().startTime.toDate());
      const eventCopy  = {
        title: event.payload.doc.data().title,
        desc: event.payload.doc.data().desc,
        startTime: new Date(event.payload.doc.data().startTime.toDate()),
        endTime: new Date(event.payload.doc.data().endTime.toDate()),
        allDay: event.payload.doc.data().allDay,
        publicEvent: event.payload.doc.data().publicEvent
      };
      this.eventSource.push(eventCopy);
   
      // debugger;
    }
    this.myCal.loadEvents();
    this.resetEvent();
  }
    // let getDoc = ref.get().toPromise()
    // .then(doc => {
    //   if (!doc.exists) {
    //     console.log('No Such Document');
    //   }
    //   else {
    //     console.log('Document data: ', doc.data());
    //   }
    // }).catch(err => {
    //   console.log('Error getting document ', err);
    // });
    //  //this.eventSource.push(eventCopy);
    // // this.myCal.loadEvents();
    // this.resetEvent();


  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      publicEvent: false,
    };
  }

  async onEventSelected(event) {
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['Ok']
    });
    alert.present();
  }

  addEvent() {
    const eventCopy  = {
      title: this.event.title,
      desc: this.event.desc,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: false,
      publicEvent: false
    };

    if (eventCopy.allDay) {
      const start = eventCopy.startTime;
      const end = eventCopy.endTime;

      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    this.eventSource.push(eventCopy);

    this.loadEvents();
    this.myCal.loadEvents();
    this.createPost(eventCopy);
    this.resetEvent();

    console.log(this.eventSource);
    //debugger;
  }

  createPost(eventcopy) {
    const ref = this.afstore.collection(`users/${this.user.getUID()}/event/`);
    ref.add(eventcopy);
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    const selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  constructor(private alertCtrl: AlertController,
              @Inject(LOCALE_ID) private locale: string,
              public afstore: AngularFirestore,
              public user: UserService, public eventService: CalendarService) {
              //this.loadEvents();
              }
}
