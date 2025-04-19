import { Events } from './events';
import { Status } from './status';

export class ParticipationEvents {
    idparticipant?: number;
    status!: Status;
    event!: Events;
    user?: { id: number; email: string }; // Match User entity
}