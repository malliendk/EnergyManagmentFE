import {Component, Input, OnInit} from '@angular/core';
import {GameObject} from "../dtos/gameObject";
import {GameDtoService} from "../services/game-dto.service";

@Component({
    selector: 'app-gridload-dashboard',
    templateUrl: './gridload-dashboard.component.html',
    styleUrls: ['./gridload-dashboard.component.css'],
    standalone: false
})
export class GridloadDashboardComponent implements OnInit {

  mockGameDto!: GameObject;
  singleDashboardView: string = 'table';

  isCollapsed: boolean = false;
  isSingleExpanded: boolean = true;
  isDoubleExpanded: boolean = false;

  singleExpandedCss: any = 'dashboard single-expanded';
  doubleExpandedCss: any = 'dashboard double-expanded';
  fading: string = '';

  btnToggleView: any = 'btn-toggle-view';

  dayWeatherClass = 'moderate'


  constructor(private gameDtoService: GameDtoService) {
  }

  ngOnInit(): void {
    this.gameDtoService.getMockGameObject();
  }

  transition() {
    console.log(this.dayWeatherClass)
    this.dayWeatherClass = this.dayWeatherClass.replace('moderate', 'overcast')
    console.log(this.dayWeatherClass)
  }

  toggleSingleView() {
    if (this.singleDashboardView.includes('table')) {
      this.singleDashboardView = 'chart';
    } else if (this.singleDashboardView.includes('chart')) {
      this.singleDashboardView = 'table';
    }
  }

  toggleDoubleExpand() {
    if (!this.isDoubleExpanded) {
      this.singleExpandedCss += ' expand-to-double';
      setTimeout(() => {
        this.isSingleExpanded = !this.isSingleExpanded;
        this.isDoubleExpanded = !this.isDoubleExpanded;
      }, 500);
    } else if (this.isDoubleExpanded) {
      this.doubleExpandedCss = this.doubleExpandedCss.replace('double-expanded', 'collapse-to-single')
      setTimeout(() => {
        this.isDoubleExpanded = !this.isDoubleExpanded;
        this.isSingleExpanded = !this.isSingleExpanded;
        this.singleExpandedCss = 'dashboard single-expanded';
        this.doubleExpandedCss = 'dashboard double-expanded';
      }, 500)
    }
  }

  toggleCollapseForSingle() {
    if (!this.isCollapsed) {
        this.singleExpandedCss += ' collapse';
        this.fading += ' fade-out'
      } else if (this.isCollapsed) {
        this.singleExpandedCss = this.singleExpandedCss.replace('collapse', 'expand-to-single');
        this.fading = this.fading.replace('fade-out', 'fade-in');
        setTimeout(() => {
          this.singleExpandedCss = 'dashboard single-expanded';
          this.fading = ''
        }, 1000)
      }
      setTimeout(() => this.isCollapsed = !this.isCollapsed, 500)
  }

  toggleCollapseForDouble() {
    if (!this.isCollapsed) {
      this.doubleExpandedCss += ' collapse';
      this.fading += ' fade-out';
    } else if (this.isCollapsed) {
      this.doubleExpandedCss = this.doubleExpandedCss.replace('collapse', 'collapsed-to-double');
      this.fading = 'fade-in'
      console.log(this.fading)
      setTimeout(() => {
        this.doubleExpandedCss = 'dashboard double-expanded';
        this.btnToggleView = 'btn-toggle-view';
        this.fading = '';
      }, 500)
    }
    setTimeout(() => {
      this.isCollapsed = !this.isCollapsed
    }, 400)
  }

  toggleCollapseView(viewType: string, singleOrDouble: string) {

    if (!this.isCollapsed) {
      viewType += ' collapse';
    } else if (this.isCollapsed) {
      viewType = viewType.replace('collapse', `expand-to-${singleOrDouble}` );
      setTimeout(() => {
        this.singleExpandedCss = `dashboard ${singleOrDouble}-expanded`;
      }, 500)
    }
    setTimeout(() => this.isCollapsed = !this.isCollapsed, 500)
  }


  // toggleExpandAll() {
  //   this.isAllExpanded = !this.isAllExpanded;
  //   if (this.isAllExpanded) {
  //     this.isAllExpandedCss += 'expand-to-double-display'
  //   }


}
