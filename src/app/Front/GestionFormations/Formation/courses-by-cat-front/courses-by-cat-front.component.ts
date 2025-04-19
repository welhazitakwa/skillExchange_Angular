import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { DetailsFormationComponent } from '../details-formation/details-formation.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { User } from 'src/app/core/models/GestionUser/User';
import { ParticipationFormation } from 'src/app/core/models/GestionFormation/participation-formation';
import { ParticipationFormationService } from 'src/app/core/services/GestionFormation/participation-formation.service';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { catchError, map, Observable, of } from 'rxjs';
import { PaiementFormationService } from 'src/app/core/services/GestionFormation/paiement-formation.service';
import { PaiementFormation } from 'src/app/core/models/GestionFormation/paiement-formation';

@Component({
  selector: 'app-courses-by-cat-front',
  templateUrl: './courses-by-cat-front.component.html',
  styleUrls: ['./courses-by-cat-front.component.css'],
  animations: [
    trigger('blink', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-in', style({ opacity: 1 })),
        animate('0.2s ease-out', style({ opacity: 0.2 })),
        animate('0.2s ease-in', style({ opacity: 1 })),
        animate('0.2s ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CoursesByCatFrontComponent {
  searchText: string = '';
  filteredFormations: Formation[] = [];
  categoryId!: number;
  verifParticipation!: boolean;
  listFormations: Formation[] = [];
  currentUser: User | null = null;
  constructor(
    private catServ: CategoryService,
    private dialog: MatDialog,
    private userService: UserService,
    private participationService: ParticipationFormationService,
    private authService: AuthService,
    private router: Router,
    private payServ: PaiementFormationService
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
  // buttonStates: { [formationId: number]: 'pay' | 'participate' | 'exam' } = {};

  // Méthode pour déterminer l'état du bouton
  // updateButtonState(formation: Formation, userId: number): void {
  //   // if (formation.paid == 0) {
  //   //   this.buttonStates[formation.id] = 'pay';
  //   // } else if (formation.paid == 1) {
  //   this.participationService
  //     .checkParticipation(userId, formation.id)
  //     .subscribe({
  //       next: (exists) => {
  //         this.buttonStates[formation.id] = exists ? 'exam' : 'participate';
  //       },
  //       error: () => {
  //         this.buttonStates[formation.id] = 'participate'; // Par défaut si erreur
  //       },
  //     });
  //   // }
  // }

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
        this.getCoursesOfCategory();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  participationMap: { [courseId: number]: boolean } = {};
  paimentMap: { [courseId: number]: boolean } = {};

  getCoursesOfCategory() {
    this.catServ.getCoursesOfCategorie(this.categoryId).subscribe(
      (data) => {
        this.listFormations = data.filter(
          (f: Formation) => f.state === 1 && f.approoved === 1
        );
        this.filteredFormations = this.listFormations;
        //precharger paiements
        // this.filteredFormations.forEach((f) => {
        //   this.payServ
        //     .checkPaiement(this.currentUser!.id, f.id)
        //     .subscribe((exists) => (this.paimentMap[f.id] = exists));
        // });
        // Précharger les participations
        // this.filteredFormations.forEach((f) => {
        //   this.participationService
        //     .checkParticipation(this.currentUser!.id, f.id)
        //     .subscribe((exists) => (this.participationMap[f.id] = exists));
        // });
        // ekher mouhawla qabl nawm
        // this.filteredFormations.forEach((f) => {
        //   this.payServ
        //     .checkPaiement(f.id, this.currentUser!.id)
        //     .subscribe((hasPaid) => {
        //       if (!hasPaid) {
        //         this.showPayerButton = true;
        //       } else {
        //         this.participationService
        //           .checkParticipation(f.id, this.currentUser!.id)
        //           .subscribe((hasParticipated) => {
        //             if (hasParticipated) {
        //               this.showExamButton = true;
        //             } else {
        //               this.showParticiperButton = true;
        //             }
        //           });
        //       }
        //     });
        // });
        // ---------------------------------------------
        this.filteredFormations.forEach((f) => {
         this.payServ
           .checkPaiement(this.currentUser!.id, f.id)
           .subscribe((hasPaid) => {
             this.paimentMap[f.id] = hasPaid;

             if (hasPaid) {
               this.participationService
                 .checkParticipation(this.currentUser!.id, f.id)
                 .subscribe((hasParticipated) => {
                   this.participationMap[f.id] = hasParticipated;
                 });
             } else {
               this.participationMap[f.id] = false;
             }
           });
console.log(
  `Appel de checkPaiement avec participantId=${
    this.currentUser!.id
  }, courseId=${f.id}`
);

        });

        // ekher mouhawla qabl nawm
      },
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
  }

  // checkParticipation(userId: number, formationId: number): { verif: boolean}{
  //   console.log('🔥 Début de la méthode checkParticipation');
  //   this.participationService.checkParticipation(userId, formationId).subscribe(
  //     (data) => {
  //       this.verifParticipation = data;
  //       return { verif: this.verifParticipation };
  //       console.log('*******************************************');
  //       console.log('etat participation : ' + this.verifParticipation);
  //       console.log('*******************************************');
  //     },
  //     (error) => {
  //       console.log(
  //         '****************errreeeuuuurrraaaa***************************'
  //       );

  //       console.error(error);
  //     }
  //   );
  // }
  // ------------********************boutonet************************------------------------
  // Dans ton service de participation

  payer(courseId: number) {
    const paiement = new PaiementFormation();
    //participation.idp = 0;
    paiement.participant = this.currentUser?.id ?? 0;
    const course = new Formation();
    course.id = courseId;
    paiement.course = course;
    console.log('Données à envoyer :', paiement);

    this.payServ.addPaiement(paiement).subscribe({
      next: (res) => {
        this.getCoursesOfCategory();
        console.log('Participation ajoutée avec succès', res);
        Swal.fire({
          icon: 'success',
          title: 'Participation Added',
          text: 'Your participation has been successfully recorded!',
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add participation. Please try again.',
          confirmButtonText: 'Close',
        });
      },
    });
  }

  passerExam() {
    console.log('🟠 Bouton Exam cliqué');
    // logique pour accéder au quiz
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
        // //precharger paiements
        // this.listFormations.forEach((f) => {
        //   this.payServ
        //     .checkPaiement(this.currentUser!.id, f.id)
        //     .subscribe((exists) => (this.paimentMap[f.id] = exists));
        // });
        // // Rafraîchir l'état du bouton après l'ajout
        this.listFormations.forEach((f) => {
          this.participationService
            .checkParticipation(this.currentUser!.id, f.id)
            .subscribe((exists) => (this.participationMap[f.id] = exists));
        });
        this.getCoursesOfCategory();
        console.log('Participation ajoutée avec succès', res);
        Swal.fire({
          icon: 'success',
          title: 'Participation Added',
          text: 'Your participation has been successfully recorded!',
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add participation. Please try again.',
          confirmButtonText: 'Close',
        });
      },
    });
  }

  // refreshAllButtons(): void {
  //   this.listFormations.forEach((f) =>
  //     this.updateButtonState(f, this.currentUser!.id)
  //   );
  // }
  // emojis *******************************************
  rating = 0;
  hoverRating: number | null = null;
  showEmoji = false;
  stars = new Array(5);

  hover(value: number) {
    this.hoverRating = value;
  }

  resetHover() {
    this.hoverRating = null;
  }

  selectRating(value: number) {
    this.rating = value;
    this.showEmoji = true;

    // Hide emoji after animation (1 second)
    setTimeout(() => {
      this.showEmoji = false;
    }, 1000);
  }

  getEmoji(value: number): string {
    const emojis = ['😡', '😕', '😐', '🙂', '🤩'];
    return emojis[value - 1] || '';
  }

  // dfdlld;gl;gld;gld;g;ld;gld;gl;dl;gld;gld;gldlg;dl;gld;gl;dlg;
  // participationMap: { [courseId: number]: boolean } = {};
  // paimentMap: { [courseId: number]: boolean } = {};

  // Méthode pour vérifier l'état synchronement
  getButtonState(f: Formation): string {

    if (!this.paimentMap[f.id]) {
      return 'pay';
    } else {
      return this.participationMap[f.id] ? 'exam' : 'participate';
    }
  }


}
