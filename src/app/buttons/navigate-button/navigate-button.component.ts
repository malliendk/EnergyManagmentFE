import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-navigate-button',
    templateUrl: './navigate-button.component.html',
    styleUrls: ['./navigate-button.component.css'],
    standalone: false
})
export class NavigateButtonComponent {

  @Input() entity!: string | null;
  @Input() suffix!: string | number;

  @Input() isRelativePath!: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  navigateTo(entity: string | null, suffix: string | number) {
    const path = [entity, suffix].filter(part => part !== null);
    if (this.isRelativePath) {
      this.router.navigate(path, {relativeTo: this.route});
    } else {
      this.router.navigateByUrl(`${entity}/${suffix}`)
    }
  }
}
