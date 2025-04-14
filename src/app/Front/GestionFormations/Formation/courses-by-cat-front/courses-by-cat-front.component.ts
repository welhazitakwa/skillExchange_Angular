import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { DetailsFormationComponent } from '../details-formation/details-formation.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { User } from 'src/app/core/models/GestionUser/User';
import { ParticipationFormation } from 'src/app/core/models/GestionFormation/participation-formation';
import { ParticipationFormationService } from 'src/app/core/services/GestionFormation/participation-formation.service';

@Component({
  selector: 'app-courses-by-cat-front',
  templateUrl: './courses-by-cat-front.component.html',
  styleUrls: ['./courses-by-cat-front.component.css'],
})
export class CoursesByCatFrontComponent {
  searchText: string = '';
  filteredFormations: Formation[] = [];
  categoryId!: number;
  listFormations: Formation[] = [];
  currentUser: User | null = null;
  constructor(
    private catServ: CategoryService,
    private dialog: MatDialog,
    private userService: UserService,
    private participationService: ParticipationFormationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.categoryId) {
      this.categoryId = navigationState.categoryId;
      console.log('ID dans TestComponent:', this.categoryId); // Vérification dans la console
    }

    this.getCoursesOfCategory();
    // this.catServ.getCoursesOfCategorie(this.categoryId).subscribe(
    //   (data) => {this.listFormations = data; this.filteredFormations = data;},
    //   (erreur) => console.log('erreur'),
    //   () => console.log(this.listFormations)
    // );
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
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getCoursesOfCategory() {
    this.catServ.getCoursesOfCategorie(this.categoryId).subscribe(
      (data) => {
        this.listFormations = data.filter((f: Formation) => f.state === 1);
        this.filteredFormations = this.listFormations;
      },
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
  }

  // ------------********************************************---------------------------
  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60); // Nombre d'heures
    const minutes = duration % 60; // Nombre de minutes restantes
    return `${hours}h ${minutes}min`;
  }
  filterTable(search: string) {
    this.searchText = search.toLowerCase().trim();
    this.filteredFormations = this.listFormations.filter((f) =>
      (f.title + f.price + f.duration).toLowerCase().includes(this.searchText)
    );
  }

  openDetailsCourse(formId: number) {
    const dialogRef = this.dialog.open(DetailsFormationComponent, {
      data: { id: formId },
      //width: '1000px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCoursesOfCategory();
        }
      },
      error: console.log,
    });
  }

  addParticipation(courseId: number) {
    const participation = new ParticipationFormation();

    //participation.idp = 0;
    participation.progress = 1;
    participation.participant = this.currentUser?.id ?? 0;
    participation.date_participation = new Date();

    // Crée des objets Formation et Quiz partiels avec uniquement l'id
    const course = new Formation();
    course.id = courseId;
    participation.course = course;

    // const quiz = new Quiz();
    // quiz.id = 0; // ou l'ID réel du quiz
    // participation.quiz = quiz;

    console.log('Données à envoyer :', participation);

    this.participationService.addParticipation(participation).subscribe({
      next: (res) => {
        console.log('Participation ajoutée avec succès', res);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout", err);
      },
    });
  }
}
