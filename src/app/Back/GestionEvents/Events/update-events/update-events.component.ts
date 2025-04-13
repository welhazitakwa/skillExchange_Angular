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
      this.eventForm.patchValue({
        ...this.eventData,
        startDate: this.formatDate(this.eventData.startDate),
        endDate: this.formatDate(this.eventData.endDate)
      });
      // Load existing images (assuming images are Base64 strings with data URL prefix)
      if (this.eventData.images) {
        this.existingImages = Array.from(this.eventData.images).map(img => ({
          ...img,
          images: img.images.startsWith('data:image') ? img.images : `data:image/jpeg;base64,${img.images}`
        }));
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

  removeExistingImage(image: any): void {
    const index = this.existingImages.indexOf(image);
    if (index > -1) {
      this.existingImages.splice(index, 1);
    }
  }

  submit(): void {
    if (this.eventForm.valid) {
      const updatedImages = [
        ...this.existingImages.map(img => ({ idImage: img.idImage, images: img.images.startsWith('data:image') ? img.images.split(',')[1] : img.images })),
        ...this.imageBase64s.map(base64 => ({ images: base64 }))
      ];

      const updatedEvent = {
        ...this.eventData,
        ...this.eventForm.value,
        images: updatedImages
      };

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