 
import { ParticipationEvents } from "./participation-events";
import { RateEvent } from "./rate-event";
import { EventComment } from "./event-comment";
import { EventImage } from "./event-image";
import { User } from "../GestionUser/User";
import { Status } from "./status";

export class Events {
    idEvent!: number;
    eventName!: string;
    description!: string;
    startDate!: Date;
    endDate!: Date;
    place!: string;
    nbr_max!: number;
    status?: Status; // Changed from status!: Status to allow undefined
    user!: User;
    participationEvents?: ParticipationEvents[];
    rateEvents!: RateEvent[];
    eventComments!: EventComment[];
    images?: { idImage?: number; images: string }[];
    

}