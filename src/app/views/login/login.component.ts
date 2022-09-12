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
  validSession = false;
  @ViewChild('username') inputUsername : ElementRef;
  @ViewChild('password') inputPassword : ElementRef;

  constructor(private http: HttpClient, 
              private router: Router,
              private userAdminService: UserAdminService,
              private modalService: NgbModal) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
  }

  login(){
    this.username = this.inputUsername.nativeElement.value;
    this.password = this.inputPassword.nativeElement.value;
    this.usernameEmpty = false;
    this.passwordEmpty = false;
    this.isValid = true;
    this.loading = true;
    this.validSession = false;

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
        }
      };
      this.userAdminService.login(JSON.stringify(payload)).
      pipe(first()).subscribe(data => {
        this.loading = false;
        if (data.header.responseCode == '00' ){
          this.router.navigate(['/dashboard']);
        }else if (data.header.responseCode == '08') {
          this.validSession = true;
        }else {
          this.isValid = false;
        }
      },error => {
        console.log('error : ', error);
      });
    }
  }

}
