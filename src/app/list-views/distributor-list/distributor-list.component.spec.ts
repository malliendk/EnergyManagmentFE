import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DistributorListComponent} from './distributor-list.component';

describe('DistributorViewComponent', () => {
  let component: DistributorListComponent;
  let fixture: ComponentFixture<DistributorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
