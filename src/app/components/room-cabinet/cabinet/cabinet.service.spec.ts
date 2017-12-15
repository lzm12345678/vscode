import { TestBed, inject } from '@angular/core/testing';

import { CabinetService } from './cabinet.service';

describe('CabinetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CabinetService]
    });
  });

  it('should be created', inject([CabinetService], (service: CabinetService) => {
    expect(service).toBeTruthy();
  }));
});
