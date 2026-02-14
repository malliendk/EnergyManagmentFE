import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PowerlinePurchaseComponent} from './powerline-purchase.component';

describe('PowerlinePurchaseComponent', () => {
  let component: PowerlinePurchaseComponent;
  let fixture: ComponentFixture<PowerlinePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerlinePurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerlinePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
