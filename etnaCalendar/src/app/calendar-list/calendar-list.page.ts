import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SettingsComponent } from '../setting/setting.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.page.html',
  styleUrls: ['./calendar-list.page.scss'],
})
export class CalendarListPage implements OnInit {

  constructor(public calendarService: CalendarService, public user: UserService,
              private router: Router, private dataService: DataService, 
              private popoverController: PopoverController) { }

  adminCalendars;
  userCalendars;
  calendarList;
  calendarChecked;
  calendarSubscribers;

  ngOnInit() {
     this.calendarService.getCalendarForAdmin(this.user).subscribe(res => {this.adminCalendars = res.map(
      e => {
        return {
          id : e.payload.doc.id,
          ...e.payload.doc.data()
        };
    })
  });
     this.calendarService.getCalendarForUser(this.user).subscribe(res => {this.userCalendars = res.map(
       e => {
         return {
           id : e.payload.doc.id,
           users: e.payload.doc.data(),
           ...e.payload.doc.data()
           
         };
     })
    });
    this.calendarList = combineLatest<any[]>(this.adminCalendars, this.userCalendars).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    )
    this.calendarService.getAllCalendars().subscribe(res => (this.calendarList = res));
  }
  test() {
    console.log("clicked on test")
  }
  deleteCalendar(index) {
    console.log(this.adminCalendars[index]);
    this.calendarService.removeCalendar(this.adminCalendars[index]);
  }

  showCalendars() {
    this.dataService.setData([]);
    this.calendarChecked = [];
   this.adminCalendars.forEach(element => {
     if (element.checked)
     this.calendarChecked.push(element.id);
   });
   this.userCalendars.forEach(element => {
     if (element.checked)
     this.calendarChecked.push(element.id);
   });
    console.log(this.calendarChecked);
    this.dataService.setData(this.calendarChecked);
    this.router.navigateByUrl('tabs/calendar');
  }

  async addUser(i){
      const popover = await this.popoverController.create({
        component: SettingsComponent,
        componentProps: { page: 'addUser', calendarId: this.adminCalendars[i].id },
        cssClass: 'popover_class',
      });
      return await popover.present();
    }
}



