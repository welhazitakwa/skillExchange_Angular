import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Status } from 'src/app/core/models/GestionEvents/status';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.css']
})
export class AddEventModalComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required]],
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

  submit() {
    if (this.eventForm.valid) {
      this.onSubmit.emit(this.eventForm.value);
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}