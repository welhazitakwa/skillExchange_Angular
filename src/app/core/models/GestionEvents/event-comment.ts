import { Events } from "./events";
import { User } from "../GestionUser/User";

export class EventComment {
    idComment?: number;
    content!: string;
    date!: Date;
    email!: string;
    user?: User;
    event!: Events;
    parentComment?: EventComment;
    replies?: EventComment[];
}