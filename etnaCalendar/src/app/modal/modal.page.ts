import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { CalendarService } from '../calendar.service';
import { UserService } from '../user.service';

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

  ngOnInit() {
    this.event = this.navParams.get('event');
    if (this.event != null) {
    this.event.startTime = this.event.startTime.toISOString();
    this.event.endTime = this.event.endTime.toISOString();    
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
    console.log(eventCopy);
    console.log(this.userService.getUID());
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
    this.calendarService.addEvent(eventCopy);
     this.closeModal();

    console.log(eventCopy.startTime);
    //debugger;
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
