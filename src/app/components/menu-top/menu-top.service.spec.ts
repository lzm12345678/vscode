import { TestBed, inject } from '@angular/core/testing';

import { MenuTopService } from './menu-top.service';

describe('MenuTopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuTopService]
    });
  });

  it('should be created', inject([MenuTopService], (service: MenuTopService) => {
    expect(service).toBeTruthy();
  }));
});
