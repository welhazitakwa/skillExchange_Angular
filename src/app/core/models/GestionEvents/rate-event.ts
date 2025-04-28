import { Events } from "./events";
import { User } from "../GestionUser/User";

export class RateEvent {
    idRate?: number; // Nullable for new ratings, non-null after saving
    content!: string;
    createdAt!: Date; // Always non-null, set by backend
    updatedAt!: Date; // Always non-null, set by backend
    rating!: number;
    user!: User;
    event!: Events;
}