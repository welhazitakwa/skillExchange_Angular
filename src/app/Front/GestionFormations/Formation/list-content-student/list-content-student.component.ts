import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  checkedContents: Set<number> = new Set(); // Store checked content IDs
  isLoading: boolean = true; // Control rendering until data is loaded

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
    this.loadCurrentUser();
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
        this.loadContentAndSelections(); // Load content and selections after user is loaded
      },
      (error) => {
        console.error(error);
        this.isLoading = false; // Stop loading on error
      }
    );
  }

  loadContentAndSelections() {
    if (!this.currentUser) {
      this.isLoading = false;
      return;
    }

    // Use forkJoin to load content and selections simultaneously
    forkJoin([
      this.courseContentService.getContentByCourseId(this.formationId),
      this.contSelectionService.getUserSelections(this.currentUser.id),
    ]).subscribe({
      next: ([contents, selections]: [ContentCourse[], ContentSelection[]]) => {
        // Process content
        this.listcourseContents = contents;
        if (this.listcourseContents && this.listcourseContents.length > 0) {
          this.firstElement = contents[0];
          this.sanitizedUrl = this.sanitizeYouTubeUrl(
            this.firstElement.lnk_vid
          );
          this.secondList = this.listcourseContents.slice(1).map((content) => ({
            ...content,
            sanitizedLnk: this.sanitizeYouTubeUrl(content.lnk_vid),
          }));
        }

        // Process selections
        selections.forEach((selection) => {
          if (selection.isChecked && selection.courseContent) {
            this.checkedContents.add(selection.courseContent);
          }
        });
        console.log('Checked contents:', this.checkedContents);

        // Data is fully loaded, allow rendering
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Erreur lors du chargement des données', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

  isChecked(contentId: number): boolean {
    return this.checkedContents.has(contentId);
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
      selection.user = this.currentUser!.id;
      selection.courseContent = itemSelectedId;

      console.log('Données à envoyer :', selection);

      this.contSelectionService.addSelection(selection).subscribe({
        next: (res) => {
          console.log('Données envoyées checked avec succès', res);
          this.checkedContents.add(itemSelectedId); // Update checked state
        },
        error: (err) => {
          console.error(
            "Erreur lors de l'ajout Données envoyées checked avec succès",
            err
          );
        },
      });
    } else {
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
                    this.checkedContents.delete(itemSelectedId); // Update checked state
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

  onChecked(itemSelectedId: number): void {}

  onUnchecked(): void {
    console.log('Checkbox is unchecked');
  }
}
