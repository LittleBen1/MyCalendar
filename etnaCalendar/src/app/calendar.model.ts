import {User} from "./user.model";
import {Event} from "./event.model";

export class Calendar {
    CID: string;
    users: User[];
    admins: User[];
    events: Event[];
    checked: false;
}