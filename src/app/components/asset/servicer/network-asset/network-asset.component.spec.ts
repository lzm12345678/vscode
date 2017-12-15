import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAssetComponent } from './network-asset.component';

describe('NetworkAssetComponent', () => {
  let component: NetworkAssetComponent;
  let fixture: ComponentFixture<NetworkAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
