import {Component, OnInit} from '@angular/core';
import {Account} from "../../dtos/account";
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../services/account.service";

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.css'],
    standalone: false
})
export class AccountListComponent implements OnInit{

  accounts: Account[] = [];

  constructor(private accountService: AccountService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const localityName = this.route.snapshot.paramMap.get('localityName');
    if (localityName != null) {
      this.findAllByLocality(localityName);
    } else {
      this.findAll();
    }
  }

  findAll() {
    this.accountService.findAll()
      .subscribe(response => this.accounts = response);
  }

  findAllByLocality(localityName: string) {
    this.accountService.findAllByLocality(localityName)
      .subscribe(response => this.accounts = response);
  }

}
