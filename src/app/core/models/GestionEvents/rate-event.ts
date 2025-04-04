import { Events } from "./events";

export class RateEvent {
    idRate!: number; 
    content!: string;
    createdAt!: Date;
    updatedAt!: Date;
    rating!: number;
    idUser!: number;
    event!: Events;
}
