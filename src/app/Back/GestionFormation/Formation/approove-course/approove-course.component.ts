import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import Swal from 'sweetalert2';
import { DetailsFormationBackComponent } from '../details-formation-back/details-formation-back.component';

@Component({
  selector: 'app-approove-course',
  templateUrl: './approove-course.component.html',
  styleUrls: ['./approove-course.component.css'],
})
export class ApprooveCourseComponent {
  constructor(
    private dialog: MatDialog,
    private formServ: FormationService,
    private router: Router
  ) {}

  listFormations: Formation[] = [];
  filteredCourses: Formation[] = [];
  searchText: string = '';
  approvalStatus: string = ''; // '', 'approved', 'pending'

  @ViewChild('formationTableBody')
  categoryTableBodyRef!: ElementRef<HTMLTableSectionElement>;
  ngOnInit() {
    // this.getFormationsList();

    this.formServ.getCourses().subscribe(
      (data) => {
        this.listFormations = data;
        this.filteredCourses = [...this.listFormations];
        this.applyFilters();
      },
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
  }
  getFormationsList() {
    this.formServ.getCourses().subscribe(
      (data) => {
        this.listFormations = data;
        this.filteredCourses = [...this.listFormations];
        this.applyFilters();
      },
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
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

  deleteCourse(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This Course will be permanently deleted! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formServ.deleteFormation(id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', 'Your Course has been deleted', 'success');
            this.getFormationsList();
          },
          error: (err) => {
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
          },
        });
      }
    });
  }
  approoveDiapproove(id: number, currentState: number) {
    const action = currentState === 1 ? 'disapprove' : 'approve';
    const successMessage =
      currentState === 1
        ? 'The course has been disapproved.'
        : 'The course has been approved.';

    Swal.fire({
      title: `Are you sure you want to ${action} this course?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it`,
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formServ.approoveDiapproove(id).subscribe({
          next: () => {
            Swal.fire('Success!', successMessage, 'success');
            this.getFormationsList();
          },
          error: () => {
            Swal.fire('Error!', 'An error occurred while updating.', 'error');
          },
        });
      }
    });
  }

  openDetailsCourse(formId: number) {
    const dialogRef = this.dialog.open(DetailsFormationBackComponent, {
      data: { id: formId },
      //width: '1000px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getFormationsList();
        }
      },
      error: console.log,
    });
  }

  applyFilters(): void {
    this.filteredCourses = this.listFormations.filter((course) => {
      const matchesSearch =
        !this.searchText ||
        course.title.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesApproval =
        !this.approvalStatus ||
        (this.approvalStatus === 'approved' && course.approoved) ||
        (this.approvalStatus === 'pending' && !course.approoved);

      return matchesSearch && matchesApproval;
    });
  }
}
