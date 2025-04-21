import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCourse } from 'src/app/core/models/GestionFormation/content-course';
import { ContentCourseService } from 'src/app/core/services/GestionFormation/content-course.service';

type ContentCourseWithSanitizedUrl = ContentCourse & {
  sanitizedLnk: SafeResourceUrl;
};


@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css'],
})
export class ContentListComponent {
  listcourseContents: ContentCourse[] = [];
  // secondList: ContentCourse[] = [];
  secondList: ContentCourseWithSanitizedUrl[] = [];
  firstElement!: ContentCourse;
  formationId!: number;
  sanitizedUrl: SafeResourceUrl | null = null;
  sanitizedRemainingUrls: SafeResourceUrl[] = []; // For remainingContents

  constructor(
    private courseContentService: ContentCourseService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.formationId) {
      this.formationId = navigationState.formationId;
      console.log('ID de formation depuis navigation:', this.formationId); // Vérification dans la console
    }
    this.courseContentService.getContentByCourseId(this.formationId).subscribe(
      (data) => {
        this.listcourseContents = data;
        console.log('list of contents :' + this.listcourseContents[0]);
        if (this.listcourseContents && this.listcourseContents.length > 0) {
          // Récupérer le premier élément
          this.firstElement = data[0];
          this.sanitizedUrl = this.sanitizeYouTubeUrl(
            this.firstElement.lnk_vid
          );
          // Récupérer le reste des éléments
          // this.secondList = this.listcourseContents.slice(1);
          this.secondList = this.listcourseContents.slice(1).map((content) => ({
            ...content,
            sanitizedLnk: this.sanitizeYouTubeUrl(content.lnk_vid),
          }));
        }
      },
      (erreur) => console.log('erreur dans le chargement de content')
    );
  }

  sanitizeUrl(url: string): SafeResourceUrl | null {
    if (!url) {
      console.warn('URL is empty or undefined');
      return null;
    }
    // Clean URL and extract video ID
    const videoId = url.match(/(?:v=|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (!videoId) {
      console.warn('Invalid YouTube URL:', url);
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }
  sanitizeYouTubeUrl(url: string): SafeResourceUrl {
    // Extraire l'ID de la vidéo depuis l'URL
    const videoId = this.extractYouTubeVideoId(url);
    // Construire l'URL d'embed
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    // Sanitizer l'URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYouTubeVideoId(url: string): string {
    // Expressions régulières pour gérer différents formats d'URL YouTube
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : '';
  }
  loadContent() {
    this.courseContentService.getContentByCourseId(this.formationId).subscribe(
      (data) => {
        this.listcourseContents = data;
        console.log('list of contents :' + this.listcourseContents.length);
        if (this.listcourseContents && this.listcourseContents.length > 0) {
          // Récupérer le premier élément
          this.firstElement = this.listcourseContents[0];

          // Récupérer le reste des éléments
          // this.secondList = this.listcourseContents.slice(1);
          this.secondList = this.listcourseContents.slice(1).map((content) => ({
            ...content,
            sanitizedLnk: this.sanitizeYouTubeUrl(content.lnk_vid),
          }));

        }
      },
      (erreur) => console.log('erreur dans le chargement de content')
    );
  }

  goToAddContent(): void {}
}
