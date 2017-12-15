import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCabinetsComponent } from './add-cabinets.component';

describe('AddCabinetsComponent', () => {
  let component: AddCabinetsComponent;
  let fixture: ComponentFixture<AddCabinetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCabinetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCabinetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
