import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorViewComponent } from './distributor-list.component';

describe('DistributorViewComponent', () => {
  let component: DistributorViewComponent;
  let fixture: ComponentFixture<DistributorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
