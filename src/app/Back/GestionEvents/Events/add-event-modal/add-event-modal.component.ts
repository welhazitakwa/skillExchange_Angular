import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.css']
})
export class AddEventModalComponent implements AfterViewInit {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  eventForm: FormGroup;
  imagePreviews: string[] = [];
  imageBase64s: string[] = [];
  imageError: string | null = null;
  map!: L.Map;
  marker: L.Marker | null = null;
  isGeneratingImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      place: ['', [Validators.required, Validators.minLength(3)]],
      latitude: [null],
      longitude: [null],
      nbr_max: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
    }, { validator: this.dateRangeValidator });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.setupSearch();
  }

  initMap(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    const defaultLocation: L.LatLngTuple = [36.8065, 10.1815]; // Tunis, Tunisia
    this.map = L.map(this.mapElement.nativeElement).setView(defaultLocation, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker(defaultLocation, { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      this.updateLocationFromMarker();
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = e.latlng;
      if (this.marker) {
        this.marker.setLatLng(coords);
        this.updateLocationFromMarker();
      }
    });
  }

  setupSearch(): void {
    this.searchInput.nativeElement.addEventListener('input', (e: Event) => {
      const query = (e.target as HTMLInputElement).value;
      if (query.length > 3) {
        this.searchAddress(query);
      }
    });
  }

  searchAddress(query: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    this.http.get<any[]>(url).subscribe(
      (results) => {
        if (results.length > 0) {
          const result = results[0];
          const coords: L.LatLngTuple = [parseFloat(result.lat), parseFloat(result.lon)];
          this.map.setView(coords, 15);
          if (this.marker) {
            this.marker.setLatLng(coords);
          }
          this.eventForm.patchValue({
            place: result.display_name,
            latitude: coords[0],
            longitude: coords[1]
          });
        }
      },
      (error) => {
        console.error('Error searching address:', error);
        this.snackBar.open('Failed to search address.', 'Close', { duration: 5000 });
      }
    );
  }

  updateLocationFromMarker(): void {
    if (this.marker) {
      const coords = this.marker.getLatLng();
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`;
      this.http.get<any>(url).subscribe(
        (result) => {
          this.eventForm.patchValue({
            place: result.display_name || 'Unknown location',
            latitude: coords.lat,
            longitude: coords.lng
          });
        },
        (error) => {
          console.warn('Reverse geocoding failed:', error);
          this.eventForm.patchValue({
            place: '',
            latitude: coords.lat,
            longitude: coords.lng
          });
        }
      );
    }
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

  onFileChange(event: any): void {
    const files = event.target.files;
    this.imageError = null;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Only image files are allowed.';
          this.snackBar.open(this.imageError, 'Close', { duration: 5000 });
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

  generateAIImage(): void {
    const description = this.eventForm.get('description')?.value;
    if (!description) {
        this.imageError = 'Please enter a description to generate an image.';
        this.snackBar.open(this.imageError, 'Close', { duration: 5000 });
        return;
    }

    this.isGeneratingImage = true;
    this.imageError = null;

    const enhancedPrompt = `A vibrant poster for an event described as: ${description}`;
    console.log('Sending request to generate image with prompt:', enhancedPrompt);

    this.http.post<{ imageBase64: string }>('http://localhost:8084/skillExchange/events/generate-image', { prompt: enhancedPrompt }).pipe(
        map(response => response.imageBase64),
        catchError(error => {
            console.error('Error generating image:', error);
            this.imageError = 'Failed to generate image. Please try again.';
            this.isGeneratingImage = false;
            this.snackBar.open(this.imageError, 'Close', { duration: 5000 });
            return throwError(error);
        })
    ).subscribe(
        (base64String) => {
            const fullBase64 = `data:image/png;base64,${base64String}`;
            this.imagePreviews.push(fullBase64);
            this.imageBase64s.push(base64String);
            this.isGeneratingImage = false;
            this.snackBar.open('Image generated successfully!', 'Close', { duration: 5000 });
        }
    );
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
      this.snackBar.open('Please correct the errors in the form.', 'Close', { duration: 5000 });
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}