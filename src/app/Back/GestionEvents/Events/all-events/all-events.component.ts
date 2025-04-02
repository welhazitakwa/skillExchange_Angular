import { Component, OnInit } from '@angular/core';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {
  events: Events[] = [];
  searchText: string = '';  // Pour la recherche
  statusFilter: string = '';  // Pour le filtrage par statut (GOING, INTRESTED)
  sortColumn: keyof Events = 'eventName';  // Colonne à trier (ici une clé de l'objet Events)
  sortDirection: string = 'asc';  // Direction du tri (ascendant ou descendant)

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error('Erreur de chargement des événements', error);
      },
      () => {
        console.log('Chargement des événements terminé');
      }
    );
  }

  // Méthode de filtrage selon le texte et statut
  applyFilters(): void {
    let filteredEvents = this.events;

    // Filtrage par texte
    if (this.searchText) {
      filteredEvents = filteredEvents.filter(event =>
        event.eventName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // Filtrage par statut
    if (this.statusFilter) {
      filteredEvents = filteredEvents.filter(event => event.status === this.statusFilter);
    }

    // Appliquer le tri si une colonne est spécifiée
    if (this.sortColumn) {
      filteredEvents.sort((a, b) => {
        const valA = a[this.sortColumn];
        const valB = b[this.sortColumn];

        if (this.sortDirection === 'asc') {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      });
    }

    this.events = filteredEvents;
  }

  // Méthode pour trier les événements par colonne
  sort(column: keyof Events): void {
    if (this.sortColumn === column) {
      // Inverser la direction si on clique sur la même colonne
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Sinon, trier par la nouvelle colonne en ordre croissant
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applyFilters(); // Appliquer les filtres après le tri
  }
}
