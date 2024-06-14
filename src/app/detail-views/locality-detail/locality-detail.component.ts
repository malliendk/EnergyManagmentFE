import {Component, Input, OnInit} from '@angular/core';
import {LocalityService} from "../../services/locality.service";
import {ActivatedRoute} from "@angular/router";
import {Locality} from "../../dtos/locality";

@Component({
  selector: 'app-locality-detail',
  templateUrl: './locality-detail.component.html',
  styleUrls: ['./locality-detail.component.css']
})
export class LocalityDetailComponent implements OnInit {

  locality!: Locality;
  @Input() localityId?: number;


  constructor(private localityService: LocalityService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id != null) {
      this.findById(id);
    }
  }

  private findById(id: number) {
    this.localityService.findById(id)
      .subscribe(locality => {
          this.getImage(locality.name);
          this.locality = locality;
      })
  }

  private getImage(imageName: string) {
    this.localityService.getImage(imageName)
      .subscribe(blob => this.locality.image = URL.createObjectURL(blob));
  }
}
