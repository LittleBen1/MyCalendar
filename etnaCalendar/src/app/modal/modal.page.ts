import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { CalendarService } from '../calendar.service';
import { UserService } from '../user.service';
import { Calendar } from '../calendar.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  constructor(private navParams: NavParams, private modalController: ModalController, 
    private calendarService: CalendarService, private userService: UserService, private alertCtrl: AlertController) { }

  minDate = new Date().toISOString();
  event = null;
  calendar = null;
  users = null;
  adminCalendars = null;
  CID: any;
  personalCalendar = false;

  ngOnInit() {
    this.event = this.navParams.get('event');
    if (this.event != null) {
      if (this.event.startTime == null || this.event.endTime == null){
        this.event.startTime = this.event.startTime.toISOString();
        this.event.endTime = this.event.endTime.toISOString();
      }
      this.calendarService.getCalendarForAdmin(this.userService).subscribe(res => {this.adminCalendars = res.map(
        e => {
          return {
            id : e.payload.doc.id,
            ...e.payload.doc.data()
          };
      });
      console.log(this.adminCalendars);
    });

    
    }
    this.calendar = this.navParams.get('calendar');

    if (this.calendar != null) {
      this.users = this.userService.getUsers();
      console.log(this.users);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  refresh() {
     this.userService.getUsers().subscribe(res => {console.log(res); this.users = res; }, error => console.log(error));
     debugger;
     console.log('Users: ' + this.users);
  }

  updateEventData() {
    this.event.startTime = new Date(this.event.startTime);
    this.event.endTime = new Date(this.event.endTime);
    this.calendarService.updateCalendarEvent(this.event);
    this.closeModal();
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

    // this.eventSource.push(eventCopy);

    // this.loadEvents();
    // this.myCal.loadEvents();
    console.log(this.CID);
    console.log(this.personalCalendar);
    if (this.personalCalendar)
      this.calendarService.addEvent(eventCopy);
    else
      this.calendarService.addEventToCalendar(eventCopy, this.CID)
      
    this.closeModal();

    //debugger;
  }

  onChangeHandler(data) {
    this.CID = data;
  }

  sendCalendarData() {
    this.calendar.admins.push(this.userService.getUID());
    debugger;
    this.calendarService.addCalendar(this.calendar);
    this.closeModal();
  }

  addUserToCalendar(user) {
    if (this.calendar == null){
      return;
    }
    this.calendar.users.add(user);

  }

}
