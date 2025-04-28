import { TestBed } from '@angular/core/testing';

import { MixPanelAnalyticsService } from './mix-panel-analytics.service';

describe('MixPanelAnalyticsService', () => {
  let service: MixPanelAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MixPanelAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
