import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { ParticipationEventsService } from 'src/app/core/services/GestionEvents/participation-events.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { Status } from 'src/app/core/models/GestionEvents/status';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParticipationEvents } from 'src/app/core/models/GestionEvents/participation-events';

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
  userEmail: string | null = null;
  Status = Status; // Expose Status enum to template

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private participationService: ParticipationEventsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.debugAuth();
    this.userEmail = this.authService.getCurrentUserEmail();
    console.log('EventDetailsComponent: Logged-in user email:', this.userEmail);
    if (!this.userEmail) {
      console.warn('EventDetailsComponent: No user email found. User may not be authenticated.');
      this.snackBar.open('Please log in to view your event participation.', 'Close', { duration: 5000 });
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      console.log('EventDetailsComponent: Loading event with ID:', id);
      this.loadEvent(id);
      this.loadParticipationCounts(id);
      this.loadUserParticipation(id);
    } else {
      console.error('EventDetailsComponent: No event ID found in route parameters.');
      this.snackBar.open('Invalid event ID.', 'Close', { duration: 5000 });
    }
  }

  debugAuth(): void {
    const token = localStorage.getItem('token');
    console.log('EventDetailsComponent: Debug: JWT token:', token);
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('EventDetailsComponent: Debug: Decoded JWT:', decoded);
        console.log('EventDetailsComponent: Debug: JWT sub (email):', decoded.sub);
      } catch (error) {
        console.error('EventDetailsComponent: Debug: Error decoding JWT:', error);
      }
    }
  }

  loadEvent(id: number): void {
    this.eventsService.getEventByID(id).subscribe(
      (event) => {
        console.log('EventDetailsComponent: Loaded event:', event);
        this.event = { ...event, status: Status.NOT_ATTENDING }; // Initialize status
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('EventDetailsComponent: Error loading event:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.snackBar.open('Failed to load event details.', 'Close', { duration: 3000 });
      }
    );
  }

  loadParticipationCounts(id: number): void {
    console.log('EventDetailsComponent: Loading participation counts for event ID:', id);
    this.participationService.countByEventAndStatus(id, Status.GOING).subscribe(
      (count) => {
        console.log('EventDetailsComponent: Going count:', count);
        this.goingCount = count;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('EventDetailsComponent: Error loading going count:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
      }
    );
    this.participationService.countByEventAndStatus(id, Status.INTERESTED).subscribe(
      (count) => {
        console.log('EventDetailsComponent: Interested count:', count);
        this.interestedCount = count;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('EventDetailsComponent: Error loading interested count:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
      }
    );
  }

  loadUserParticipation(id: number): void {
    if (!this.userEmail) {
      console.warn('EventDetailsComponent: No authenticated user found. Setting status to NOT_ATTENDING.');
      if (this.event) {
        this.event.status = Status.NOT_ATTENDING;
        this.cdr.detectChanges();
      }
      return;
    }

    console.log('EventDetailsComponent: Fetching participation for user:', this.userEmail, 'event ID:', id);
    this.participationService.getParticipationByUserAndEvent(this.userEmail, id).subscribe({
      next: (participation) => {
        console.log('EventDetailsComponent: Participation loaded:', participation);
        if (this.event) {
          this.event.status = participation ? participation.status : Status.NOT_ATTENDING;
          console.log(`EventDetailsComponent: Event ${id} status: ${this.event.status}`);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('EventDetailsComponent: Error loading user participation:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        console.warn('EventDetailsComponent: Falling back to getParticipationsByUserEmail');
        this.participationService.getParticipationsByUserEmail(this.userEmail!).subscribe({
          next: (participations) => {
            console.log('EventDetailsComponent: Fallback participations loaded:', participations);
            const participation = participations.find(p => p.event?.idEvent === id);
            if (this.event) {
              this.event.status = participation ? participation.status : Status.NOT_ATTENDING;
              console.log(`EventDetailsComponent: Event ${id} status (fallback): ${this.event.status}`);
              this.cdr.detectChanges();
            }
          },
          error: (fallbackError) => {
            console.error('EventDetailsComponent: Error in fallback getParticipationsByUserEmail:', fallbackError);
            if (this.event) {
              this.event.status = Status.NOT_ATTENDING;
              this.cdr.detectChanges();
            }
            this.snackBar.open('Failed to load participation status.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  toggleEvent(status: Status): void {
    if (!this.userEmail || !this.event) {
      console.warn('EventDetailsComponent: No user email or event found for toggleEvent.');
      this.snackBar.open('You must be logged in to participate.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const newStatus = this.event.status === status ? Status.NOT_ATTENDING : status;
    console.log('EventDetailsComponent: Toggling event:', {
      eventId: this.event.idEvent,
      eventName: this.event.eventName,
      currentStatus: this.event.status,
      newStatus
    });
    this.participationService.participateInEvent(this.event.idEvent, newStatus).subscribe({
      next: (response) => {
        console.log('EventDetailsComponent: Participation response:', response);
        this.event!.status = newStatus;
        this.loadParticipationCounts(this.event!.idEvent); // Update counts
        this.cdr.detectChanges();
        this.snackBar.open(
          newStatus === Status.NOT_ATTENDING
            ? `You have canceled your participation in ${this.event!.eventName}.`
            : `Successfully registered for ${this.event!.eventName} as ${newStatus}!`,
          'Close',
          { duration: 5000 }
        );
      },
      error: (error) => {
        console.error('EventDetailsComponent: Error updating participation:', {
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

  prevImage(): void {
    if (this.event && this.event.images && this.event.images.length > 0) {
      this.carouselIndex = Math.max(0, this.carouselIndex - 1);
      this.cdr.detectChanges();
    }
  }

  nextImage(): void {
    if (this.event && this.event.images && this.event.images.length > 0) {
      this.carouselIndex = Math.min(this.event.images.length - 1, this.carouselIndex + 1);
      this.cdr.detectChanges();
    }
  }
}