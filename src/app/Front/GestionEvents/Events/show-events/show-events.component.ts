import { Component, OnInit } from '@angular/core';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { ParticipationEventsService } from 'src/app/core/services/GestionEvents/participation-events.service';
import { Status } from 'src/app/core/models/GestionEvents/status';
import { ParticipationEvents } from 'src/app/core/models/GestionEvents/participation-events';

@Component({
  selector: 'app-showevents',
  templateUrl: 'show-events.component.html', 
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {

  events: Events[] = [];
  Status = Status; // Ajout pour pouvoir utiliser Status dans le template HTML

  constructor(
    private eventService: EventsService,
    private participationService: ParticipationEventsService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (events) => {
        this.events = events;
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements', error);
      }
    );
  }

  participate(event: Events, status: Status): void {
    const participation: ParticipationEvents = {
      event: event,
      status: status
    };
    

   
  console.log('Participating in event:', event, 'with status:', status);  // Vérification dans la console

  this.participationService.addParticipation(participation).subscribe(
    (response) => {
      console.log('Participation ajoutée avec succès:', response);  // Vérification de la réponse
      // Peut-être ajouter ici du code pour mettre à jour l'interface utilisateur après une participation réussie
    },
    (error) => {
      console.error('Erreur lors de l’ajout de la participation', error);  // Vérification des erreurs
    }
  );
}
}