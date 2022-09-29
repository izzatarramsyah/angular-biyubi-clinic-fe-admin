import { OnInit, Component, AfterViewInit, EventEmitter, Output , Type, ViewChild} from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { first } from 'rxjs/operators';
import { UserAdminService } from '../../../integration/service/userAdminService';
import { UserAdmin } from "../../../entity/userAdmin";
import { Router } from '@angular/router';
import { LoadingComponent } from "../../components/loading/loading.component";
import { ProfileComponent } from "../../components/profile/profile.component";
import { QRCodeComponent } from "../../components/qrcode/qrcode.component";
import { DatePipe } from '@angular/common';
import { QRCodeService } from '../../../integration/service/qrCodeService';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  userAdmin : UserAdmin;
  qrCode : string; 
  message : string;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
              private userAdminService: UserAdminService,
              private router: Router,
              private datepipe: DatePipe,
              private qRCodeService: QRCodeService) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    
  }

  showModalProfile(){
    const modalRef = this.modalService.open(ProfileComponent);
    modalRef.componentInstance.username = this.userAdmin.username;
    modalRef.componentInstance.lastActivity = this.datepipe.transform(this.userAdmin.lastActivity, "MM / dd / yyyy hh:mm:ss");
    modalRef.componentInstance.joinDate = this.datepipe.transform(this.userAdmin.createdDtm, "MM / dd / yyyy hh:mm:ss");
  }

  showModalQR(){
    this.modalService.open(QRCodeComponent);
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
        "session" : user.sessionId,
        "channel" : "WEB"
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
