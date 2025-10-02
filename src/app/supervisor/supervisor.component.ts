import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Supervisor} from "../dtos/supervisor";
import {SupervisorService} from "../services/supervisor.service";
import {NgClass} from "@angular/common";
import {PerkViewComponent} from "../perk-view/perk-view.component";
import {gridLayout} from "@swimlane/ngx-charts";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {EventComponent} from "../event/event.component";
import {GameDTOService} from "../services/game-dto.service";

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css'],
  imports: [
    NgClass,
    PerkViewComponent
  ],
  standalone: true
})
export class SupervisorComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() isInitiatingGame!: boolean;
  @Input() isDashboardOpen: boolean = false;
  @Output() passSupervisor = new EventEmitter<Supervisor>();
  @Output() passCityView = new EventEmitter<string>();
  @Output() passDTOtoTopLevel = new EventEmitter<ExtendedGameDTO>();

  supervisors: Supervisor[] = [];
  supervisor!: Supervisor;
  remainingResearchTotal!: number;
  upgradeCostPerLevel: number = 500;

  monetizingBaseLevel!: number;
  budgetingBaseLevel!: number;
  politicsBaseLevel!: number;
  engagementBaseLevel!: number;
  innovationBaseLevel!: number;
  researchEfficiency!: number;
  distributionEfficiencyLevel!: number;
  lineResilienceBaseLevel!: number;

  chooseSupervisorText: string = 'Kies je supervisor';
  financeText: string = 'Finance';
  monetizingText: string = 'Monetizing';
  budgetingText: string = 'Budgeting';
  popularityText: string = 'Popularity';
  politicsText: string = 'Politics';
  engagementText: string = 'Engagement';
  researchText: string = 'Research';
  innovationText: string = 'Innovation';
  researchEfficiencyText: string = 'Efficiency';
  electricityGridText: string = 'Grid';
  distributionEfficiencyText: string = 'Distribution Efficiency';
  lineResilienceText: string = 'Line Resilience';

  cityViewText: string = 'buildings';

  constructor(private supervisorService: SupervisorService,
              private gameDTOService: GameDTOService) {
  }

  ngOnInit(): void {
    if (this.isInitiatingGame) {
      this.findAll();
    } else {
      this.supervisor = this.gameDTO.supervisor;
      this.remainingResearchTotal = this.gameDTO.research;
      this.monetizingBaseLevel = this.supervisor.perkGoldIncome;
      this.budgetingBaseLevel = this.supervisor.perkGoldCost;
      this.politicsBaseLevel = this.supervisor.perkPopularityIncome;
      this.engagementBaseLevel = this.supervisor.perkPopularityCost;
      this.innovationBaseLevel = this.supervisor.perkResearchIncome;
      this.researchEfficiency = this.supervisor.perkResearchCost;
      this.distributionEfficiencyLevel = this.supervisor.perkGridEfficiency;
      this.lineResilienceBaseLevel = this.supervisor.perkGridResilience;
    }
  }

  selectSupervisor(supervisor: Supervisor) {
    console.log(supervisor.name)
    this.supervisor = supervisor;
    this.passSupervisor.emit(supervisor);
  }

  findAll(): void {
    this.supervisorService.findAll()
      .subscribe(supervisors => this.supervisors = supervisors);
  }

  getSelected(supervisorId: number) {
    if (this.supervisor) {
      return supervisorId === this.supervisor.id ? 'selected' : '';
    } else {
      return;
    }
  }

  processUpgrade(upgrade: { cost: number; level: number; variableName: string}) {
    this.remainingResearchTotal -= upgrade.cost;
    this.assignLevel(upgrade.level, upgrade.variableName);
  }

  assignLevel(level: number, variableName: string) {
    switch (variableName) {
      case this.monetizingText: this.supervisor.perkGoldIncome = level;
        break;
      case this.budgetingText: this.supervisor.perkGoldCost = level;
        break;
      case this.engagementText: this.supervisor.perkPopularityIncome = level;
        break;
      case this.politicsText: this.supervisor.perkPopularityCost = level;
        break;
      case this.innovationText: this.supervisor.perkResearchIncome = level;
        break;
      case this.researchEfficiencyText: this.supervisor.perkResearchCost = level;
        break;
      case this.distributionEfficiencyText: this.supervisor.perkGridEfficiency = level;
        break;
      case this.lineResilienceText: this.supervisor.perkGridResilience = level;
        break;
    }
  }

  upgrade() {
    this.gameDTO.research -= this.remainingResearchTotal;
    this.gameDTO.supervisor = this.supervisor;
    this.passDTOtoTopLevel.emit(this.gameDTO);
    this.supervisorService.update(this.supervisor);
    this.toggleCityView();
  }

  cancel() {
    this.resetSupervisorLevels();
    this.remainingResearchTotal = this.gameDTO.research;
    this.toggleCityView();
  }

  resetSupervisorLevels() {
    this.supervisor.perkGoldIncome = this.monetizingBaseLevel;
    this.supervisor.perkGoldCost = this.budgetingBaseLevel;
    this.supervisor.perkPopularityIncome = this.politicsBaseLevel;
    this.supervisor.perkPopularityCost = this.engagementBaseLevel;
    this.supervisor.perkResearchIncome = this.innovationBaseLevel;
    this.supervisor.perkResearchCost = this.researchEfficiency;
    this.supervisor.perkGridEfficiency = this.distributionEfficiencyLevel;
    this.supervisor.perkGridResilience = this.lineResilienceBaseLevel;
  }

  toggleCityView() {
    this.passCityView.emit(this.cityViewText);
  }
}
