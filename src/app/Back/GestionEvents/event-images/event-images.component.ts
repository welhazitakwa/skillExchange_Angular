import { Component, Input, OnInit } from '@angular/core';
import { EventImage } from 'src/app/core/models/GestionEvents/event-image';
import { EventImageService } from 'src/app/core/services/GestionEvents/event-image.service';

@Component({
  selector: 'app-event-images',
  templateUrl: './event-images.component.html',
  styleUrls: ['./event-images.component.css']
})
export class EventImagesComponent implements OnInit {
  @Input() eventId!: number;
  images: EventImage[] = [];

  constructor(private eventImageService: EventImageService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.eventImageService.getImagesByEventId(this.eventId).subscribe(images => {
      this.images = images;
    });
  }

  deleteImage(imageId: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.eventImageService.deleteImage(imageId).subscribe({
        next: () => {
          this.images = this.images.filter(img => img.idImage !== imageId);
        },
        error: (err) => {
          console.error('Error deleting image:', err);
        }
      });
    }
  }



  // Ajoutez cette méthode dans EventImagesComponent
getImageUrl(imagePath: string): string {
  if (!imagePath) return 'assets/default-event.jpg';
  return imagePath.startsWith('http') ? imagePath : `http://localhost:8084/skillExchange${imagePath}`;
}
}