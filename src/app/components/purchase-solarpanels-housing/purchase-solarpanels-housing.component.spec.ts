import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PurchaseSolarpanelsHousingComponent} from './purchase-solarpanels-housing.component';

describe('PurchaseSolarpanelsHousingComponent', () => {
  let component: PurchaseSolarpanelsHousingComponent;
  let fixture: ComponentFixture<PurchaseSolarpanelsHousingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseSolarpanelsHousingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseSolarpanelsHousingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
