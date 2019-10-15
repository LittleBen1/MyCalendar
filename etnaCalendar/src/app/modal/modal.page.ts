import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { CalendarService } from '../calendar.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  constructor(private navParams: NavParams, private modalController: ModalController, 
    private calendarService: CalendarService, private userService: UserService) { }

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

  sendEventData() {
    this.event.startTime = new Date(this.event.startTime);
    this.event.endTime = new Date(this.event.endTime);
    this.calendarService.updateCalendarEvent(this.event);
    this.closeModal();
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
