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

  // Available chart types
  chartTypes: { value: ChartType; label: string }[] = [
    { value: 'bar', label: 'Bar' },
    { value: 'pie', label: 'Pie' },
    { value: 'line', label: 'Line' },
    { value: 'doughnut', label: 'Doughnut' },
  ];
  selectedChartType: ChartType = 'bar'; // Default chart type

  // Store monthly data for reuse
  private monthlyData: number[] = Array(12).fill(0);

  ngOnInit() {
    this.formServ.getCourses().subscribe(
      (data) => (this.listFormations = data),
      (error) => console.log('Error fetching courses:', error),
      () => console.log('Courses loaded:', this.listFormations)
    );

    this.formServ.getCoursesBySeason().subscribe(
      (data) => {
        console.log('Monthly data:', data);
        this.monthlyData = [
          data['January'] || 0,
          data['February'] || 0,
          data['March'] || 0,
          data['April'] || 0,
          data['May'] || 0,
          data['June'] || 0,
          data['July'] || 0,
          data['August'] || 0,
          data['September'] || 0,
          data['October'] || 0,
          data['November'] || 0,
          data['December'] || 0,
        ];
        // Populate data based on current chart type
        this.updateChartData();
      },
      (error) => {
        console.log('Error fetching monthly stats:', error);
        Swal.fire('Error', 'Failed to load monthly statistics.', 'error');
      }
    );
  }

  // Helper method to update chart data based on chart type
  private updateChartData() {
    if (
      this.selectedChartType === 'pie' ||
      this.selectedChartType === 'doughnut'
    ) {
      // Single dataset for Pie and Doughnut
      this.lineChartData = {
        ...this.pieDoughnutChartData,
        datasets: [
          {
            ...this.pieDoughnutChartData.datasets[0],
            data: this.monthlyData,
          },
        ],
      };
    } else {
      // Multiple datasets for Bar and Line
      this.lineChartData = {
        ...this.barLineChartData,
        datasets: this.barLineChartData.datasets.map((dataset, index) => ({
          ...dataset,
          data: Array(12)
            .fill(0)
            .map((_, i) => (i === index ? this.monthlyData[index] : 0)),
        })),
      };
    }
    this.lineChartData = { ...this.lineChartData };
  }

  // Handle chart type change
  onChartTypeChange() {
    this.lineChartType = this.selectedChartType;
    // Update chart data based on type
    this.updateChartData();
    // Adjust chart options based on type
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 16,
            padding: 10,
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: `Courses by Month (${this.selectedChartType})`,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const month = this.lineChartData.labels![context.dataIndex];
              const value = context.raw as number;
              return `${month}: ${value} courses`;
            },
          },
        },
      },
      scales:
        this.selectedChartType === 'pie' ||
        this.selectedChartType === 'doughnut'
          ? {}
          : {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Courses' },
              },
              x: {
                title: { display: true, text: 'Month' },
                ticks: {
                  autoSkip: false,
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
            },
    };
    // Adjust canvas height based on chart type
    this.chartHeight =
      this.selectedChartType === 'pie' || this.selectedChartType === 'doughnut'
        ? 150
        : 200;
  }

  getFormationsList() {
    this.formServ.getCourses().subscribe(
      (data) => (this.listFormations = data),
      (error) => console.log('Error fetching courses:', error),
      () => console.log('Courses loaded:', this.listFormations)
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
      text: 'This Course will be permanently deleted!',
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

  // Chart properties for Pie and Doughnut (single dataset)
  public pieDoughnutChartData: ChartData<'pie' | 'doughnut'> = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
          '#ffcd56',
          '#4bc0c0',
          '#36a2eb',
          '#ff6384',
          '#9966ff',
          '#ff9f40',
        ],
        borderColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
          '#ffcd56',
          '#4bc0c0',
          '#36a2eb',
          '#ff6384',
          '#9966ff',
          '#ff9f40',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart properties for Bar and Line (multiple datasets)
  public barLineChartData: ChartData<'bar' | 'line'> = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        data: [],
        label: 'January',
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'February',
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'March',
        backgroundColor: '#ffce56',
        borderColor: '#ffce56',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'April',
        backgroundColor: '#4bc0c0',
        borderColor: '#4bc0c0',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'May',
        backgroundColor: '#9966ff',
        borderColor: '#9966ff',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'June',
        backgroundColor: '#ff9f40',
        borderColor: '#ff9f40',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'July',
        backgroundColor: '#ffcd56',
        borderColor: '#ffcd56',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'August',
        backgroundColor: '#4bc0c0',
        borderColor: '#4bc0c0',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'September',
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'October',
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'November',
        backgroundColor: '#9966ff',
        borderColor: '#9966ff',
        borderWidth: 1,
        fill: false,
      },
      {
        data: [],
        label: 'December',
        backgroundColor: '#ff9f40',
        borderColor: '#ff9f40',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  public lineChartData: ChartData<'bar' | 'pie' | 'line' | 'doughnut'> =
    this.barLineChartData; // Default to Bar/Line data

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 16,
          padding: 10,
          font: {
            size: 14,
          },
        },
      },
      title: { display: true, text: 'Courses by Month' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const month = this.lineChartData.labels![context.dataIndex];
            const value = context.raw as number;
            return `${month}: ${value} courses`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Courses' },
      },
      x: {
        title: { display: true, text: 'Month' },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  public lineChartType: ChartType = 'bar';
  public chartHeight: number = 200;
}
