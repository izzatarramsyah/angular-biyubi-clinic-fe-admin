import { OnInit, Component, AfterViewInit, EventEmitter, Output , Type, ViewChild} from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { first } from 'rxjs/operators';
import { UserAdminService } from '../../../integration/service/userAdminService';
import { UserAdmin } from "../../../entity/userAdmin";
import { Router } from '@angular/router';
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  userAdmin : UserAdmin;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
              private userAdminService: UserAdminService,
              private router: Router) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.checkSession();
  }

  checkSession(){
    if (this.userAdmin) {
      let payload = { 
        "payload": {  
          "username" : this.userAdmin.username, 
          "password" : this.userAdmin.password 
        },
        "header":{ 
          "uName" : this.userAdmin.username, 
          "session" : this.userAdmin.sessionId 
        }
      };
      this.userAdminService.checkSession(JSON.stringify(payload))
      .pipe(first())
      .subscribe(data => {
        const user = this.userAdminService.userAdminValue;
        if (data.header.responseCode == '00' ){
          this.userAdmin = user;
        } else {
          this.router.navigate(['/login']);
        }
      },
      error => {
        console.log('error : ', error);
      });
    }else {
      this.router.navigate(['/login']);
    }
  }

  logout(){
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    const user = this.userAdminService.userAdminValue;
    let payload = { 
      "payload": { 
        "username": user.username
      },
      "header": { 
        "uName":user.username, 
        "session" : user.sessionId 
      }
    };
    this.userAdminService.logout(JSON.stringify(payload)).
    pipe(first()).subscribe(data => {
      if (data.header.responseCode == '00' ){
        this.modalService.dismissAll(LoadingComponent);
        this.router.navigate(['/login']);
      }
    },error => {
      console.log('error : ', error);
    });
  } 

}
