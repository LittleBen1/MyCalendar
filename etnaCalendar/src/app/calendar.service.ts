import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';

// tslint:disable-next-line: class-name
interface Calendar {
    events: [];
    cId: string;
}

interface Event {
    
}

@Injectable()
export class CalendarService {
    private calendar: Calendar;
    constructor(public afstore: AngularFirestore,
                public user: UserService) {

    }

    async getEvents() {
        return await this.afstore.collection(`users/${this.user.getUID()}/event`).snapshotChanges();
    }

    updateCalendarEvent(data) {
        return null;
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
