import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { ParticipationFormation } from 'src/app/core/models/GestionFormation/participation-formation';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { ParticipationFormationService } from 'src/app/core/services/GestionFormation/participation-formation.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.css'],
})
export class ParticipantsListComponent {
  @ViewChild('formationTableBody')
  categoryTableBodyRef!: ElementRef<HTMLTableSectionElement>;
  listParticipation: ParticipationFormation[] = [];
  formationId!: number;
  formation?: Formation;
  listUsers: User[] = [];
  user?: User;

  constructor(
    private participationServ: ParticipationFormationService,
    private userService: UserService,
    private formServ : FormationService
  ) {}
  ngOnInit() {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.formationId) {
      this.formationId = navigationState.formationId;
      console.log('ID dans TestComponent:', this.formationId); // Vérification dans la console
    }
    // ************************ get Participations *********************
    this.participationServ
      .getParticipationsByIdCourse(this.formationId)
      .subscribe(
        (data) => (this.listParticipation = data),
        (erreur) => console.log('erreur'),
        () => console.log(this.listParticipation)
      );
    //****************** get users List ********************************
    this.userService.getAllUsers().subscribe(
      (response: User[]) => {
        this.listUsers = response;
      },
      (error) => {
        console.log(error);
      }
    );
    // ********************* get Formation By Id ***************

    this.formServ.getFormationById(this.formationId).subscribe((formation) => {
      this.formation = formation;
    });
  }
  filterTable(searchText: string) {
    searchText = searchText.toLowerCase().trim();
    const tableBody = this.categoryTableBodyRef.nativeElement;

    if (tableBody) {
      const rows = tableBody.getElementsByTagName('tr');

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let showRow = false;

        for (let j = 0; j < cells.length; j++) {
          const cellContent = cells[j].textContent || cells[j].innerText;
          if (cellContent.toLowerCase().indexOf(searchText) > -1) {
            showRow = true;
            break;
          }
        }

        rows[i].style.display = showRow ? '' : 'none';
      }
    }
  }

  getUserById(id: number): { name: string; avatar: string } {
    const user = this.listUsers.find((u) => u.id === id);
    return {
      name: user?.name ?? 'Unknown',
      avatar: user?.image ?? 'default-avatar.png',
    };
  }
  deleteParticipation(id: number) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This Participation will be permanently deleted! ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.participationServ.deleteParticipation(id).subscribe({
            next: (res) => {
              Swal.fire('Deleted!', 'The Participation has been deleted', 'success');
              //------------
               this.participationServ
                 .getParticipationsByIdCourse(this.formationId)
                 .subscribe(
                   (data) => (this.listParticipation = data),
                   (erreur) => console.log('erreur'),
                   () => console.log(this.listParticipation)
                 );
              // -----------
            },
            error: (err) => {
              Swal.fire('Error!', 'An error occurred while deleting.', 'error');
            },
          });
        }
      });
    }
}
