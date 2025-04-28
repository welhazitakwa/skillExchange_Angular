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
  imagePreviews: string[] = [];
  imageBase64s: string[] = [];
  imageError: string | null = null;

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

  onFileChange(event: any): void {
    const files = event.target.files;
    this.imageError = null;
    this.imagePreviews = [];
    this.imageBase64s = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Only image files are allowed.';
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result; // Full data URL
          this.imagePreviews.push(base64String);
          // Extract Base64 part without the data URL prefix
          const base64Data = base64String.split(',')[1];
          this.imageBase64s.push(base64Data);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(preview: string): void {
    const index = this.imagePreviews.indexOf(preview);
    if (index > -1) {
      this.imagePreviews.splice(index, 1);
      this.imageBase64s.splice(index, 1);
    }
  }

  submit(): void {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        images: this.imageBase64s.map(base64 => ({ images: base64 }))
      };
      this.onSubmit.emit(eventData);
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}