import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from "../../entity/ApiResponse";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
    constructor(private httpClient: HttpClient, 
                private http: HttpClient) {
    }
  
    getUser(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/user/getUser`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 

    userProcess(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/user/userProcess`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 
    
    childProcess(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/admin-clinic/user/childProcess`, payload)
      .pipe(map(res => {
        return res;
      }));
    } 

}
