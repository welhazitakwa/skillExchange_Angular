import { Events } from "./events";


export class EventComment {
    idComment!: number;
    content!: string;
    date!: Date;
    idUser!: number;
    event!: Events;
}