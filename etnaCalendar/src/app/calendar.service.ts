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

    getEvents() {
        return this.afstore.collection(`users/${this.user.getUID()}/event`).snapshotChanges();
    }

    updateCalendarEvent(event) {
        return this.afstore.collection(`users/${this.user.getUID()}/event`)
       .doc(event.EID).set({ title: event.title,
                            desc: event.desc,
                            allDay: event.allDay,
                            endTime: event.endTime,
                            startTime: event.startTime,
                            publicEvent: event.publicEvent }, { merge: true });
    }



    updateCalendar(calendar) {
        return this.afstore.collection(`users/${this.user.getUID()}/event`)
       .doc(calendar.CID).set({ title: calendar.title,
                            desc: calendar.desc,
                            userList: calendar.userList,
                            adminList: calendar.adminList,
                            eventList: calendar.eventList
                         }, { merge: true });
    }

    getCalendars() {
        return this.afstore.collection(`calendars`).snapshotChanges();
    }

    addCalendar(calendar) {
        return new Promise<any>((resolve, reject) => {
            this.afstore
                .collection(`calendars`)
                .add(calendar)
                .then(res => {}, err => reject(err));
        });
    }

    removeCalendar(calendar) {
        return new Promise<any>((resolve, reject) => {
            this.afstore.collection(`calendar`)
            .doc(calendar.CID).delete();
        });
    }

    addEvent(event) {
        return new Promise<any>((resolve, reject) => {
            this.afstore
                .collection(`users/${this.user.getUID()}/event/`)
                .add(event)
                .then(res => {}, err => reject(err));
        });
    }

    removeEvent(event) {
        return new Promise<any>((resolve, reject) => {
            this.afstore.collection(`users/${this.user.getUID()}/event/`)
            .doc(event.EID).delete();
        });
        }

    setCalendar(calendar: Calendar) {
        this.calendar = calendar;
    }

    getCID() {
        return this.calendar.cId;
    }
}
