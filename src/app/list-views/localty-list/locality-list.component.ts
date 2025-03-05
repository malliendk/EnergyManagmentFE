// import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
// import {LocalityService} from "../../services/locality.service";
// import {ActivatedRoute, Router} from "@angular/router";
// import {Locality} from "../../dtos/locality";
//
// @Component({
//     selector: 'app-localty-list',
//     templateUrl: './locality-list.component.html',
//     styleUrls: ['./locality-list.component.css'],
//     standalone: false
// })
// export class LocalityListComponent implements OnInit{
//
//   localities : Locality[] = [];
//   localityId?: number;
//   showLocalityDetails = false;
//   @Input() supervisorName = '';
//   @Output() localitySelected = new EventEmitter<string>();
//
//   constructor(private localityService: LocalityService) {
//   }
//
//   ngOnInit(): void {
//     if (this.supervisorName) {
//       this.findAllBySupervisor(this.supervisorName);
//     } else {
//       this.findAll();
//     }
//   }
//
//   findAll() {
//     this.localityService.findAll()
//       .subscribe(localities => {
//         localities.forEach(locality => this.getImage(locality));
//         this.localities = localities;
//       })
//   }
//
//   findAllBySupervisor(lastName: string) {
//     return this.localityService.findAllBySupervisor(lastName)
//       .subscribe(localities => {
//         localities.forEach(locality => this.getImage(locality));
//         this.localities = localities;
//       });
//   }
//
//   getImage(locality: Locality) {
//     this.localityService.getImage(locality.name)
//       .subscribe(blob => {
//         locality.image = URL.createObjectURL(blob);
//       })
//   }
//
//   toggleLocalityDetails(localityId: number, localityName: string) {
//     this.showLocalityDetails = true;
//     this.localityId = localityId;
//     this.localitySelected.emit(localityName);
//   }
// }
