import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from "../../entity/ApiResponse";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class MasterService {
  
    constructor(private httpClient: HttpClient, 
                private http: HttpClient) {
    }
  
    getListMst(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/mst/getListMst`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 
  
    processMstVaccine(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/mst/processMstVaccine`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 

    processMstCheckUp(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/mst/processMstCheckUp`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 

}
