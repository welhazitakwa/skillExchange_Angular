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
  searchText: string = '';
  statusFilter: string = '';
  sortColumn: keyof Events = 'eventName';
  sortDirection: string = 'asc';
  isAddEventModalOpen: boolean = false;
  eventToEdit: Events | null = null;
  eventToDelete: Events | null = null;
  isEditEventModalOpen: boolean = false;

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEvents().subscribe(
      (data) => {
        console.log('Données des événements:', data);
        this.events = data;
      },
      (error) => {
        console.error('Erreur de chargement des événements', error);
      }
    );
  }

  applyFilters(): void {
    let filteredEvents = [...this.events]; // Copie du tableau original

    if (this.searchText) {
      filteredEvents = filteredEvents.filter(event =>
        event.eventName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    
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

  sort(column: keyof Events): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  // Ouvre la modale d'ajout d'événement
  openAddEventModal(): void {
    this.isAddEventModalOpen = true;
  }

  // Ferme la modale d'ajout d'événement
  closeAddEventModal(): void {
    this.isAddEventModalOpen = false;
  }

  // Fonction appelée quand le formulaire est soumis pour ajouter un événement
  handleAddEvent(eventData: any): void {
    console.log("Nouveau événement à ajouter :", eventData);
    this.eventsService.addEvent(eventData).subscribe({
      next: (newEvent) => {
        console.log("Événement ajouté :", newEvent);
        this.events.push(newEvent);        // Ajoute l'événement à la liste
        this.applyFilters();               // Réapplique les filtres si nécessaire
        this.closeAddEventModal();         // Ferme la modale
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de l'événement :", err);
      }
    });
  }

  // Ouvre le modal d'édition d'un événement
  openEditEventModal(event: Events): void {
    this.eventToEdit = event;
  }

  // Ouvre le modal de suppression d'un événement
  openDeleteEventModal(event: Events): void {
    this.eventToDelete = event;
  }

  

  // Fonction appelée lors de la mise à jour d'un événement
  handleEventUpdate(updatedEvent: Events): void {
    this.loadEvents(); // Recharger la liste des événements après la mise à jour
    this.eventToEdit = null; // Fermer le modal
  }

  // Fonction appelée lors de la suppression d'un événement
  handleEventDelete(): void {
    this.loadEvents(); // Recharger la liste après la suppression
    this.eventToDelete = null; // Fermer le modal
  }

  // Ferme le modal d'édition
  closeEditModal(): void {
    this.eventToEdit = null;
  }

  // Ferme le modal de suppression
  closeDeleteModal(): void {
    this.eventToDelete = null;
  }
}


