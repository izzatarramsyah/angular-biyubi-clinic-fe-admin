import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAdmin } from '../../entity/userAdmin';
import { ApiResponse} from "../../entity/ApiResponse";
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserAdminService {

    private userAdminSubject : BehaviorSubject<UserAdmin>;
    public userAdmin : Observable<UserAdmin>;

    constructor(private http: HttpClient){
        this.userAdminSubject = new BehaviorSubject<UserAdmin>(JSON.parse(localStorage.getItem('userAdmin')));
        this.userAdmin = this.userAdminSubject.asObservable();
    }

    public get userAdminValue(): UserAdmin {
        return this.userAdminSubject.value;
    }

    login(payload : string) {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/clinic/userAdmin/login`, payload)
          .pipe(map(res => {
            if (res.header.responseCode === '00') {
              localStorage.setItem('userAdmin', JSON.stringify(res.payload.object));
              this.userAdminSubject.next(res.payload.object);
            }
            return res;
          }));
    }

    checkSession(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/clinic/userAdmin/checkSession`, payload)
        .pipe(map(res => {
          if (res.header.responseCode != '00') {
            const user = res.payload.object;
            this.userAdminSubject.next(user);
            localStorage.removeItem('userAdmin');
          }
          return res;
        }));
    } 

    logout(payload : string) {
      return this.http.post<ApiResponse>(`${environment.apiUrl}/clinic/userAdmin/logout`, payload)
        .pipe(map(res => {
          const user = res.payload.object;
          this.userAdminSubject.next(user);
          localStorage.removeItem('userAdmin');
          return res;
        }));
    }
    
}