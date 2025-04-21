import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { ParticipationEventsService } from 'src/app/core/services/GestionEvents/participation-events.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Events | null = null;
  carouselIndex: number = 0;
  goingCount: number = 0;
  interestedCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private participationService: ParticipationEventsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEvent(id);
      this.loadParticipationCounts(id);
    }
  }

  loadEvent(id: number): void {
    this.eventsService.getEventByID(id).subscribe(
      (event) => {
        this.event = event;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'événement', error);
      }
    );
  }

  loadParticipationCounts(id: number): void {
    // Fetch GOING count
    this.participationService.countByEventAndStatus(id, 'GOING').subscribe(
      (count) => {
        this.goingCount = count;
      },
      (error) => {
        console.error('Erreur lors de la récupération du nombre de GOING', error);
      }
    );

    // Fetch INTERESTED count
    this.participationService.countByEventAndStatus(id, 'INTERESTED').subscribe(
      (count) => {
        this.interestedCount = count;
      },
      (error) => {
        console.error('Erreur lors de la récupération du nombre de INTERESTED', error);
      }
    );
  }

  prevImage(): void {
    if (this.event && this.event.images && this.event.images.length > 0) {
      this.carouselIndex = Math.max(0, this.carouselIndex - 1);
    }
  }

  nextImage(): void {
    if (this.event && this.event.images && this.event.images.length > 0) {
      this.carouselIndex = Math.min(this.event.images.length - 1, this.carouselIndex + 1);
    }
  }
}