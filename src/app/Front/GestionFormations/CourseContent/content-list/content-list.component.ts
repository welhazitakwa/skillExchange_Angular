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
  courseId!: number;

  constructor(
    private courseContentService: ContentCourseService,
    private route: ActivatedRoute,
    private router: Router
    
  ) {}

  ngOnInit(): void {
   this.courseContentService.getContentByCourseId(this.courseId).subscribe(
     (data) => (this.listcourseContents = data),
     (erreur) => console.log('erreur dans le chargement de content'),
   );
  }

  loadContent(){

  }


  goToAddContent(): void {
    
  }
}
