import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account} from "../account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'http://localhost:8080/api/v1/account';
  constructor(private http: HttpClient) { }

  generateAccounts(numberOfAccounts: number | null) {
    return this.http.post<Account[]>(this.baseUrl, { numberOfAccounts });
  }
  findAll() {
    return this.http.get<Account[]>(this.baseUrl);
  }

  findAllByLocality(localityName: string) {
    return this.http.get<Account[]>(`${this.baseUrl} + '/' + ${localityName}`)
  }

  getShortageAccounts() {
    return this.http.get<Account[]>(`${this.baseUrl}/shortage`);
  }

  getOptimalAccounts() {
    return this.http.get<Account[]>(`${this.baseUrl}/optimal`);
  }

  getSurplusAccounts() {
    return this.http.get<Account[]>(`${this.baseUrl}/surplus`);
  }

  resetAccounts() {
    return this.http.get<Account[]>(`${this.baseUrl}/reset`);
  }

  startOptimizeSupply() {
    console.log("button has been pressed and method executed")
    return this.http.put<Account[]>(`${this.baseUrl}/optimize/start`, {});
  }

  stopOptimizeSupply() {
    return this.http.put(`${this.baseUrl}/optimize/stop`, {})
  }
}
