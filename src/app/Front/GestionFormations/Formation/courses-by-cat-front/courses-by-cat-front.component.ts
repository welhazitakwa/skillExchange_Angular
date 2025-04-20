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
import { HistoricTransactions, TransactionType } from 'src/app/core/models/GestionUser/HistoricTransactions';
import { RatingCourseService } from 'src/app/core/services/GestionFormation/rating-course.service';
import { Rating } from 'src/app/core/models/GestionFormation/rating';

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
  listParticipation: ParticipationFormation[] = [];
  totalProgress: number = 0;
  constructor(
    private catServ: CategoryService,
    private dialog: MatDialog,
    private userService: UserService,
    private participationService: ParticipationFormationService,
    private authService: AuthService,
    private router: Router,
    private participationServ: ParticipationFormationService,
    private payServ: PaiementFormationService,
    private ratingService: RatingCourseService // Add this
  ) {}

  ngOnInit() {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.categoryId) {
      this.categoryId = navigationState.categoryId;
      console.log('ID dans TestComponent:', this.categoryId); // Vérification dans la console
    }

    this.getCoursesOfCategory();
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
          this.ratingService.getAverageRatingForCourse(f.id).subscribe(
            (avg) => {
              this.averageRatingMap[f.id] = Number(avg.toFixed(1)); // Round to 1 decimal place
            },
            (error) => {
              console.error(
                `Error fetching average rating for course ${f.id}:`,
                error
              );
              this.averageRatingMap[f.id] = 0;
            }
          );

          // Fetch rating count
          this.ratingService.getRatingCountForCourse(f.id).subscribe(
            (count) => {
              this.ratingCountMap[f.id] = count;
            },
            (error) => {
              console.error(
                `Error fetching rating count for course ${f.id}:`,
                error
              );
              this.ratingCountMap[f.id] = 0;
            }
          );

          this.participationServ.getParticipationsByIdCourse(f.id).subscribe(
            (data) => {
              this.listParticipation = data;
              this.totalProgress = this.listParticipation.reduce(
                (sum, participation) => sum + (participation.progress || 0),
                0
              );
            },
            (erreur) => console.log('erreur'),
            () => console.log(this.listParticipation)
          );

          // Fetch payment and participation status
          this.payServ
            .checkPaiement(this.currentUser!.id, f.id)
            .subscribe((hasPaid) => {
              this.paimentMap[f.id] = hasPaid;

              if (hasPaid) {
                this.participationService
                  .checkParticipation(this.currentUser!.id, f.id)
                  .subscribe((hasParticipated) => {
                    this.participationMap[f.id] = hasParticipated;
                    if (hasParticipated && this.currentUser) {
                      this.ratingService
                        .getRatingByUserAndCourse(this.currentUser.id, f.id)
                        .subscribe((ratings) => {
                          if (ratings.length > 0) {
                            this.ratingMap[f.id] = ratings[0].rating;
                          } else {
                            this.ratingMap[f.id] = 0; // No rating yet
                            this.ratingMap[f.id] = 0;
                          }
                        });
                    }
                  });
              } else {
                this.participationMap[f.id] = false;
              }
            });
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

  payer(courseId: number, prix: number, title: string , author: User) {
    const paiement = new PaiementFormation();
    //participation.idp = 0;
    paiement.participant = this.currentUser?.id ?? 0;
    const course = new Formation();
    course.id = courseId;
    paiement.course = course;
    console.log('Données paiement à envoyer :', paiement);
    if (this.currentUser!.balance > prix) {
      Swal.fire({
        title: 'Confirm Payment',
        text: 'Are you sure you want to proceed with the payment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, pay now',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.payServ.addPaiement(paiement).subscribe({
            next: (res) => {
              this.getCoursesOfCategory();
              console.log('prix avant' + this.currentUser!.balance);
              this.currentUser!.balance = this.currentUser!.balance - prix;
              console.log('prix après ' + this.currentUser!.balance);
              //  --**********-------------******************---------------************
              if (this.currentUser) {
                this.userService.updateUser(this.currentUser).subscribe({
                  next: (val: any) => {
                    console.log('balance updated');
                    this.loadCurrentUser;
                      author.balance = author.balance + prix;
                      this.userService.updateUser(author).subscribe({
                        next: (val: any) => {
                          console.log('balance author updated');
                          this.loadCurrentUser;
                        },
                        error: (err: any) => {
                          console.log('balance author not updated ');
                        },
                      });
                  },
                  error: (err: any) => {
                    console.log('paiement non effectué');
                  },
                });
              }

              //  --**********-------------Transaction ---------------************
              if (this.currentUser) {
                this.createTransaction(
                  this.currentUser,
                  prix,
                  TransactionType.PAYMENT,
                  'Course Payment ' + title
                ).subscribe(
                  () => {
                    alert('Withdrawal completed successfully');
                  },
                  (error) => {
                    console.error('Withdrawal transaction failed:', error);
                    alert('Withdrawal failed');
                  }
                );
              }

              //  --**********-------------******************---------------************
              console.log('Paiement ajoutée avec succès', res);
              Swal.fire({
                icon: 'success',
                title: 'Paid!',
                text: 'Your payment has been successfully processed.',
                confirmButtonText: 'OK',
              }).then(() => {
                //window.location.reload();
                this.reloadComponentWithId(this.categoryId); // ← à adapter selon ta logique
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your payment was not processed.', 'error');
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'You don’t have enough balance to proceed.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Got it!',
      });
    }
  }

  reloadComponentWithId(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/coursescat'], { state: { categoryId: id } });
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

  // emojis *******************************************
  ratingMap: { [courseId: number]: number } = {}; // Store ratings for each course
  averageRatingMap: { [courseId: number]: number } = {}; // Store average ratings
  ratingCountMap: { [courseId: number]: number } = {}; // Store rating counts
  rating = 0;
  hoverRating: number | null = null;
  showEmoji = false;
  stars = new Array(5);

  hover(value: number, courseId: number) {
    this.hoverRating = value;
  }

  resetHover() {
    this.hoverRating = null;
  }

  formatAverageRating(rating: number | undefined): string {
    if (rating === undefined || rating === 0) {
      return '0.00';
    }
    // Check if the rating is a whole number
    if (Math.floor(rating) === rating) {
      return rating.toString(); // No decimal for whole numbers (e.g., 3.0 -> '3')
    }
    // Show one decimal place for non-whole numbers (e.g., 2.5 -> '2.5')
    return rating.toFixed(2);
  }

  selectRating(value: number, courseId: number) {
    this.ratingMap[courseId] = value;

    const ratingCourse = new Rating();
    ratingCourse.idUser = this.currentUser?.id ?? 0;
    const course = new Formation();
    course.id = courseId;
    ratingCourse.course = course;
    ratingCourse.rating = value;

    const showEmoji = true;

    this.ratingService
      .getRatingByUserAndCourse(this.currentUser!.id, courseId)
      .subscribe(
        (ratings) => {
          if (ratings.length > 0) {
            ratingCourse.id = ratings[0].id;
            this.ratingService.updateRating(ratingCourse).subscribe(
              (response) => {
                console.log('Rating updated:', response);
                // Refresh average rating and count
                this.ratingService
                  .getAverageRatingForCourse(courseId)
                  .subscribe((avg) => (this.averageRatingMap[courseId] = avg));
                this.ratingService
                  .getRatingCountForCourse(courseId)
                  .subscribe(
                    (count) => (this.ratingCountMap[courseId] = count)
                  );
                Swal.fire({
                  icon: 'success',
                  title: 'Rating Updated',
                  text: 'Your rating has been updated!',
                  confirmButtonText: 'OK',
                });
              },
              (error) => {
                console.error('Error updating rating:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to update rating. Please try again.',
                  confirmButtonText: 'Close',
                });
              }
            );
          } else {
            this.ratingService.addRating(ratingCourse).subscribe(
              (response) => {
                console.log('Rating added:', response);
                // Refresh average rating and count
                this.ratingService
                  .getAverageRatingForCourse(courseId)
                  .subscribe((avg) => (this.averageRatingMap[courseId] = avg));
                this.ratingService
                  .getRatingCountForCourse(courseId)
                  .subscribe(
                    (count) => (this.ratingCountMap[courseId] = count)
                  );
                Swal.fire({
                  icon: 'success',
                  title: 'Rating Submitted',
                  text: 'Thank you for your rating!',
                  confirmButtonText: 'OK',
                });
              },
              (error) => {
                console.error('Error adding rating:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to submit rating. Please try again.',
                  confirmButtonText: 'Close',
                });
              }
            );
          }
        },
        (error) => console.error('Error checking existing rating:', error)
      );

    setTimeout(() => {
      this.showEmoji = false;
    }, 1000);
  }

  getEmoji(value: number): string {
    const emojis = ['😡', '😕', '😐', '🙂', '🤩'];
    return emojis[value - 1] || '';
  }

  // Méthode pour vérifier l'état synchronement
  getButtonState(f: Formation): string {
    if (!this.paimentMap[f.id]) {
      return 'pay';
    } else {
      return this.participationMap[f.id] ? 'exam' : 'participate';
    }
  }
  // --------------------------------- transaction ----------------------------
  private createTransaction(
    recipient: User,
    amount: number,
    transactionType: TransactionType,
    description: string
  ): Observable<any> {
    const transaction: HistoricTransactions = {
      id: null,
      type: transactionType,
      amount: amount,
      description: description,
      date: new Date(),
    };

    return this.userService.addTransaction(recipient.id, transaction);
  }
  // ----------------------rating ---------------------------------------------
}
