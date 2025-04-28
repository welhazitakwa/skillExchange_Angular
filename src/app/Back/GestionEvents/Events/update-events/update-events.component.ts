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
  imagePreviews: string[] = [];
  imageBase64s: string[] = [];
  existingImages: any[] = [];
  imageError: string | null = null;

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
      console.log('Initializing event data:', JSON.stringify(this.eventData, null, 2));
      this.eventForm.patchValue({
        ...this.eventData,
        startDate: this.formatDate(this.eventData.startDate),
        endDate: this.formatDate(this.eventData.endDate)
      });
      // Load existing images
      if (this.eventData.images) {
        this.existingImages = Array.from(this.eventData.images).map(img => ({
          idImage: img.idImage,
          images: img.images.startsWith('data:image') ? img.images : `data:image/jpeg;base64,${img.images}`
        }));
        console.log('Loaded existing images:', this.existingImages.map(img => ({ idImage: img.idImage })));
      }
    }
  }

  private formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

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
          const base64String = e.target.result;
          this.imagePreviews.push(base64String);
          const base64Data = base64String.split(',')[1];
          this.imageBase64s.push(base64Data);
          console.log('Added new image (preview):', base64String.substring(0, 50) + '...');
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
      console.log('Removed new image preview:', preview.substring(0, 50) + '...');
    }
  }

  removeExistingImage(image: any): void {
    const index = this.existingImages.indexOf(image);
    if (index > -1) {
      this.existingImages.splice(index, 1);
      console.log('Removed existing image, ID:', image.idImage);
    }
  }

  submit(): void {
    if (this.eventForm.valid) {
      // Construct the images array: include only remaining existing images and new images
      const updatedImages = [
        ...this.existingImages.map(img => ({
          idImage: img.idImage,
          images: img.images.startsWith('data:image') ? img.images.split(',')[1] : img.images
        })),
        ...this.imageBase64s.map(base64 => ({ images: base64 }))
      ];

      const updatedEvent: Events = {
        ...this.eventData!,
        ...this.eventForm.value,
        images: updatedImages
      };

      console.log('Submitting update payload:', JSON.stringify(updatedEvent, null, 2));

      this.eventsService.updateEvent(updatedEvent).subscribe({
        next: (response) => {
          console.log('Update successful, server response:', JSON.stringify(response, null, 2));
          this.onUpdate.emit(response);
        },
        error: (error) => {
          console.error('Error updating event:', error);
          if (error.status === 415) {
            console.error('HTTP 415: Verify Content-Type is application/json and JSON payload is valid');
          } else if (error.status === 400) {
            console.error('HTTP 400: Check JSON payload structure, possible deserialization issue');
          }
        }
      });
    } else {
      this.eventForm.markAllAsTouched();
      console.log('Form invalid, errors:', this.eventForm.errors);
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}