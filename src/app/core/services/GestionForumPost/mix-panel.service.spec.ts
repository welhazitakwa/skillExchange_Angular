import { TestBed } from '@angular/core/testing';

import { MixPanelService } from './mix-panel.service';

describe('MixPanelService', () => {
  let service: MixPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MixPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
