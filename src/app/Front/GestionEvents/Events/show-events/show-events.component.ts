import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { ParticipationEventsService } from 'src/app/core/services/GestionEvents/participation-events.service';
import { Status } from 'src/app/core/models/GestionEvents/status';
import { ParticipationEvents } from 'src/app/core/models/GestionEvents/participation-events';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-showevents',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {
  events: Events[] = [];
  filteredEvents: Events[] = [];
  searchQuery: string = '';
  locationFilter: string = 'all';
  locationSearch: string = '';
  filteredPlaces: string[] = [];
  dateFilter: string = 'any';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  showLocationSearch: boolean = false;
  showDatePicker: boolean = false;
  Status = Status;
  carouselIndices: { [eventId: number]: number } = {};
  showCalendar: boolean = false;
  calendarOptions: CalendarOptions;
  userEmail: string = '';
  participations: ParticipationEvents[] = [];
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  constructor(
    private eventService: EventsService,
    private participationService: ParticipationEventsService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      events: [],
      eventColor: '#007bff',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      eventClick: this.handleEventClick.bind(this),
      height: 'auto',
      eventDidMount: (info) => {
        const tooltipContent = `
          <strong>${info.event.title}</strong><br>
          Place: ${info.event.extendedProps['place'] || 'N/A'}<br>
          Date: ${info.event.start ? new Date(info.event.start).toLocaleDateString('fr-FR') : 'N/A'}<br>
          Participants: ${info.event.extendedProps['nbr_max'] || 'N/A'}
        `;
        info.el.setAttribute('title', tooltipContent.replace(/<br>/g, '\n'));
      }
    };
  }

  ngOnInit() {
    this.userEmail = this.authService.getCurrentUserEmail() || '';
    console.log('Logged-in user email:', this.userEmail);
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        // Initialize events with default status
        this.events = events.map(event => ({
          ...event,
          status: Status.NOT_ATTENDING, // Default status
          images: event.images ? event.images.map(img => ({
            ...img,
            images: img.images || ''
          })) : []
        }));
        this.events.forEach(event => {
          this.carouselIndices[event.idEvent] = 0;
        });
        // Update filteredEvents to ensure consistency
        this.filteredEvents = [...this.events];
        this.updatePlaces();
        this.updatePagination();
        // Load user participations after events are loaded
        this.loadUserParticipations();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.snackBar.open('Failed to load events. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }

  loadUserParticipations(): void {
    if (!this.userEmail) {
      console.warn('No authenticated user found');
      this.events = this.events.map(event => ({
        ...event,
        status: Status.NOT_ATTENDING
      }));
      this.filteredEvents = [...this.events];
      this.updatePagination();
      this.filterEvents();
      this.cdr.detectChanges();
      return;
    }

    this.participationService.getParticipationsByUserEmail(this.userEmail).subscribe({
      next: (participations) => {
        console.log('Participations loaded:', participations);
        // Update event statuses based on participations
        const updatedEvents = this.events.map(event => {
          const match = participations.find(p => p.event?.idEvent === event.idEvent);
          const status = match ? match.status : Status.NOT_ATTENDING;
          console.log(`Event ${event.idEvent} status: ${status}`);
          return {
            ...event,
            status
          };
        });

        // Update both events and filteredEvents
        this.events = [...updatedEvents];
        this.filteredEvents = [...updatedEvents];
        this.updatePagination();
        this.filterEvents();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading user participations:', error);
        // Log specific error details
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error
        });
        // Fallback: keep existing events without resetting statuses
        this.filteredEvents = [...this.events];
        this.updatePagination();
        this.filterEvents();
        this.snackBar.open('Failed to load participations. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  updatePlaces(): void {
    this.filteredPlaces = [...new Set(this.events.map(event => event.place).filter(place => place))] as string[];
  }

  filterLocations(): void {
    const query = this.locationSearch.toLowerCase().trim();
    this.filteredPlaces = [...new Set(this.events.map(event => event.place).filter(place => 
      place && place.toLowerCase().includes(query)
    ))] as string[];
  }

  openLocationSearch(): void {
    console.log('Opening location search panel');
    this.showLocationSearch = true;
    this.locationSearch = '';
    this.filterLocations();
  }

  selectLocation(place: string): void {
    console.log('Selected location:', place);
    this.locationFilter = place;
    this.showLocationSearch = false;
    this.filterEvents();
  }

  openDatePicker(): void {
    console.log('Opening date picker panel');
    this.showDatePicker = true;
    this.dateFilter = 'custom';
  }

  logDateChange(): void {
    console.log('Date changed:', {
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate
    });
  }

  filterEvents(): void {
    console.log('Filtering events with:', {
      searchQuery: this.searchQuery,
      locationFilter: this.locationFilter,
      dateFilter: this.dateFilter,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate
    });

    let tempEvents = [...this.events];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      tempEvents = tempEvents.filter(event =>
        (event.eventName?.toLowerCase().includes(query) ||
         event.place?.toLowerCase().includes(query) ||
         event.description?.toLowerCase().includes(query))
      );
    }

    if (this.locationFilter !== 'all' && this.locationFilter !== 'search') {
      tempEvents = tempEvents.filter(event => 
        event.place?.toLowerCase() === this.locationFilter.toLowerCase()
      );
    }

    if (this.dateFilter !== 'any') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      let startDate: Date;
      let endDate: Date;

      switch (this.dateFilter) {
        case 'today':
          startDate = now;
          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'tomorrow':
          startDate = new Date(now);
          startDate.setDate(now.getDate() + 1);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'this-weekend':
          const dayOfWeek = now.getDay();
          startDate = new Date(now);
          startDate.setDate(now.getDate() + (5 - dayOfWeek));
          endDate = new Date(now);
          endDate.setDate(now.getDate() + (7 - dayOfWeek));
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'this-week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay() + 1);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'next-week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay() + 8);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'custom':
          if (this.customStartDate && this.customEndDate && this.customStartDate <= this.customEndDate) {
            startDate = new Date(this.customStartDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(this.customEndDate);
            endDate.setHours(23, 59, 59, 999);
          } else {
            console.warn('Invalid custom date range:', this.customStartDate, this.customEndDate);
            startDate = new Date(0);
            endDate = new Date();
          }
          break;
        default:
          startDate = new Date(0);
          endDate = new Date(9999, 11, 31);
      }

      tempEvents = tempEvents.filter(event => {
        const eventStart = event.startDate ? new Date(event.startDate) : null;
        const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
        if (eventStart && eventEnd) {
          return eventStart <= endDate && eventEnd >= startDate;
        }
        return false;
      });
    }

    this.filteredEvents = tempEvents;
    this.currentPage = 1; // Reset to first page on filter change
    this.updatePagination();
    this.updateCalendarEvents();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
  }

  get paginatedEvents(): Events[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEvents.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  onDateFilterChange(): void {
    console.log('Date filter changed to:', this.dateFilter);
    if (this.dateFilter !== 'custom') {
      this.customStartDate = null;
      this.customEndDate = null;
      this.showDatePicker = false;
      this.filterEvents();
    }
  }

  applyCustomDate(): void {
    console.log('Applying custom date range:', this.customStartDate, this.customEndDate);
    if (this.customStartDate && this.customEndDate && this.customStartDate <= this.customEndDate) {
      this.showDatePicker = false;
      this.filterEvents();
    } else {
      console.warn('Cannot apply invalid date range:', this.customStartDate, this.customEndDate);
    }
  }

  toggleEvent(event: Events, status: Status, $event: Event): void {
    $event.stopPropagation();
    const userEmail = this.authService.getCurrentUserEmail();
    if (!userEmail) {
      this.snackBar.open('You must be logged in to participate in an event.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    console.log('Current event status:', event.status);
    const newStatus = event.status === status ? Status.NOT_ATTENDING : status;
    console.log(`Toggling event ${event.idEvent} from status ${event.status} to ${newStatus}`);

    this.participationService.participateInEvent(event.idEvent, newStatus).subscribe({
      next: (response) => {
        console.log('Participation updated successfully:', response);
        event.status = newStatus;
        // Ensure filteredEvents reflects the updated status
        this.filteredEvents = this.filteredEvents.map(e =>
          e.idEvent === event.idEvent ? { ...e, status: newStatus } : e
        );
        this.updatePagination();
        this.filterEvents();
        this.cdr.detectChanges();
        if (newStatus === Status.GOING || newStatus === Status.INTERESTED) {
          this.snackBar.open(`Successfully registered for ${event.eventName}!`, 'Close', { duration: 5000 });
        } else {
          this.snackBar.open(`You have canceled your participation in ${event.eventName}.`, 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        console.error('Error updating participation:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error
        });
        let errorMessage = 'Failed to update participation. Please try again.';
        if (error.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
          this.router.navigate(['/login']);
        } else if (error.status === 404) {
          errorMessage = 'Event or user not found.';
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  prevImage(eventId: number, $event: Event): void {
    $event.stopPropagation();
    const event = this.events.find(e => e.idEvent === eventId);
    if (event && event.images && event.images.length > 0) {
      this.carouselIndices[eventId] = Math.max(0, this.carouselIndices[eventId] - 1);
    }
  }

  nextImage(eventId: number, $event: Event): void {
    $event.stopPropagation();
    const event = this.events.find(e => e.idEvent === eventId);
    if (event && event.images && event.images.length > 0) {
      this.carouselIndices[eventId] = Math.min(event.images.length - 1, this.carouselIndices[eventId] + 1);
    }
  }

  goToEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.updateCalendarEvents();
    }
  }

  updateCalendarEvents(): void {
    const calendarEvents: EventInput[] = this.filteredEvents
      .filter(event => event.startDate)
      .map(event => ({
        title: event.eventName || 'Unnamed Event',
        start: event.startDate,
        end: event.endDate || event.startDate,
        extendedProps: {
          place: event.place,
          nbr_max: event.nbr_max,
          description: event.description,
          idEvent: event.idEvent
        }
      }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: calendarEvents
    };
  }

  handleEventClick(info: any): void {
    const event = info.event;
    this.router.navigate(['/events', event.extendedProps.idEvent]);
  }

  handleImageError(event: Event): void {
    console.warn('Image failed to load:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/assetsFront/img/course-1.jpg';
  }

  resetFilters(): void {
    console.log('Resetting filters');
    this.searchQuery = '';
    this.locationFilter = 'all';
    this.dateFilter = 'any';
    this.customStartDate = null;
    this.customEndDate = null;
    this.showLocationSearch = false;
    this.showDatePicker = false;
    this.currentPage = 1;
    this.filterEvents();
  }
}