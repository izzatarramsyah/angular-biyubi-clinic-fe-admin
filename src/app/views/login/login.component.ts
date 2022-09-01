import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAdminService } from '../../integration/service/userAdminService';
import { catchError, first, retry} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  username : string;
  password : string;
  usernameEmpty = false;
  passwordEmpty = false;
  isValid = true;
  loading = false;
  @ViewChild('username') inputUsername : ElementRef;
  @ViewChild('password') inputPassword : ElementRef;

  constructor(private http: HttpClient, 
              private router: Router,
              private userAdminService: UserAdminService,
              private modalService: NgbModal) { 
      const user = this.userAdminService.userAdminValue;
      if (user){
        this.router.navigate(['/dashboard']);
      }
  }

  ngOnInit() {
  }

  login(){
    console.log("login");
    this.username = this.inputUsername.nativeElement.value;
    this.password = this.inputPassword.nativeElement.value;
    this.usernameEmpty = false;
    this.passwordEmpty = false;
    this.isValid = true;
    this.loading = true;

    if (this.username == '' && this.password == ''){
      this.loading = false;
      this.passwordEmpty = true;
      this.usernameEmpty = true;
    } else if (this.username == ''){
      this.loading = false;
      this.usernameEmpty = true;
    } else if (this.password == ''){
      this.loading = false;
      this.passwordEmpty = true;
    }else{
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
          if (data.payload.message == 'Login Success') {
            this.router.navigate(['/dashboard']);
          } else {
            this.isValid = false;
          }
        }else{
          this.isValid = false;
        }
      },error => {
        console.log('error : ', error);
      });
    }
  }

}
