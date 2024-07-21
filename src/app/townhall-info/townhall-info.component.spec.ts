import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownhallInfoComponent } from './townhall-info.component';

describe('TownhallInfoComponent', () => {
  let component: TownhallInfoComponent;
  let fixture: ComponentFixture<TownhallInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownhallInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownhallInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
