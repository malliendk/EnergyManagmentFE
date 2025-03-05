// import {Component, OnInit} from '@angular/core';
// import {DistributorService} from "../../services/distributor.service";
// import {Distributor} from "../../dtos/distributor";
// import {ActivatedRoute, Router} from "@angular/router";
//
// @Component({
//     selector: 'app-distributor-view',
//     templateUrl: './distributor-list.component.html',
//     styleUrls: ['./distributor-list.component.css'],
//     standalone: false
// })
// export class DistributorListComponent implements OnInit{
//
//   distributors: Distributor[] = [];
//
//   constructor(private distributorService: DistributorService,
//               private router: Router,
//               private route: ActivatedRoute) {
//   }
//
//   ngOnInit(): void {
//     this.findAll()
//   }
//
//   findAll() {
//     this.distributorService.findAll()
//       .subscribe(distributors => {
//         distributors.forEach(distributor => this.getImage(distributor))
//         this.distributors = distributors;
//       });
//   }
//
//   getImage(distributor: Distributor) {
//     this.distributorService.getImage(distributor.name)
//       .subscribe(blob => {
//         distributor.image = URL.createObjectURL(blob);
//       });
//   }
//
//
//   navigateToDistributor(distributorId: number) {
//     this.router.navigate([distributorId], { relativeTo: this.route});
//   }
// }
