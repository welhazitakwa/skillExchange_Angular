import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';

@Component({
  selector: 'app-delete-event',
  templateUrl: './delete-events.component.html',
  styleUrls: ['./delete-events.component.css']
})
export class DeleteEventsComponent {
  @Input() eventToDelete: Events | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  constructor(private eventsService: EventsService) {}

  delete(): void {
    if (this.eventToDelete) {
      this.eventsService.deleteEvent(this.eventToDelete.idEvent).subscribe(
        () => {
          this.onDelete.emit(); // Émettre l'événement de suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'événement', error);
        }
      );
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
