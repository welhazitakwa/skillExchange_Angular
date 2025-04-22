import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import * as L from 'leaflet';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {
  events: Events[] = [];
  filteredEvents: Events[] = [];
  searchText: string = '';
  sortColumn: keyof Events = 'eventName';
  sortDirection: string = 'asc';
  isAddEventModalOpen: boolean = false;
  isStatsModalOpen: boolean = false;
  eventToEdit: Events | null = null;
  eventToDelete: Events | null = null;
  filterForm: FormGroup;
  showFilters: boolean = true;
  showCalendar: boolean = false;
  calendarOptions: CalendarOptions;
  showMap: { [key: number]: boolean } = {};
  activeChartType: 'doughnut' | 'bar' | 'line' | null = null; // Nouvelle propriété pour le type de diagramme actif

  // Données pour le diagramme en donut (répartition par lieu)
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#007bff', '#dc3545', '#28a745', '#ffc107', '#17a2b8'],
    }]
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Répartition des événements par lieu' }
    }
  };

  // Données pour l'histogramme (nombre max de participants)
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Max Participants',
      backgroundColor: '#007bff'
    }]
  };
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Nombre maximum de participants par événement' }
    }
  };

  // Données pour le diagramme en ligne (évolution par mois)
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Événements par mois',
      borderColor: '#007bff',
      fill: false
    }]
  };
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Évolution des événements par mois' }
    }
  };

  constructor(private eventsService: EventsService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      place: [''],
      minParticipants: [null],
      maxParticipants: [null],
      startDate: [null],
      endDate: [null],
      hasImages: [false]
    });

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      events: [],
      eventColor: '#fd7e14',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      eventClick: this.handleEventClick.bind(this),
      height: 'auto',
      eventDidMount: (info) => {
        const tooltipContent = `
          <strong>${info.event.title}</strong><br>
          Place: ${info.event.extendedProps['place'] || 'N/A'}<br>
          Date: ${info.event.start ? new Date(info.event.start).toLocaleDateString('fr-FR') : 'N/A'}<br>
          Participants: ${info.event.extendedProps['nbr_max'] || 'N/A'}
        `;
        info.el.setAttribute('title', tooltipContent.replace(/<br>/g, '\n'));
      }
    };
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEvents().subscribe(
      (data) => {
        console.log('Loaded events:', data);
        this.events = data.map(event => ({
          ...event,
          images: event.images ? event.images.map(img => ({
            ...img,
            images: img.images || ''
          })) : []
        }));
        this.applyFilters();
        this.updateChartData();
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    );
  }

  toggleMap(eventId: number): void {
    this.showMap[eventId] = !this.showMap[eventId];
    if (this.showMap[eventId]) {
      setTimeout(() => this.initMap(eventId), 0);
    }
  }

  initMap(eventId: number): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    const event = this.events.find(e => e.idEvent === eventId);
    if (!event || !event.latitude || !event.longitude) return;

    const mapElement = document.getElementById(`map-${eventId}`);
    if (!mapElement) return;

    const coords: L.LatLngTuple = [event.latitude, event.longitude];
    const map = L.map(mapElement).setView(coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coords).addTo(map);
  }

  applyFilters(): void {
    let filteredEvents = [...this.events];

    if (this.searchText.trim()) {
      const searchTerm = this.searchText.toLowerCase().trim();
      filteredEvents = filteredEvents.filter(event => {
        const eventName = event.eventName?.toLowerCase() || '';
        const description = event.description?.toLowerCase() || '';
        const place = event.place?.toLowerCase() || '';
        const nbrMax = event.nbr_max?.toString() || '';
        const startDate = event.startDate
          ? new Date(event.startDate).toLocaleDateString('fr-FR')
          : '';
        const endDate = event.endDate
          ? new Date(event.endDate).toLocaleDateString('fr-FR')
          : '';

        return (
          eventName.includes(searchTerm) ||
          description.includes(searchTerm) ||
          place.includes(searchTerm) ||
          nbrMax.includes(searchTerm) ||
          startDate.includes(searchTerm) ||
          endDate.includes(searchTerm)
        );
      });
    }

    const filters = this.filterForm.value;

    if (filters.place?.trim()) {
      const placeFilter = filters.place.toLowerCase().trim();
      filteredEvents = filteredEvents.filter(event =>
        event.place?.toLowerCase().includes(placeFilter)
      );
    }

    if (filters.minParticipants != null) {
      filteredEvents = filteredEvents.filter(
        event => event.nbr_max != null && event.nbr_max >= filters.minParticipants
      );
    }
    if (filters.maxParticipants != null) {
      filteredEvents = filteredEvents.filter(
        event => event.nbr_max != null && event.nbr_max <= filters.maxParticipants
      );
    }

    if (filters.startDate) {
      const startFilter = new Date(filters.startDate);
      filteredEvents = filteredEvents.filter(
        event => event.startDate && new Date(event.startDate) >= startFilter
      );
    }
    if (filters.endDate) {
      const endFilter = new Date(filters.endDate);
      filteredEvents = filteredEvents.filter(
        event => event.endDate && new Date(event.endDate) <= endFilter
      );
    }

    if (filters.hasImages) {
      filteredEvents = filteredEvents.filter(
        event => event.images && event.images.length > 0
      );
    }

    if (this.sortColumn) {
      filteredEvents.sort((a, b) => {
        const valA = a[this.sortColumn];
        const valB = b[this.sortColumn];

        if (valA == null && valB == null) return 0;
        if (valA == null) return this.sortDirection === 'asc' ? -1 : 1;
        if (valB == null) return this.sortDirection === 'asc' ? 1 : -1;

        if (this.sortColumn === 'startDate' || this.sortColumn === 'endDate') {
          const dateA = new Date(valA as string | Date);
          const dateB = new Date(valB as string | Date);
          return this.sortDirection === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        } else if (this.sortColumn === 'nbr_max') {
          const numA = Number(valA);
          const numB = Number(valB);
          return this.sortDirection === 'asc' ? numA - numB : numB - numA;
        } else {
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          return this.sortDirection === 'asc'
            ? strA < strB ? -1 : strA > strB ? 1 : 0
            : strB < strA ? -1 : strB > strA ? 1 : 0;
        }
      });
    }

    this.filteredEvents = filteredEvents;
    console.log('Filtered events:', this.filteredEvents.length);

    this.updateCalendarEvents();
    this.updateChartData();
  }

  updateChartData(): void {
    // Données pour le diagramme en donut (par lieu)
    const placeCounts = this.filteredEvents.reduce((acc, event) => {
      const place = event.place || 'Unknown';
      acc[place] = (acc[place] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.doughnutChartData = {
      labels: Object.keys(placeCounts),
      datasets: [{
        data: Object.values(placeCounts),
        backgroundColor: ['#007bff', '#dc3545', '#28a745', '#ffc107', '#17a2b8'],
      }]
    };

    // Données pour l'histogramme (nombre max de participants)
    this.barChartData = {
      labels: this.filteredEvents.map(event => event.eventName || 'Unnamed'),
      datasets: [{
        data: this.filteredEvents.map(event => event.nbr_max || 0),
        label: 'Max Participants',
        backgroundColor: '#007bff'
      }]
    };

    // Données pour le diagramme en ligne (par mois)
    const eventsByMonth = this.filteredEvents.reduce((acc, event) => {
      if (event.startDate) {
        const month = new Date(event.startDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    this.lineChartData = {
      labels: Object.keys(eventsByMonth),
      datasets: [{
        data: Object.values(eventsByMonth),
        label: 'Événements par mois',
        borderColor: '#007bff',
        fill: false
      }]
    };
  }

  updateCalendarEvents(): void {
    const calendarEvents: EventInput[] = this.filteredEvents
      .filter(event => event.startDate)
      .map(event => ({
        title: event.eventName || 'Unnamed Event',
        start: event.startDate,
        end: event.endDate || event.startDate,
        extendedProps: {
          place: event.place,
          nbr_max: event.nbr_max,
          description: event.description
        }
      }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: calendarEvents
    };
  }

  handleEventClick(info: any): void {
    const event = info.event;
    alert(
      `Event: ${event.title}\n` +
      `Date: ${event.start ? new Date(event.start).toLocaleDateString('fr-FR') : 'N/A'}\n` +
      `Place: ${event.extendedProps.place || 'N/A'}\n` +
      `Max Participants: ${event.extendedProps.nbr_max || 'N/A'}\n` +
      `Description: ${event.extendedProps.description || 'N/A'}`
    );
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  openStatsModal(): void {
    this.isStatsModalOpen = true;
    this.activeChartType = null; // Aucun diagramme affiché par défaut
  }

  closeStatsModal(): void {
    this.isStatsModalOpen = false;
    this.activeChartType = null; // Réinitialiser le type de diagramme
  }

  setActiveChartType(chartType: 'doughnut' | 'bar' | 'line'): void {
    this.activeChartType = chartType;
  }

  exportToCsv(): void {
    if (this.filteredEvents.length === 0) {
      console.warn('No events to export');
      return;
    }

    const headers = [
      'Event Name',
      'Start Date',
      'End Date',
      'Place',
      'Latitude',
      'Longitude',
      'Max Participants',
      'Description',
      'Images'
    ];

    const rows = this.filteredEvents.map(event => {
      const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR');
      };

      const escapeCsv = (value: any): string => {
        if (value == null) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return [
        escapeCsv(event.eventName),
        formatDate(event.startDate),
        formatDate(event.endDate),
        escapeCsv(event.place),
        escapeCsv(event.latitude || ''),
        escapeCsv(event.longitude || ''),
        escapeCsv(event.nbr_max),
        escapeCsv(event.description),
        escapeCsv(event.images ? event.images.length : 0)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `events_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('CSV exported:', this.filteredEvents.length, 'events');
  }

  exportToPdf(): void {
    if (this.filteredEvents.length === 0) {
      console.warn('No events to export');
      return;
    }

    const doc = new jsPDF();
    const exportDate = new Date().toLocaleDateString('fr-FR');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(253, 126, 20);
    doc.text('Skill', 10, 15);
    doc.setTextColor(0, 0, 0);
    doc.text('Exchange', 28, 15);
    doc.setFontSize(18);
    doc.setTextColor(253, 126, 20);
    doc.text('Event Management Report', 10, 30);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${exportDate}`, 10, 40);

    // Capturer les diagrammes
    const captureCharts = async () => {
      let currentY = 50;

      // Diagramme en donut
      const doughnutCanvas = document.querySelector('canvas[baseChart][type="doughnut"]') as HTMLCanvasElement;
      if (doughnutCanvas) {
        const canvas = await html2canvas(doughnutCanvas);
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, currentY, 190, 100);
        currentY += 110;
      }

      // Histogramme
      const barCanvas = document.querySelector('canvas[baseChart][type="bar"]') as HTMLCanvasElement;
      if (barCanvas) {
        const canvas = await html2canvas(barCanvas);
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, currentY, 190, 100);
        currentY += 110;
      }

      // Diagramme en ligne
      const lineCanvas = document.querySelector('canvas[baseChart][type="line"]') as HTMLCanvasElement;
      if (lineCanvas) {
        const canvas = await html2canvas(lineCanvas);
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, currentY, 190, 100);
        currentY += 110;
      }

      // Ajouter le tableau
      const tableData = this.filteredEvents.map(event => [
        event.eventName || '',
        event.startDate ? new Date(event.startDate).toLocaleDateString('fr-FR') : '',
        event.endDate ? new Date(event.endDate).toLocaleDateString('fr-FR') : '',
        event.place || '',
        event.latitude?.toString() || '',
        event.longitude?.toString() || '',
        event.nbr_max?.toString() || '',
        event.description || ''
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Event Name', 'Start Date', 'End Date', 'Place', 'Latitude', 'Longitude', 'Max Participants', 'Description']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [253, 126, 20], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 30 },
          7: { cellWidth: 50 }
        }
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }

      doc.save(`events_${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('PDF exported:', this.filteredEvents.length, 'events');
    };

    // Ouvre temporairement le modal pour s'assurer que tous les diagrammes sont rendus
    this.isStatsModalOpen = true;
    this.activeChartType = 'doughnut'; // Rendre le premier diagramme
    setTimeout(() => {
      this.activeChartType = 'bar'; // Rendre le deuxième
      setTimeout(() => {
        this.activeChartType = 'line'; // Rendre le troisième
        setTimeout(() => {
          captureCharts().then(() => {
            this.isStatsModalOpen = false;
            this.activeChartType = null; // Réinitialiser
          });
        }, 100);
      }, 100);
    }, 100);
  }

  exportToExcel(): void {
    if (this.filteredEvents.length === 0) {
      console.warn('No events to export');
      return;
    }

    const data = this.filteredEvents.map(event => ({
      'Event Name': event.eventName || '',
      'Start Date': event.startDate ? new Date(event.startDate).toLocaleDateString('fr-FR') : '',
      'End Date': event.endDate ? new Date(event.endDate).toLocaleDateString('fr-FR') : '',
      'Place': event.place || '',
      'Latitude': event.latitude?.toString() || '',
      'Longitude': event.longitude?.toString() || '',
      'Max Participants': event.nbr_max?.toString() || '',
      'Description': event.description || '',
      'Images': event.images ? event.images.length : 0
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '28A745' } },
      alignment: { horizontal: 'center' }
    };
    
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:I1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell) cell.s = headerStyle;
    }

    const colWidths = [
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 120 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 200 },
      { wpx: 80 }
    ];
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');

    XLSX.writeFile(wb, `events_${new Date().toISOString().split('T')[0]}.xlsx`);
    console.log('Excel exported:', this.filteredEvents.length, 'events');
  }

  clearFilters(): void {
    this.filterForm.reset({
      place: '',
      minParticipants: null,
      maxParticipants: null,
      startDate: null,
      endDate: null,
      hasImages: false
    });
    this.searchText = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  sort(column: keyof Events): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  openAddEventModal(): void {
    this.isAddEventModalOpen = true;
  }

  closeAddEventModal(): void {
    this.isAddEventModalOpen = false;
  }

  handleAddEvent(eventData: any): void {
    console.log('Adding new event:', eventData);
    this.eventsService.addEvent(eventData).subscribe({
      next: (newEvent) => {
        console.log('Event added:', newEvent);
        this.events.push(newEvent);
        this.applyFilters();
        this.closeAddEventModal();
      },
      error: (err) => {
        console.error('Error adding event:', err);
      }
    });
  }

  openEditEventModal(event: Events): void {
    this.eventToEdit = event;
  }

  openDeleteEventModal(event: Events): void {
    this.eventToDelete = event;
  }

  handleEventUpdate(updatedEvent: Events): void {
    this.loadEvents();
    this.eventToEdit = null;
  }

  handleEventDelete(): void {
    if (this.eventToDelete && this.eventToDelete.idEvent) {
      this.eventsService.deleteEvent(this.eventToDelete.idEvent).subscribe({
        next: () => {
          this.loadEvents();
          this.eventToDelete = null;
        },
        error: (err) => {
          console.error('Error deleting event:', err);
        }
      });
    }
  }

  closeEditModal(): void {
    this.eventToEdit = null;
  }

  closeDeleteModal(): void {
    this.eventToDelete = null;
  }

  handleImageError(event: Event): void {
    console.warn('Image failed to load:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/placeholder-image.jpg';
  }
}