import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';


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

  constructor(
    private events: Events,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private modalController: ModalController) {

  }

  ngOnInit() {
    //Get data from popover page
    this.page = this.navParams.get('data');
  }

  async addNewCalendar() {
    

    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        event : this.event
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
