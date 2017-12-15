import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmBadgeComponent } from './alarm-badge.component';

describe('AlarmBadgeComponent', () => {
  let component: AlarmBadgeComponent;
  let fixture: ComponentFixture<AlarmBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
