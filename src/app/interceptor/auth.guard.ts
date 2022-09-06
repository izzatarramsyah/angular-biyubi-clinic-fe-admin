import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAdminService } from '../integration/service/userAdminService';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  routeURL: string;

  constructor( private router: Router, private userAdminService: UserAdminService ) {
    this.routeURL = this.router.url;
  }

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.userAdminService.userAdminValue;
    if (user){
      let payload = {
        "header":{
          "session":user.sessionId,
          "uName":user.username
        }
      };
      this.userAdminService.checkSession(JSON.stringify(payload))
        .pipe(first())
        .subscribe(data => {
          this.routeURL = this.router.url;
          if (data.header.responseCode == '00'){
            return true;
          }else if (data.header.responseCode == '00' && this.router.url === '/login'){
            this.router.navigate(['/dashboard']);
            return true;
          }else {
            this.router.navigate(['/login']);
            return true;
          }
        },
        error => {
        });
      return true;
    }else {
      this.router.navigate(['/login']);
      return true;
    }
  }
  
}
