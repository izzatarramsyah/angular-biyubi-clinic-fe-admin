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
   
    addCheckUpRecord(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/record/addCheckUpRecord`, payload)
        .pipe(map(res => {
            return res;
        }));
    } 

    addVaccineRecord(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/record/addVaccineRecord`, payload)
        .pipe(map(res => {
            return res;
        }));
    } 
    
    getSchedule(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/record/getSchedule`, payload)
        .pipe(map(res => {
            return res;
        }));
    } 

}
