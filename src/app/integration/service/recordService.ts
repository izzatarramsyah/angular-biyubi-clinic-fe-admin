import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from "../../entity/ApiResponse";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class RecordService {
  
    constructor(private httpClient: HttpClient, 
                private http: HttpClient) {
    }
   
    checkUpRecord(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/biyubi-clinic-backend/record/checkUpRecord`, payload)
        .pipe(map(res => {
            return res;
        }));
    } 

    vaccineRecord(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/biyubi-clinic-backend/record/vaccineRecord`, payload)
        .pipe(map(res => {
            return res;
        }));
    } 
    
    getSchedule(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/biyubi-clinic-backend/record/getSchedule`, payload)
        .pipe(map(res => {
            return res;
        }));
    } 

}
