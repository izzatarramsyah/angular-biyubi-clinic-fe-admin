import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAdminService } from '../../integration/service/userAdminService';
import { catchError, first, retry} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserAdmin } from "../../entity/userAdmin";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  userAdmin : UserAdmin;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  username : string;
  password : string;
  usernameEmpty = false;
  passwordEmpty = false;
  isValid = true;
  loading = false;
  errorMessage : string;
 
  constructor(private router: Router,
              private userAdminService: UserAdminService ) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.username = '';
    this.password = '';
  }

  login(){

    this.usernameEmpty = false;
    this.passwordEmpty = false;
    this.isValid = true;
    this.loading = true;

    if (this.username == '' && this.password == ''){
      this.loading = false;
      this.passwordEmpty = true;
      this.usernameEmpty = true;
    } 
    
    if (this.username == ''){
      this.loading = false;
      this.usernameEmpty = true;
    } 
    
    if (this.password == ''){
      this.loading = false;
      this.passwordEmpty = true;
    }
    
    if (this.usernameEmpty == false && this.passwordEmpty == false) {
      let payload = {
        "payload":{
          "username": this.username,
          "password" : this.password
        },
        "header": { 
          "channel" : "WEB"
        }
      };
      this.userAdminService.login(JSON.stringify(payload)).
      pipe(first()).subscribe(data => {
        this.loading = false;
        if (data.header.responseCode == '00' ){
          this.router.navigate(['/dashboard']);
        }else {
          this.isValid = false;
          this.errorMessage = data.header.responseMessage;
        }
      },error => {
        console.log('error : ', error);
      });
    }

  }

}
