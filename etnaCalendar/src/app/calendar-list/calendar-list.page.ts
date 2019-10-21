import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Calendar } from '../calendar.model';
import { CalendarPage } from '../calendar/calendar.page'
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.page.html',
  styleUrls: ['./calendar-list.page.scss'],
})
export class CalendarListPage implements OnInit {

  constructor(public calendarService: CalendarService, public user: UserService,
              private router: Router, private dataService: DataService) { }

  adminCalendars;
  userCalendars;
  calendarList;
  calendarChecked;

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
           ...e.payload.doc.data()
         };
     })
    });
    this.calendarList = combineLatest<any[]>(this.adminCalendars, this.userCalendars).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    )
    this.calendarService.getAllCalendars().subscribe(res => (this.calendarList = res));
    console.log(this.calendarList);
    console.log(this.userCalendars);
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

}



