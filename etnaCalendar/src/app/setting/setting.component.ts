import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { UserService } from '../user.service';
import { CalendarService } from '../calendar.service';


const btn = [{
      text: 'Ok',
      handler: 'set'
  },
  'cancel'
];

@Component({
  selector: 'app-settings',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingsComponent implements OnInit {
  page;


  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
    publicEvent: false,
    EID: ''
  };

  
  calendar = {
    title: '',
    desc: '',
    users: [],
    admins: [],
    CID: '',
    public: false
  };

  users;
  currentCalendarId;
  calendarUsers;

  constructor(
    private events: Events,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private userService: UserService,
    private calendarService: CalendarService) {

  }

  ngOnInit() {
    //Get data from popover page
    this.page = this.navParams.get('page');
    this.currentCalendarId = this.navParams.get('calendarId');
    console.log(this.page);
    let tempUsers;
    
    if (this.page ==='addUser') {
        this.userService.getUsers().subscribe(res => { this.users = res});
     
      console.log(this.users);
    }
  }

  addUser(index) {
    this.calendarService.addUserToCalendar(this.users[index].payload.doc.id,this.currentCalendarId);
    if (index !== -1)
    {
      this.users.splice(index, 1);
    }
  }

  refresh() {
    this.userService.getUsers().subscribe(res => {this.users = res; console.log(this.users)} );
  }

  async addNewCalendar() {
    

    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        calendar : this.calendar
      }
    });
    modal.present();
    this.popoverController.dismiss();
  }

  async addNewEvent() {
      const modal = await this.modalController.create({
        component: ModalPage,
        componentProps: {
          event : this.event
        }
      });
      modal.present();
   this.popoverController.dismiss();
  }

close (){
  this.popoverController.dismiss();
}

  eventFromPopover() {
    this.events.publish('fromPopoverEvent');
    this.popoverController.dismiss();
  }
}
