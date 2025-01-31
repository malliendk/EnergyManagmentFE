import {Component, EventEmitter, Input, Output} from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-update-button',
  templateUrl: './update-button.component.html',
  styleUrls: ['./update-button.component.css']
})
export class UpdateButtonComponent {

  @Input() id!: number;
  @Input() entity!: any;
  @Output() updateCall = new EventEmitter<{ status: string, data?: any, error?: any }>();

  constructor(private http: HttpClient) {
  }

  update(id: number, entity: any) {
    let updateUrl = `http://localhost:8080/${entity}/${id}`;
    return this.http.put(updateUrl, entity)
      .subscribe({
          next: response => {
            this.updateCall.emit({status: 'success', data: response});
          },
          error: error => {
            this.updateCall.emit({status: "error", error: error})
          }
        }
      );
  }
}
