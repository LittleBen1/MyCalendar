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
    private eventService: CalendarService, private userService: UserService) { }

  minDate = new Date().toISOString();
  event = null;
  calendar = null;
    users = null;

  ngOnInit() {
    this.event = this.navParams.get('event');
    this.calendar = this.navParams.get('calendar');
    this.event.startTime = this.event.startTime.toISOString();
    this.event.endTime = this.event.endTime.toISOString();
    debugger;
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
    this.eventService.updateCalendarEvent(this.event);
    this.closeModal();
  }

  sendCalendarData() {
    this.calendar.users.add(this.userService.getUID);
    this.eventService.addCalendar(this.calendar);
    this.closeModal();
  }

  addUserToCalendar(user) {
    if (this.calendar == null){
      return;
    }
    this.calendar.users.add(user);

  }

}
