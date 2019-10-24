import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';


@Injectable()
export class EventTransferService {
    

    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;

    constructor() { }

    onFirstComponentButtonClick(calendarChecked) {
        this.invokeFirstComponentFunction.emit(calendarChecked);
    }

}