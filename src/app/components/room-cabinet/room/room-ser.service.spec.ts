import { TestBed, inject } from '@angular/core/testing';

import { RoomSerService } from './room-ser.service';

describe('RoomSerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomSerService]
    });
  });

  it('should be created', inject([RoomSerService], (service: RoomSerService) => {
    expect(service).toBeTruthy();
  }));
});
