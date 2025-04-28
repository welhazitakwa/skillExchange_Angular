import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { ParticipationEventsService } from 'src/app/core/services/GestionEvents/participation-events.service';
import { RateEventService } from 'src/app/core/services/GestionEvents/rate-event.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { Status } from 'src/app/core/models/GestionEvents/status';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParticipationEvents } from 'src/app/core/models/GestionEvents/participation-events';
import { RateEvent } from 'src/app/core/models/GestionEvents/rate-event';

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
  userId: number | null = null;
  Status = Status;
  userRate: RateEvent | null = null;
  rateEvents: RateEvent[] = [];
  ratingForm: FormGroup;
  showModal: boolean = false;
  isEditing: boolean = false;
  editingRateId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private participationService: ParticipationEventsService,
    private rateEventService: RateEventService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.ratingForm = this.fb.group({
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.debugAuth();
    this.userEmail = this.authService.getCurrentUserEmail();
    this.userId = this.authService.getCurrentUserID();
    console.log('EventDetailsComponent: Logged-in user email:', this.userEmail, 'ID:', this.userId);
    if (!this.userEmail || !this.userId) {
      console.warn('EventDetailsComponent: No user email or ID found. User may not be authenticated.');
      this.snackBar.open('Please log in to view your event participation and rate events.', 'Close', { duration: 5000 });
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      console.log('EventDetailsComponent: Loading event with ID:', id);
      this.loadEvent(id);
      this.loadParticipationCounts(id);
      this.loadUserParticipation(id);
      this.loadRateEvents(id);
      this.loadUserRate(id);
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
        this.event = { ...event, status: Status.NOT_ATTENDING };
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
        console.error('EventDetailsComponent: Error loading going count:', error);
      }
    );
    this.participationService.countByEventAndStatus(id, Status.INTERESTED).subscribe(
      (count) => {
        console.log('EventDetailsComponent: Interested count:', count);
        this.interestedCount = count;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('EventDetailsComponent: Error loading interested count:', error);
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
        console.error('EventDetailsComponent: Error loading user participation:', error);
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

  loadRateEvents(eventId: number): void {
    this.rateEventService.getRatesByEventId(eventId).subscribe({
      next: (rates) => {
        console.log('EventDetailsComponent: Loaded rate events:', rates);
        console.log('EventDetailsComponent: Rate events user data:', rates.map(rate => rate.user));
        this.rateEvents = rates;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('EventDetailsComponent: Error loading rate events:', error);
        this.snackBar.open('Failed to load ratings.', 'Close', { duration: 3000 });
      }
    });
  }

  loadUserRate(eventId: number): void {
    if (!this.userId) {
      console.warn('EventDetailsComponent: No authenticated user found. Cannot load user rate.');
      return;
    }

    console.log('EventDetailsComponent: Attempting to load user rate for userId:', this.userId, 'eventId:', eventId);
    this.rateEventService.getRateByUserAndEvent(this.userId, eventId).subscribe({
      next: (rate) => {
        console.log('EventDetailsComponent: User rate loaded:', rate);
        this.userRate = rate;
        if (rate) {
          this.ratingForm.patchValue({
            rating: rate.rating,
            content: rate.content
          });
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.warn('EventDetailsComponent: getRateByUserAndEvent failed, falling back to getRatesByEventId:', error);
        this.rateEventService.getRatesByEventId(eventId).subscribe({
          next: (rates) => {
            console.log('EventDetailsComponent: All rates for event:', rates);
            this.userRate = rates.find(rate => rate.user?.id === this.userId) || null;
            if (this.userRate) {
              console.log('EventDetailsComponent: Found user rate in fallback:', this.userRate);
              this.ratingForm.patchValue({
                rating: this.userRate.rating,
                content: this.userRate.content
              });
            } else {
              console.log('EventDetailsComponent: No user rate found in fallback');
            }
            this.cdr.detectChanges();
          },
          error: (fallbackError: any) => {
            console.error('EventDetailsComponent: Error in fallback getRatesByEventId:', fallbackError);
            this.snackBar.open('Failed to load user rating.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openRatingModal(isEditing: boolean = false, rate: RateEvent | null = null): void {
    if (!this.userId || !this.event) {
      this.snackBar.open('You must be logged in to rate this event.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    this.isEditing = isEditing;
    this.editingRateId = isEditing && rate && rate.idRate != null ? rate.idRate : null;

    if (isEditing && rate) {
      this.ratingForm.patchValue({
        rating: rate.rating,
        content: rate.content
      });
    } else {
      this.ratingForm.reset({
        rating: 1,
        content: ''
      });
    }

    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.ratingForm.reset();
    this.isEditing = false;
    this.editingRateId = null;
    this.cdr.detectChanges();
  }

  submitRating(): void {
    if (!this.ratingForm.valid || !this.userId || !this.event) {
      this.snackBar.open('Please complete the rating form.', 'Close', { duration: 3000 });
      return;
    }

    const rateEvent: RateEvent = {
      idRate: this.editingRateId ?? undefined,
      content: this.ratingForm.get('content')?.value,
      rating: this.ratingForm.get('rating')?.value,
      createdAt: this.isEditing && this.userRate ? this.userRate.createdAt : new Date(),
      updatedAt: new Date(),
      user: { id: this.userId } as any,
      event: { idEvent: this.event.idEvent } as any
    };

    if (this.isEditing && this.editingRateId != null) {
      this.rateEventService.updateRate(rateEvent).subscribe({
        next: (updatedRate) => {
          console.log('EventDetailsComponent: Rate updated:', updatedRate);
          this.userRate = updatedRate;
          this.loadRateEvents(this.event!.idEvent);
          this.snackBar.open('Rating updated successfully.', 'Close', { duration: 3000 });
          this.closeModal();
        },
        error: (error: any) => {
          console.error('EventDetailsComponent: Error updating rate:', error);
          this.snackBar.open('Failed to update rating.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.rateEventService.addRate(rateEvent).subscribe({
        next: (newRate) => {
          console.log('EventDetailsComponent: Rate added:', newRate);
          this.userRate = newRate;
          this.loadRateEvents(this.event!.idEvent);
          this.snackBar.open('Rating submitted successfully.', 'Close', { duration: 3000 });
          this.closeModal();
        },
        error: (error: any) => {
          console.error('EventDetailsComponent: Error adding rate:', error);
          this.snackBar.open('Failed to submit rating.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteRate(rateId: number): void {
    console.log('EventDetailsComponent: Delete rate called for rateId:', rateId, 'userId:', this.userId, 'userRate:', this.userRate);
    if (!this.userId || !this.event || !this.userRate || this.userRate.idRate !== rateId) {
      console.warn('EventDetailsComponent: Delete rate blocked: userId=', this.userId, 'rateId=', rateId, 'userRate=', this.userRate);
      this.snackBar.open('You can only delete your own rating.', 'Close', { duration: 3000 });
      return;
    }

    if (!confirm('Are you sure you want to delete your rating?')) {
      console.log('EventDetailsComponent: Delete rate cancelled by user');
      return;
    }

    this.rateEventService.deleteRate(rateId).subscribe({
      next: () => {
        console.log('EventDetailsComponent: Rate deleted successfully:', rateId);
        this.userRate = null;
        this.loadRateEvents(this.event!.idEvent);
        this.snackBar.open('Rating deleted successfully.', 'Close', { duration: 3000 });
        this.ratingForm.reset();
      },
      error: (error: any) => {
        console.error('EventDetailsComponent: Error deleting rate:', error);
        this.snackBar.open('Failed to delete rating.', 'Close', { duration: 3000 });
      }
    });
  }

  canEditOrDelete(rate: RateEvent): boolean {
    const canEdit = this.userId !== null && rate.user?.id === this.userId;
    console.log('EventDetailsComponent: canEditOrDelete check:', {
      userId: this.userId,
      rateUserId: rate.user?.id,
      rateId: rate.idRate,
      canEdit
    });
    return canEdit;
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
        this.loadParticipationCounts(this.event!.idEvent);
        this.cdr.detectChanges();
        this.snackBar.open(
          newStatus === Status.NOT_ATTENDING
            ? `You have canceled your participation in ${this.event!.eventName}.`
            : `Successfully registered for ${this.event!.eventName} as ${newStatus}!`,
          'Close',
          { duration: 5000 }
        );
      },
      error: (error: any) => {
        console.error('EventDetailsComponent: Error updating participation:', error);
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