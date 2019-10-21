import { Component, Inject, LOCALE_ID, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { CalendarService } from '../calendar.service';
import { ModalPage } from '../modal/modal.page';
import { SettingsComponent } from '../setting/setting.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from '../event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage implements OnInit {

  //@Output() change = new EventEmitter();

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
  checkedCalendar = [];

  calendar = {
    mode: 'week',
    currentDate: new Date()
  };

  viewTitle = '';

  @ViewChild(CalendarComponent, {static: true}) myCal: CalendarComponent;


  ngOnInit() {  
    this.fetchAndDisplayData();
  }


  // getEventList(): firebase.firestore.CollectionReference {
  //   return this.eventListRef;
  // }

  loadCalendars(calendars: string[]) {
   if (this.activatedRoute.snapshot.data['special']) {
    this.checkedCalendar = this.activatedRoute.snapshot.data['special'];
  }
  if (this.checkedCalendar.length > 0){
    for (let i = 0; i <  this.checkedCalendar[0].length; i++) {
      this.eventService.getEventsFromCalendarID(this.checkedCalendar[0][i]).subscribe(res =>  {
        this.convertFromResToEvents(res);
        this.myCal.loadEvents();
      });
      }
    }
  }

  convertFromResToEvents(res) {
    for (const event of res) {
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
    }
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(res =>{ 
      this.convertFromResToEvents(res);
      this.myCal.loadEvents();
    });
  }

  fetchAndDisplayData() {  
    this.eventSource = [];
    this.loadEvents();
    this.loadCalendars(this.checkedCalendar);
    console.log(this.checkedCalendar);
    console.log(this.eventSource);
    this.myCal.loadEvents();
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

  async openEventModal(eventCopy, operation) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        event : eventCopy,
        function: operation
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

  async presentPopover(ev: any) {
  const popover = await this.popoverController.create({
    component: SettingsComponent,
    event: ev,
    componentProps: { page: 'Login' },
    cssClass: 'popover_class',
  });
  return await popover.present();
}

  updateEvent(event) {
    this.openEventModal(event,'Update');
    this.eventService.updateCalendarEvent(event);
    this.fetchAndDisplayData();
  }

  deleteEvent(event) {
    this.eventService.removeEvent(event);
    const index: number = this.eventSource.indexOf(event);
    if (index !== -1)
    {
      this.eventSource.splice(index, 1);
    }
    console.log(this.eventSource);
    this.fetchAndDisplayData();
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
    this.openEventModal(event,"New");
    this.eventService.addEvent(event);
    this.fetchAndDisplayData();
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
              public modalController: ModalController, private popoverController: PopoverController,
              private router: Router, public activatedRoute : ActivatedRoute) {
              }
}
