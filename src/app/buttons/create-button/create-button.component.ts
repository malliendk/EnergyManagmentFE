import {Component, EventEmitter, Input, Output} from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-create-button',
  templateUrl: './create-button.component.html',
  styleUrls: ['./create-button.component.css']
})
export class CreateButtonComponent {

  @Input() entity: any;
  @Output() postRequest = new EventEmitter<{ status: string, data?: any, error?: any }>();

  constructor(private http: HttpClient) {
  }

  post(entity: any) {
    let url = `http://localhost:8080/${entity}`;
    return this.http.post(url, this.entity)
      .subscribe({
        next: response => {
          this.postRequest.emit({status: 'success', data: response})
        },
        error: error => {
          this.postRequest.emit({status: 'failed', error: error})
        }
      });
  }
}
