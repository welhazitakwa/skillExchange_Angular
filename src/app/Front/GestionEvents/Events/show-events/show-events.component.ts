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
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  userEmail: string | null = null;
  participations: ParticipationEvents[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  recommendedEventIds: number[] = [];
  showRecommendedOnly: boolean = false;
  isLoadingRecommendations: boolean = false;

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
    this.debugAuth();
    this.userEmail = this.authService.getCurrentUserEmail();
    console.log('ShowEventsComponent: Logged-in user email:', this.userEmail);
    if (!this.userEmail) {
      console.warn('ShowEventsComponent: No user email found. User may not be authenticated.');
      this.snackBar.open('Please log in to view your event participations.', 'Close', { duration: 5000 });
    }
    this.loadEvents();
  }

  debugAuth(): void {
    const token = localStorage.getItem('token');
    console.log('ShowEventsComponent: Debug: JWT token:', token);
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('ShowEventsComponent: Debug: Decoded JWT:', decoded);
        console.log('ShowEventsComponent: Debug: JWT sub (email):', decoded.sub);
      } catch (error) {
        console.error('ShowEventsComponent: Debug: Error decoding JWT:', error);
      }
    }
  }

  loadEvents(): void {
    console.log('ShowEventsComponent: Loading events');
    this.eventService.getEvents().subscribe({
      next: (events) => {
        console.log('ShowEventsComponent: Loaded events:', events);
        this.events = events.map(event => ({
          ...event,
          images: event.images ? event.images.map(img => ({
            ...img,
            images: img.images || ''
          })) : [],
          status: Status.NOT_ATTENDING
        }));
        this.events.forEach(event => {
          this.carouselIndices[event.idEvent] = 0;
        });
        this.filteredEvents = [...this.events];
        console.log('ShowEventsComponent: Initialized events with NOT_ATTENDING:', this.events.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
        this.updatePlaces();
        this.updatePagination();
        this.loadUserParticipations();
        this.loadRecommendations();
      },
      error: (error) => {
        console.error('ShowEventsComponent: Error loading events:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.snackBar.open('Failed to load events. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }

  loadRecommendations(): void {
    console.log('ShowEventsComponent: Starting loadRecommendations');
    if (!this.userEmail) {
      console.warn('ShowEventsComponent: No user email for recommendations');
      this.isLoadingRecommendations = false;
      this.recommendedEventIds = [];
      this.filterEvents();
      return;
    }
    this.isLoadingRecommendations = true;
    console.log('ShowEventsComponent: Fetching user history for:', this.userEmail);
    this.eventService.getUserHistory(this.userEmail).subscribe({
      next: (userEvents) => {
        console.log('ShowEventsComponent: User history loaded:', userEvents);
        this.eventService.getRecommendedEvents(this.events, userEvents).subscribe({
          next: (recommendedIds) => {
            console.log('ShowEventsComponent: Recommended event IDs:', recommendedIds);
            this.recommendedEventIds = recommendedIds;
            this.isLoadingRecommendations = false;
            this.cdr.detectChanges();
            this.filterEvents();
          },
          error: (error) => {
            console.error('ShowEventsComponent: Error fetching recommended events:', error);
            this.isLoadingRecommendations = false;
            this.recommendedEventIds = [];
            this.snackBar.open('Failed to load recommended events.', 'Close', { duration: 5000 });
            this.cdr.detectChanges();
            this.filterEvents();
          }
        });
      },
      error: (error) => {
        console.error('ShowEventsComponent: Error fetching user history:', error);
        this.isLoadingRecommendations = false;
        this.recommendedEventIds = [];
        this.snackBar.open('Failed to load user history.', 'Close', { duration: 5000 });
        this.cdr.detectChanges();
        this.filterEvents();
      }
    });
  }

  loadUserParticipations(): void {
    if (!this.userEmail) {
      console.warn('ShowEventsComponent: No authenticated user found. Setting all events to NOT_ATTENDING.');
      this.events = this.events.map(event => ({
        ...event,
        status: Status.NOT_ATTENDING
      }));
      this.filteredEvents = [...this.events];
      console.log('ShowEventsComponent: No user email, events set to NOT_ATTENDING:', this.events.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
      this.updatePagination();
      this.filterEvents();
      this.cdr.detectChanges();
      return;
    }

    console.log('ShowEventsComponent: Fetching participations for user:', this.userEmail);
    const requests = this.events.map(event =>
      this.participationService.getParticipationByUserAndEvent(this.userEmail!, event.idEvent).pipe(
        map(participation => ({
          eventId: event.idEvent,
          status: participation ? participation.status : Status.NOT_ATTENDING
        })),
        catchError(error => {
          console.error(`ShowEventsComponent: Error fetching participation for event ${event.idEvent} (${event.eventName}):`, {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          return of({ eventId: event.idEvent, status: Status.NOT_ATTENDING });
        })
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        console.log('ShowEventsComponent: Participations loaded:', results);
        this.events = this.events.map(event => {
          const result = results.find(r => r.eventId === event.idEvent);
          const status = result ? result.status : Status.NOT_ATTENDING;
          console.log(`ShowEventsComponent: Event ${event.idEvent} (${event.eventName}) status: ${status}`);
          return {
            ...event,
            status
          };
        });
        this.filteredEvents = [...this.events];
        this.participations = results
          .filter(r => r.status !== Status.NOT_ATTENDING)
          .map(r => ({
            event: { idEvent: r.eventId },
            status: r.status
          } as ParticipationEvents));
        console.log('ShowEventsComponent: Updated events:', this.events.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
        console.log('ShowEventsComponent: Updated participations:', this.participations);
        this.updatePagination();
        this.filterEvents();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ShowEventsComponent: Error loading participations:', error);
        this.events = this.events.map(event => ({
          ...event,
          status: Status.NOT_ATTENDING
        }));
        this.filteredEvents = [...this.events];
        console.log('ShowEventsComponent: Error, events set to NOT_ATTENDING:', this.events.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
        this.updatePagination();
        this.filterEvents();
        this.cdr.detectChanges();
        this.snackBar.open('Failed to load your event participations.', 'Close', { duration: 5000 });
      }
    });
  }

  updatePlaces(): void {
    this.filteredPlaces = [...new Set(this.events.map(event => event.place).filter(place => place))] as string[];
    console.log('ShowEventsComponent: Updated places:', this.filteredPlaces);
  }

  filterLocations(): void {
    const query = this.locationSearch.toLowerCase().trim();
    this.filteredPlaces = [...new Set(this.events.map(event => event.place).filter(place => 
      place && place.toLowerCase().includes(query)
    ))] as string[];
    console.log('ShowEventsComponent: Filtered places:', this.filteredPlaces);
  }

  openLocationSearch(): void {
    console.log('ShowEventsComponent: Opening location search panel');
    this.showLocationSearch = true;
    this.locationSearch = '';
    this.filterLocations();
  }

  selectLocation(place: string): void {
    console.log('ShowEventsComponent: Selected location:', place);
    this.locationFilter = place;
    this.showLocationSearch = false;
    this.filterEvents();
  }

  openDatePicker(): void {
    console.log('ShowEventsComponent: Opening date picker panel');
    this.showDatePicker = true;
    this.dateFilter = 'custom';
  }

  logDateChange(): void {
    console.log('ShowEventsComponent: Date changed:', {
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate
    });
  }

  filterEvents(): void {
    console.log('ShowEventsComponent: Filtering events with:', {
      searchQuery: this.searchQuery,
      locationFilter: this.locationFilter,
      dateFilter: this.dateFilter,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      showRecommendedOnly: this.showRecommendedOnly,
      recommendedEventIds: this.recommendedEventIds
    });

    let tempEvents = [...this.events];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      tempEvents = tempEvents.filter(event =>
        (event.eventName?.toLowerCase().includes(query) ||
         event.place?.toLowerCase().includes(query) ||
         event.description?.toLowerCase().includes(query))
      );
      console.log('ShowEventsComponent: After search filter:', tempEvents.map(e => ({ id: e.idEvent, name: e.eventName })));
    }

    if (this.locationFilter !== 'all' && this.locationFilter !== 'search') {
      tempEvents = tempEvents.filter(event => 
        event.place?.toLowerCase() === this.locationFilter.toLowerCase()
      );
      console.log('ShowEventsComponent: After location filter:', tempEvents.map(e => ({ id: e.idEvent, name: e.eventName })));
    }

    if (this.showRecommendedOnly) {
      if (this.recommendedEventIds.length === 0) {
        console.warn('ShowEventsComponent: No recommended event IDs available');
        tempEvents = [];
      } else {
        tempEvents = tempEvents.filter(e => this.recommendedEventIds.includes(e.idEvent));
      }
      console.log('ShowEventsComponent: After recommended filter:', tempEvents.map(e => ({ id: e.idEvent, name: e.eventName })));
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
            console.warn('ShowEventsComponent: Invalid custom date range:', this.customStartDate, this.customEndDate);
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
      console.log('ShowEventsComponent: After date filter:', tempEvents.map(e => ({ id: e.idEvent, name: e.eventName })));
    }

    this.filteredEvents = tempEvents;
    console.log('ShowEventsComponent: Final filtered events:', this.filteredEvents.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
    this.currentPage = 1;
    this.updatePagination();
    this.updateCalendarEvents();
    this.cdr.detectChanges();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    console.log('ShowEventsComponent: Updated pagination:', { currentPage: this.currentPage, totalPages: this.totalPages });
  }

  get paginatedEvents(): Events[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginated = this.filteredEvents.slice(start, end);
    console.log('ShowEventsComponent: Paginated events:', paginated.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
    return paginated;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
      console.log('ShowEventsComponent: Navigated to page:', page);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
      console.log('ShowEventsComponent: Navigated to previous page:', this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
      console.log('ShowEventsComponent: Navigated to next page:', this.currentPage);
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
    console.log('ShowEventsComponent: Page numbers:', pages);
    return pages;
  }

  onDateFilterChange(): void {
    console.log('ShowEventsComponent: Date filter changed to:', this.dateFilter);
    if (this.dateFilter !== 'custom') {
      this.customStartDate = null;
      this.customEndDate = null;
      this.showDatePicker = false;
      this.filterEvents();
    }
  }

  applyCustomDate(): void {
    console.log('ShowEventsComponent: Applying custom date range:', this.customStartDate, this.customEndDate);
    if (this.customStartDate && this.customEndDate && this.customStartDate <= this.customEndDate) {
      this.showDatePicker = false;
      this.filterEvents();
    } else {
      console.warn('ShowEventsComponent: Cannot apply invalid date range:', this.customStartDate, this.customEndDate);
    }
  }

  toggleEvent(event: Events, status: Status, $event: Event): void {
    $event.stopPropagation();
    if (!this.userEmail) {
      console.warn('ShowEventsComponent: No user email found for toggleEvent.');
      this.snackBar.open('You must be logged in to participate in an event.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    console.log('ShowEventsComponent: Toggling event:', {
      eventId: event.idEvent,
      eventName: event.eventName,
      currentStatus: event.status,
      newStatus: status
    });
    const newStatus = event.status === status ? Status.NOT_ATTENDING : status;
    this.participationService.participateInEvent(event.idEvent, newStatus).subscribe({
      next: (response) => {
        console.log('ShowEventsComponent: Participation response:', response);
        event.status = newStatus;
        this.events = this.events.map(e =>
          e.idEvent === event.idEvent ? { ...e, status: newStatus } : e
        );
        this.filteredEvents = this.filteredEvents.map(e =>
          e.idEvent === event.idEvent ? { ...e, status: newStatus } : e
        );
        this.participations = this.participations.filter(p => p.event?.idEvent !== event.idEvent);
        if (newStatus !== Status.NOT_ATTENDING) {
          this.participations.push({ event: { idEvent: event.idEvent }, status: newStatus } as ParticipationEvents);
        }
        console.log('ShowEventsComponent: Updated events after toggle:', this.events.map(e => ({ id: e.idEvent, name: e.eventName, status: e.status })));
        console.log('ShowEventsComponent: Updated participations after toggle:', this.participations);
        this.updatePagination();
        this.filterEvents();
        this.updateCalendarEvents();
        this.cdr.detectChanges();
        this.snackBar.open(
          newStatus === Status.NOT_ATTENDING
            ? `You have canceled your participation in ${event.eventName}.`
            : `Successfully registered for ${event.eventName} as ${newStatus}!`,
          'Close',
          { duration: 5000 }
        );
        // Reload recommendations after participation change
        this.loadRecommendations();
      },
      error: (error) => {
        console.error('ShowEventsComponent: Error updating participation:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
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
      console.log('ShowEventsComponent: Previous image for event:', eventId, 'index:', this.carouselIndices[eventId]);
    }
  }

  nextImage(eventId: number, $event: Event): void {
    $event.stopPropagation();
    const event = this.events.find(e => e.idEvent === eventId);
    if (event && event.images && event.images.length > 0) {
      this.carouselIndices[eventId] = Math.min(event.images.length - 1, this.carouselIndices[eventId] + 1);
      console.log('ShowEventsComponent: Next image for event:', eventId, 'index:', this.carouselIndices[eventId]);
    }
  }

  goToEventDetails(eventId: number): void {
    console.log('ShowEventsComponent: Navigating to event details:', eventId);
    this.router.navigate(['/events', eventId]);
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
    console.log('ShowEventsComponent: Toggling calendar:', this.showCalendar);
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
    console.log('ShowEventsComponent: Updated calendar events:', calendarEvents);
    this.calendarOptions = {
      ...this.calendarOptions,
      events: calendarEvents
    };
  }

  handleEventClick(info: any): void {
    const event = info.event;
    console.log('ShowEventsComponent: Calendar event clicked:', event.extendedProps.idEvent);
    this.router.navigate(['/events', event.extendedProps.idEvent]);
  }

  handleImageError(event: Event): void {
    console.warn('ShowEventsComponent: Image failed to load:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/assetsFront/img/course-1.jpg';
  }

  resetFilters(): void {
    console.log('ShowEventsComponent: Resetting filters');
    this.searchQuery = '';
    this.locationFilter = 'all';
    this.dateFilter = 'any';
    this.customStartDate = null;
    this.customEndDate = null;
    this.showLocationSearch = false;
    this.showDatePicker = false;
    this.showRecommendedOnly = false;
    this.currentPage = 1;
    this.filterEvents();
  }
}