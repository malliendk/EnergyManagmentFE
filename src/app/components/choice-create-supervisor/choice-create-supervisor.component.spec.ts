import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChoiceCreateSupervisorComponent} from './choice-create-supervisor.component';

describe('ChoiceCreateSupervisorComponent', () => {
  let component: ChoiceCreateSupervisorComponent;
  let fixture: ComponentFixture<ChoiceCreateSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoiceCreateSupervisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceCreateSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
