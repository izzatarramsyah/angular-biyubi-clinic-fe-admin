import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from "../../entity/ApiResponse";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuditTrailService {
  
    constructor(private httpClient: HttpClient, 
                private http: HttpClient) {
    }
  
    listActivity(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/biyubi-clinic-backend/userAdmin/getLogs`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 

}
