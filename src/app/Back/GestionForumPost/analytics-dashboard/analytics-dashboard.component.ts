import { Component, OnInit } from '@angular/core';
import { MixPanelAnalyticsService } from 'src/app/core/services/GestionForumPost/mix-panel-analytics.service';

interface EventData {
  name: string;
  properties: {
    userEmail?: string;
    $device?: string; // Autres propriétés
    [key: string]: any;
  };
  time: number; // Ou string, selon le format de event.time
}

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  eventData: EventData[] = [];

  constructor(private mixPanelAnalyticsService: MixPanelAnalyticsService) {}

  ngOnInit(): void {
    this.loadEventData();
  }

  loadEventData() {
    this.mixPanelAnalyticsService.getEventData('Ajout Reaction Post', '2025-01-01', '2025-12-12')
      .subscribe((data: EventData[]) => {
        this.eventData = data;
      });
  }
}
