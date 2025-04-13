import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { ParticipationEventsService } from 'src/app/core/services/GestionEvents/participation-events.service';
import { Status } from 'src/app/core/models/GestionEvents/status';
import { ParticipationEvents } from 'src/app/core/models/GestionEvents/participation-events';

@Component({
  selector: 'app-showevents',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {
  events: Events[] = [];
  Status = Status;
  carouselIndices: { [eventId: number]: number } = {};

  constructor(
    private eventService: EventsService,
    private participationService: ParticipationEventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (events) => {
        this.events = events;
        this.events.forEach(event => {
          this.carouselIndices[event.idEvent] = 0;
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements', error);
      }
    );
  }

  participate(event: Events, status: Status, $event: Event): void {
    $event.stopPropagation(); // Prevent card click from triggering navigation
    const participation: ParticipationEvents = {
      event: event,
      status: status
    };

    console.log('Participating in event:', event, 'with status:', status);

    this.participationService.addParticipation(participation).subscribe(
      (response) => {
        console.log('Participation ajoutée avec succès:', response);
      },
      (error) => {
        console.error('Erreur lors de l’ajout de la participation', error);
      }
    );
  }

  prevImage(eventId: number, $event: Event): void {
    $event.stopPropagation(); // Prevent card click
    const event = this.events.find(e => e.idEvent === eventId);
    if (event && event.images && event.images.length > 0) {
      this.carouselIndices[eventId] = Math.max(0, this.carouselIndices[eventId] - 1);
    }
  }

  nextImage(eventId: number, $event: Event): void {
    $event.stopPropagation(); // Prevent card click
    const event = this.events.find(e => e.idEvent === eventId);
    if (event && event.images && event.images.length > 0) {
      this.carouselIndices[eventId] = Math.min(event.images.length - 1, this.carouselIndices[eventId] + 1);
    }
  }

  goToEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }
}