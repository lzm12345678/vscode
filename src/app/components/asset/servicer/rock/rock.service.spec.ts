import { TestBed, inject } from '@angular/core/testing';

import { RockService } from './rock.service';

describe('MaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RockService]
    });
  });

  it('should be created', inject([RockService], (service: RockService) => {
    expect(service).toBeTruthy();
  }));
});
