import { TestBed } from '@angular/core/testing';

import { AiProductService } from './ai-product.service';

describe('AiProductService', () => {
  let service: AiProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
