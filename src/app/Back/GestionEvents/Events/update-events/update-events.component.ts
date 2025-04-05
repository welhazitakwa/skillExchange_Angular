import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-events.component.html',
  styleUrls: ['./update-events.component.css']
})
export class UpdateEventsComponent implements OnInit {
  @Input() eventData: Events | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<Events>();

  eventForm: FormGroup;

  constructor(private fb: FormBuilder, private eventsService: EventsService) {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      place: ['', [Validators.required, Validators.minLength(3)]],
      nbr_max: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
    }, { validator: this.dateRangeValidator });
  }

  // Validateur pour vérifier que endDate est après startDate
  dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return end >= start ? null : { dateRange: true };
    }
    return null;
  };

  ngOnInit(): void {
    if (this.eventData) {
      this.eventForm.patchValue({
        ...this.eventData,
        startDate: this.formatDate(this.eventData.startDate),
        endDate: this.formatDate(this.eventData.endDate)
      });
    }
  }

  // Helper pour formater la date au format YYYY-MM-DD pour les inputs date
  private formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  submit(): void {
    if (this.eventForm.valid) {
      const updatedEvent = { ...this.eventData, ...this.eventForm.value };
      this.eventsService.updateEvent(updatedEvent).subscribe(
        (response) => {
          this.onUpdate.emit(updatedEvent);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement', error);
        }
      );
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}