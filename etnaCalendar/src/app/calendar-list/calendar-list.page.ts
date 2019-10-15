import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Calendar } from '../calendar.model';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.page.html',
  styleUrls: ['./calendar-list.page.scss'],
})
export class CalendarListPage implements OnInit {

  constructor(public calendarService: CalendarService, public user: UserService) { }

  adminCalendars;
  userCalendars;
  calendarList;

  ngOnInit() {
    
   
     this.calendarService.getCalendarForAdmin(this.user).subscribe(res => {this.adminCalendars = res.map(
      e => {
        return {
          CID : e.payload.doc.id,
          ...e.payload.doc.data()
        } as Calendar;
    })
  });
     this.calendarService.getCalendarForUser(this.user).subscribe(res => {this.userCalendars = res.map(
       e => {
         return {
           CID : e.payload.doc.id,
           ...e.payload.doc.data()
         } as Calendar;
     })
    });
    this.calendarList = combineLatest<any[]>(this.adminCalendars, this.userCalendars).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    )
    this.calendarService.getAllCalendars().subscribe(res => (this.calendarList = res));
    console.log(this.calendarList);
    console.log(this.userCalendars);
    //debugger;
  }



}
