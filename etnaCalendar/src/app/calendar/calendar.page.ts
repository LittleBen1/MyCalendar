import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { CalendarService } from '../calendar.service';
import { ModalPage } from '../modal/modal.page';

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
    publicEvent: false,
    EID: ''
  };

  fireCalendar = {
    title: '',
    desc: '',
    users: [],
    admins: [],
    CID: '',
    public: false
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
    console.log(this.minDate);
  }


  // getEventList(): firebase.firestore.CollectionReference {
  //   return this.eventListRef;
  // }

  loadEvents() {
    this.eventSource = [];
    this.eventService.getEvents().subscribe(res => (this.eventList = res));
    for (const event of this.eventList) {
      const eventCopy  = {
        title: event.payload.doc.data().title,
        desc: event.payload.doc.data().desc,
        startTime: new Date(event.payload.doc.data().startTime.toDate()),
        endTime: new Date(event.payload.doc.data().endTime.toDate()),
        allDay: event.payload.doc.data().allDay,
        publicEvent: event.payload.doc.data().publicEvent,
        EID: event.payload.doc.id
      };
      this.eventSource.push(eventCopy);
   
      // debugger;
    }
    this.myCal.loadEvents();
    //this.resetEvent();
  }

  addCalendar() {

    this.openCalendarModal();
  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      publicEvent: false,
      EID: '',
    };
  }

  async openEventModal(eventCopy) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        event : eventCopy
      }
    });
    modal.present();
  }

  async openCalendarModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        calendar : this.fireCalendar
      }
    });
    modal.present();
  }

  updateEvent(event) {
    this.openEventModal(event);
    this.eventService.updateCalendarEvent(event);
    this.loadEvents();
  }

  deleteEvent(event) {
    this.eventService.removeEvent(event);
    const index: number = this.eventSource.indexOf(event);
    if (index !== -1)
    {
      this.eventSource.splice(index, 1);
    }
    this.myCal.loadEvents();
  }

  async onEventSelected(event) {
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['Ok',  {
        text: 'Update',
        role: 'update',
        cssClass: 'secondary',
        handler: (blah) => {
          this.updateEvent(event);
        }}, {
        text: 'Delete',
        role: 'delete',
        cssClass: 'secondary',
        handler: (blah) => {
          this.deleteEvent(event);
        }} ]
    });
    alert.present();
  }

  async addEvent() {
    const eventCopy  = {
      title: this.event.title,
      desc: this.event.desc,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: false,
      publicEvent: false
    };
    console.log(eventCopy);
    if (eventCopy.allDay) {
      const start = eventCopy.startTime;
      const end = eventCopy.endTime;

      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
    if (eventCopy.endTime < eventCopy.startTime) {
      const alert = await this.alertCtrl.create({
        header: 'Warning',
        subHeader: 'Wrong date Input',
        message: 'Ending time is greater than starting date',
        buttons: ['Ok']
    });
      alert.present();
      
      return;
    }

    this.eventSource.push(eventCopy);

    this.loadEvents();
    this.myCal.loadEvents();
    this.createPost(eventCopy);
    this.resetEvent();

    console.log(eventCopy.startTime);
    //debugger;
  }

  createPost(eventCopy) {
    this.eventService.addEvent(eventCopy);
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
              public user: UserService, public eventService: CalendarService,
              public modalController: ModalController) {
              //this.loadEvents();
              }
}
