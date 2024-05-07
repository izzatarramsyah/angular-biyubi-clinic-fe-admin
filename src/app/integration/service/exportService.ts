import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from "../../entity/ApiResponse";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ExportService {
  
    constructor(private httpClient: HttpClient, 
                private http: HttpClient) {
    }
  
    schedule(payload) {
      return this.http
      .post(`${environment.apiUrl}/biyubi-clinic-backend/export/excel`, payload, { responseType:'blob' })
      .toPromise();
    }

    report(payload) {
      return this.http
      .post(`${environment.apiUrl}/biyubi-clinic-backend/export/pdf`, payload, { responseType:'blob' })
      .toPromise();
    }

}
