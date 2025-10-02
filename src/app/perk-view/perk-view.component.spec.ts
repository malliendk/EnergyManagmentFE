import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerkViewComponent } from './perk-view.component';

describe('PerkViewComponent', () => {
  let component: PerkViewComponent;
  let fixture: ComponentFixture<PerkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerkViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
