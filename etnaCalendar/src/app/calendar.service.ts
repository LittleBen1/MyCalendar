import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Event } from './event.model';

// tslint:disable-next-line: class-name
interface Calendar {
    events: [];
    cId: string;
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

    getEventsFromCalendarID(id: string) {
        return this.afstore.collection(`calendars/${id}/events`).snapshotChanges();
    }

    getCalendarById(id:string) {
        return this.afstore.collection('calendars', ref => ref.where("calendars",'array-contains',id)).snapshotChanges();
    }

    getCalendarForUser(user) {
        return this.afstore.collection(`calendars`, ref => ref.where("users","array-contains",`${this.user.getUID()}`)).snapshotChanges();
    }

    getAllCalendars() {
        return this.afstore.collection('calendars').snapshotChanges();
    }

    getCalendarForAdmin(user) {
        return this.afstore.collection(`calendars`, ref => ref.where(`admins`,"array-contains",`${this.user.getUID()}`)).snapshotChanges();
    }

    addCalendar(calendar) {
        return new Promise<any>((resolve, reject) => {
            this.afstore
                .collection('calendars')
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

    addEventToCalendar(event, CID) {
        return new Promise<any>((resolve, reject) => {
            this.afstore
                .collection(`calendars/${CID}/events/`)
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
