import { Injectable } from '@angular/core';

// tslint:disable-next-line: class-name
interface Calendar {
    events: [];
    cId: string;
}

@Injectable()
export class CalendarService {
    private calendar: Calendar;
    constructor() {

    }

    getEvents(){
        return this.calendar.events;
    }

    addEvent(event) {
        //this.calendar.events.push(event);
    }

    removeEvent(event) {
        //const index: number = this.calendar.events.indexOf(event);
        //if (index !== -1){
       //     this.calendar.events.splice(index, 1);
      //  }
        }

    setCalendar(calendar: Calendar) {
        this.calendar = calendar;
    }

    getCID() {
        return this.calendar.cId;
    }
}
