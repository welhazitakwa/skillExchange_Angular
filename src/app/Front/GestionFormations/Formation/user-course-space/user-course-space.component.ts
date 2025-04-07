import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';

@Component({
  selector: 'app-user-course-space',
  templateUrl: './user-course-space.component.html',
  styleUrls: ['./user-course-space.component.css']
})
export class UserCourseSpaceComponent {
 constructor(private catServ: CategoryService,
   private formServ: FormationService, private router: Router) {}
   userId!: number;
   listFormations: Formation[] = [];
   
   ngOnInit() {
     // Récupérer l'ID depuis l'état de la navigation
     const navigationState = history.state;
     if (navigationState && navigationState.userId) {
       this.userId = navigationState.userId;
       console.log('ID dans TestComponent:', this.userId); // Vérification dans la console
     }
}

}
