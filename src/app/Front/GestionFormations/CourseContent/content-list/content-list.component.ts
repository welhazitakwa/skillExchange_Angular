import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCourse } from 'src/app/core/models/GestionFormation/content-course';
import { ContentCourseService } from 'src/app/core/services/GestionFormation/content-course.service';
import { AddContentComponent } from '../add-content/add-content.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EditContentComponent } from '../edit-content/edit-content.component';

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
  secondList: ContentCourseWithSanitizedUrl[] = [];
  firstElement!: ContentCourse;
  formationId!: number;
  sanitizedUrl: SafeResourceUrl | null = null;
  sanitizedRemainingUrls: SafeResourceUrl[] = [];
  activeIndex: number = 0; // Track active video

  constructor(
    private courseContentService: ContentCourseService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const navigationState = history.state;
    if (navigationState && navigationState.formationId) {
      this.formationId = navigationState.formationId;
      console.log('ID de formation depuis navigation:', this.formationId);
    }
    this.courseContentService.getContentByCourseId(this.formationId).subscribe(
      (data) => {
        this.listcourseContents = data;
        console.log('list of contents :' + this.listcourseContents[0]);
        if (this.listcourseContents && this.listcourseContents.length > 0) {
          this.firstElement = data[0];
          this.sanitizedUrl = this.sanitizeYouTubeUrl(
            this.firstElement.lnk_vid
          );
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
    const videoId = this.extractYouTubeVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYouTubeVideoId(url: string): string {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : '';
  }

  loadContent() {
    this.courseContentService.getContentByCourseId(this.formationId).subscribe(
      (data) => {
        this.listcourseContents = data;
        console.log('list of contents :' + this.listcourseContents[0]);
        if (this.listcourseContents && this.listcourseContents.length > 0) {
          this.firstElement = data[0];
          this.sanitizedUrl = this.sanitizeYouTubeUrl(
            this.firstElement.lnk_vid
          );
          this.secondList = this.listcourseContents.slice(1).map((content) => ({
            ...content,
            sanitizedLnk: this.sanitizeYouTubeUrl(content.lnk_vid),
          }));
        }
      },
      (erreur) => console.log('erreur dans le chargement de content')
    );
  }

  OpenAddContent(): void {
    const dialogRef = this.dialog.open(AddContentComponent, {
      data: { id: this.formationId },
      //width: '1000px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadContent();
        }
      },
      error: console.log,
    });
  }

  playVideo(index: number) {
    this.activeIndex = index;
    const allItems: (ContentCourse | ContentCourseWithSanitizedUrl)[] = [
      this.firstElement,
      ...this.secondList,
    ];
    if (allItems[index]) {
      const lnkVid = allItems[index].lnk_vid;
      this.sanitizedUrl = this.sanitizeYouTubeUrl(lnkVid);
      this.firstElement = {
        ...allItems[index],
        lnk_vid: lnkVid,
        title: allItems[index].title,
        description: allItems[index].description || '',
      };
    }
  }
  deleteContent(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This Content will be permanently deleted! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseContentService.deleteContent(id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', 'Your Content has been deleted', 'success');
            this.loadContent();
          },
          error: (err) => {
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
          },
        });
      }
    });
  }
  openEditContent(catId: number) {
    const dialogRef = this.dialog.open(EditContentComponent, {
      data: { id: catId },
      width: '550px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadContent();
        }
      },
      error: console.log,
    });
  }
}
