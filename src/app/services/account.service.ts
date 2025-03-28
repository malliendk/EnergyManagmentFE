import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account} from "../dtos/account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  basePrefix = 'http://localhost:8080/api/v1/account';

  constructor(private http: HttpClient) { }
  //
  // filterAccountByType(mockGameObject: ExtendedGameDTO, accountType: string): Account[] {
  //   return mockGameObject.accounts.filter(account =>
  //     account.supplyType == accountType);
  // }

  generateAccountsFrontEnd(accountAmount: number, existingAccounts: Account[]) {
    for (let i = 0; i < accountAmount ; i++) {
      existingAccounts.push()
    }
  }


  generateAccounts(numberOfAccounts: number | null) {
    return this.http.post<Account[]>( this.basePrefix+'/', { numberOfAccounts });
  }
  findAll() {
    return this.http.get<Account[]>(this.basePrefix);
  }

  findAllByLocality(localityName: string) {
    return this.http.get<Account[]>(`${this.basePrefix} + '/' + ${localityName}`);
  }

  findAllByDistributor(distributorName: string) {
    return this.http.get<Account[]>(`${this.basePrefix} + '/' + ${distributorName}`);
  }

  resetAccounts() {
    return this.http.get<Account[]>(`${this.basePrefix}/reset`);
  }

  startOptimizeSupply() {
    console.log("button has been pressed and method executed")
    return this.http.put<Account[]>(`${this.basePrefix}/optimize/start`, {});
  }

  stopOptimizeSupply() {
    return this.http.put(`${this.basePrefix}/optimize/stop`, {})
  }
}
