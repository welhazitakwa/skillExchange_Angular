import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ContentCourse } from 'src/app/core/models/GestionFormation/content-course';
import { ContentSelection } from 'src/app/core/models/GestionFormation/content-selection';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { ContentCourseService } from 'src/app/core/services/GestionFormation/content-course.service';
import { ContentSelectionService } from 'src/app/core/services/GestionFormation/content-selection.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

type ContentCourseWithSanitizedUrl = ContentCourse & {
  sanitizedLnk: SafeResourceUrl;
};
@Component({
  selector: 'app-list-content-student',
  templateUrl: './list-content-student.component.html',
  styleUrls: ['./list-content-student.component.css'],
})
export class ListContentStudentComponent {
  listcourseContents: ContentCourse[] = [];
  secondList: ContentCourseWithSanitizedUrl[] = [];
  firstElement!: ContentCourse;
  formationId!: number;
  sanitizedUrl: SafeResourceUrl | null = null;
  sanitizedRemainingUrls: SafeResourceUrl[] = [];
  activeIndex: number = 0; // Track active video
  currentUser: User | null = null;

  constructor(
    private courseContentService: ContentCourseService,
    private contSelectionService: ContentSelectionService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
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
    this.loadCurrentUser();
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

  onCheckboxChange(event: Event, itemSelectedId: number): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
       console.log('Checkbox is checked');
       console.log('iddd item selected', itemSelectedId);
       console.log('idd current user ', this.currentUser?.id);
       const selection = new ContentSelection();
       selection.isChecked = 1;
      //  const user = new User();
      //  user.id = this.currentUser!.id;
       selection.user = this.currentUser!.id;

      //  const courseContent = new ContentCourse();
      //  courseContent.id = itemSelectedId;
       selection.courseContent = itemSelectedId;

       console.log('Données à envoyer :', selection);

       this.contSelectionService.addSelection(selection).subscribe({
         next: (res) => {
           console.log('Données envoyées checked avec succès', res);
         },
         error: (err) => {
           console.error(
             "Erreur lors de l'ajout Données envoyées checked avec succès",
             err
           );
         },
       });
    } else {
      // this.contSelectionService.deleteSelection(itemSelectedId).subscribe({
      //           next: (res) => {
      //             console.log("contenu été unchecked", itemSelectedId);
      //             console.log("contenu été unchecked")

      //             this.loadContent();
      //           },
      //           error: (err) => {
      //             console.log("Erreur lors de la suppression de l'élément", err);
      //           },
      //         });
       this.contSelectionService
         .getSelectionByUserAndContent(this.currentUser!.id, itemSelectedId)
         .subscribe({
           next: (selection: ContentSelection) => {
             if (selection && selection.id) {
               this.contSelectionService
                 .deleteSelection(selection.id)
                 .subscribe({
                   next: (res) => {
                     console.log('Contenu été unchecked', itemSelectedId);
                     this.loadContent();
                   },
                   error: (err) => {
                     console.log(
                       "Erreur lors de la suppression de l'élément",
                       err
                     );
                   },
                 });
             } else {
               console.log('Aucune sélection trouvée pour suppression');
             }
           },
           error: (err) => {
             console.log('Erreur lors de la récupération de la sélection', err);
           },
         });
    }
  }
  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(currentUserEmail);
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onChecked(itemSelectedId: number): void {
  
  }

  onUnchecked(): void {
    console.log('Checkbox is unchecked');
    // ta méthode quand c'est décoché
  }
}
