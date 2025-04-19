import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import Swal from 'sweetalert2';
import { AddFormationComponent } from '../add-formation/add-formation.component';
import { DetailsFormationBackComponent } from '../details-formation-back/details-formation-back.component';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css'],
})
export class FormationsComponent {
  constructor(
    private dialog: MatDialog,
    private formServ: FormationService,
    private router: Router
  ) {}

  listFormations: Formation[] = [];
  @ViewChild('formationTableBody')
  categoryTableBodyRef!: ElementRef<HTMLTableSectionElement>;
  ngOnInit() {
    // this.getFormationsList();

    this.formServ.getCourses().subscribe(
      (data) => (this.listFormations = data),
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
    // this.formServ.getCoursesBySeason().subscribe(
    //   (data) => {
    //     this.lineChartData.datasets[0].data = [
    //       data['Hiver'] || 0,
    //       data['Printemps'] || 0,
    //       data['Été'] || 0,
    //       data['Automne'] || 0,
    //     ];
    //   },
    //   (error) => {
    //     console.log('Error fetching seasonal stats:', error);
    //     Swal.fire('Error', 'Failed to load seasonal statistics.', 'error');
    //   }
    // );
  
    this.formServ.getCoursesBySeason().subscribe(
      (data) => {
        console.log('Seasonal data:', data);
        this.lineChartData.datasets[0].data = [
          data['Hiver'] || 0,
          data['Printemps'] || 0,
          data['Été'] || 0,
          data['Automne'] || 0,
        ];
      },
      (error) => {
        console.log('Error fetching seasonal stats:', error);
        Swal.fire('Error', 'Failed to load seasonal statistics.', 'error');
      }
    );
  }
  getFormationsList() {
    this.formServ.getCourses().subscribe(
      (data) => (this.listFormations = data),
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

  openAddCourseForm() {
    const dialogRef = this.dialog.open(AddFormationComponent, {
      width: '550px',
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
  openParticipantsList(id: number) {
    this.router.navigate(['/participantsList'], {
      state: { formationId: id },
    });
  }

  //------------------------------------------------
  // Chart properties
  public lineChartData: ChartData<'line'> = {
    labels: ['Hiver', 'Printemps', 'Été', 'Automne'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        label: 'Courses by Season',
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Courses by Season' },
    },
  };
  public lineChartType: ChartType = 'line';
}
