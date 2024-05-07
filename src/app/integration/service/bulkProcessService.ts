import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from "../../entity/ApiResponse";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class BulkProcessService {
  
    constructor(private httpClient: HttpClient, 
                private http: HttpClient) {
    }
  
    bulkProcess(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/biyubi-clinic-backend/upload/bulkProcess`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 

}
