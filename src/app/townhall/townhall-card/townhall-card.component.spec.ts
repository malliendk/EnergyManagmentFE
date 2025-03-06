import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TownhallCardComponent} from './townhall-card.component';

describe('TownhallInfoCardComponent', () => {
  let component: TownhallCardComponent;
  let fixture: ComponentFixture<TownhallCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownhallCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownhallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
