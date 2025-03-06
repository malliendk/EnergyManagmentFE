import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CampaignTypeCardComponent} from './campaign-type-card.component';

describe('CampaignTypeCardComponent', () => {
  let component: CampaignTypeCardComponent;
  let fixture: ComponentFixture<CampaignTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignTypeCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
