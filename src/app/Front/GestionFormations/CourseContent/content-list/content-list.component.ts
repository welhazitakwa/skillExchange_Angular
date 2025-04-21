import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCourse } from 'src/app/core/models/GestionFormation/content-course';
import { ContentCourseService } from 'src/app/core/services/GestionFormation/content-course.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css'],
})
export class ContentListComponent {
  listcourseContents: ContentCourse[] = [];
  formationId!: number;
 
  constructor(
    private courseContentService: ContentCourseService,
    private route: ActivatedRoute,
    private router: Router
    
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.formationId) {
      this.formationId = navigationState.formationId;
      console.log('ID de formation depuis navigation:', this.formationId); // Vérification dans la console
    }
    this.loadContent();
  }

  loadContent(){
this.courseContentService.getContentByCourseId(this.formationId).subscribe(
  (data) => (this.listcourseContents = data),
  (erreur) => console.log('erreur dans le chargement de content')
);
  }


  goToAddContent(): void {
    
  }
}
